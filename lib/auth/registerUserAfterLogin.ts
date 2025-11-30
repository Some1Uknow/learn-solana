"use client";

import { SolanaWallet } from "@web3auth/solana-provider";
import { IProvider } from "@web3auth/modal";
import { SIGN_MESSAGE_PREFIX } from "@/lib/solana/signature";

interface Web3AuthInstance {
  authenticateUser?: () => Promise<{ idToken?: string; token?: string } | string>;
  getUserInfo?: () => Promise<{
    email?: string;
    name?: string;
    profileImage?: string;
    idToken?: string;
    token?: string;
  }>;
  connectedAdapterName?: string;
}

interface RegisterResult {
  success: boolean;
  user?: any;
  error?: string;
}

/**
 * Persists the Web3Auth token in a cookie for SSR and API routes.
 */
function persistWeb3AuthToken(token: string | undefined | null): void {
  if (!token || typeof window === "undefined") return;
  try {
    (window as any).__WEB3AUTH_ID_TOKEN = token;
    const parts = [
      `web3auth_token=${token}`,
      "Path=/",
      "SameSite=Lax",
      "Max-Age=604800",
    ];
    if (window.location?.protocol === "https:") {
      parts.push("Secure");
    }
    document.cookie = parts.join("; ");
  } catch (err) {
    console.warn("[registerUserAfterLogin] failed to persist token", err);
  }
}

/**
 * Gets the wallet address from the provider synchronously after connect.
 */
async function getWalletAddress(provider: IProvider): Promise<string | null> {
  try {
    const wallet = new SolanaWallet(provider as any);
    const accounts = await wallet.requestAccounts();
    return Array.isArray(accounts) ? accounts[0] : accounts;
  } catch (e) {
    // Fallback to generic provider request
    try {
      const accounts = await (provider as any).request?.({
        method: "getAccounts",
        params: {},
      });
      return Array.isArray(accounts) ? accounts[0] : accounts;
    } catch {
      return null;
    }
  }
}

/**
 * Determines if this is an external wallet connection (Phantom, MetaMask, etc.)
 */
function isExternalWalletConnection(web3Auth: Web3AuthInstance): boolean {
  const connectedAdapter = web3Auth.connectedAdapterName;
  if (!connectedAdapter) return false;

  const externalWallets = [
    "metamask",
    "phantom",
    "wallet-connect-v2",
    "solflare",
    "slope",
    "sollet",
  ];
  return externalWallets.includes(connectedAdapter.toLowerCase());
}

/**
 * Registers a user with external wallet (no idToken required, uses signature).
 */
async function registerExternalWallet(
  walletAddress: string,
  provider: IProvider,
  web3Auth: Web3AuthInstance
): Promise<RegisterResult> {
  const message = `${SIGN_MESSAGE_PREFIX}${walletAddress}`;
  let signature: string | undefined;

  try {
    const wallet = new SolanaWallet(provider as any);
    const sigBytes = await wallet.signMessage(
      new TextEncoder().encode(message)
    );
    const { default: bs58 } = await import("bs58");
    signature = bs58.encode(sigBytes);
  } catch (signErr) {
    console.warn(
      "[registerUserAfterLogin] signMessage unavailable for external wallet"
    );
  }

  const res = await fetch("/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Wallet-Address": walletAddress,
      ...(signature ? { "X-Wallet-Signature": signature } : {}),
    },
    body: JSON.stringify({
      walletAddress,
      authType: "external_wallet",
      connectedAdapter: web3Auth.connectedAdapterName,
      signature: signature || null,
      message,
      timestamp: Date.now(),
      email: null,
      name: null,
      profileImage: null,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error("[registerUserAfterLogin] external register failed", res.status, txt);
    return { success: false, error: `Registration failed: ${res.status}` };
  }

  const data = await res.json();
  console.log("[registerUserAfterLogin] user registered (external)");
  return { success: true, user: data.user };
}

/**
 * Registers a user with social login (uses idToken from Web3Auth).
 */
async function registerSocialLogin(
  walletAddress: string,
  web3Auth: Web3AuthInstance
): Promise<RegisterResult> {
  // Get idToken directly from web3Auth instance
  let idToken: string | undefined;
  let userInfo: any = {};

  // Try authenticateUser first
  try {
    const tokenResult = await web3Auth.authenticateUser?.();
    idToken =
      typeof tokenResult === "string"
        ? tokenResult
        : tokenResult?.idToken || tokenResult?.token;
  } catch (e) {
    console.warn("[registerUserAfterLogin] authenticateUser failed", e);
  }

  // Get user info
  try {
    userInfo = (await web3Auth.getUserInfo?.()) || {};
    // Fallback: token might be in userInfo
    if (!idToken) {
      idToken = userInfo.idToken || userInfo.token;
    }
  } catch (e) {
    console.warn("[registerUserAfterLogin] getUserInfo failed", e);
  }

  if (!idToken) {
    return { success: false, error: "No idToken available" };
  }

  persistWeb3AuthToken(idToken);

  const res = await fetch("/api/user/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      walletAddress,
      authType: "social",
      email: userInfo.email,
      name: userInfo.name,
      profileImage: userInfo.profileImage,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error("[registerUserAfterLogin] social register failed", res.status, txt);
    return { success: false, error: `Registration failed: ${res.status}` };
  }

  const data = await res.json();
  console.log("[registerUserAfterLogin] user registered (social)");
  return { success: true, user: data.user };
}

/**
 * Main function to register user immediately after login.
 * Call this directly after connect() resolves with a provider.
 *
 * @param provider - The provider returned from connect()
 * @param web3Auth - The web3Auth instance
 * @param onSuccess - Optional callback on successful registration
 * @param maxRetries - Maximum number of retries (default 3)
 */
export async function registerUserAfterLogin(
  provider: IProvider,
  web3Auth: Web3AuthInstance,
  onSuccess?: (user: any) => void,
  maxRetries: number = 3
): Promise<RegisterResult> {
  console.log("[registerUserAfterLogin] Starting registration...");

  // Step 1: Get wallet address from provider
  const walletAddress = await getWalletAddress(provider);
  if (!walletAddress) {
    console.error("[registerUserAfterLogin] Could not get wallet address");
    return { success: false, error: "Could not get wallet address" };
  }

  console.log("[registerUserAfterLogin] Wallet address:", walletAddress);

  // Step 2: Determine if external wallet or social login
  const isExternal = isExternalWalletConnection(web3Auth);

  // Step 3: Register with retries
  let lastError: string | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      let result: RegisterResult;

      if (isExternal) {
        result = await registerExternalWallet(walletAddress, provider, web3Auth);
      } else {
        result = await registerSocialLogin(walletAddress, web3Auth);
      }

      if (result.success) {
        onSuccess?.(result.user);
        return result;
      }

      lastError = result.error;

      // Wait before retry (exponential backoff)
      if (attempt < maxRetries - 1) {
        const delay = 500 * Math.pow(2, attempt);
        console.log(`[registerUserAfterLogin] Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : "Unknown error";
      console.error(`[registerUserAfterLogin] Attempt ${attempt + 1} failed:`, err);

      if (attempt < maxRetries - 1) {
        const delay = 500 * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  return { success: false, error: lastError || "Registration failed after retries" };
}

/**
 * Helper to check if user is already registered.
 * Can be used to skip registration if user already exists.
 */
export async function checkUserRegistered(walletAddress: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ walletAddress, authType: "check" }),
    });
    // If we get a 200, user exists
    return res.ok;
  } catch {
    return false;
  }
}
