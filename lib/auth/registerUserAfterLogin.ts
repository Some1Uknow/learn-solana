"use client";

import { IProvider } from "@web3auth/modal";
import { SolanaWallet } from "@web3auth/solana-provider";
import { getPrimarySolanaAccount } from "@/lib/auth/web3auth-solana";
import { persistClientAuthToken } from "@/lib/auth/session";

interface Web3AuthInstance {
  idToken?: string | null;
  authenticateUser?: () => Promise<{ idToken?: string; token?: string } | string>;
  getIdentityToken?: () => Promise<{ idToken?: string } | null>;
  getUserInfo?: () => Promise<{
    email?: string;
    name?: string;
    profileImage?: string;
    idToken?: string;
    token?: string;
  }>;
  connectedConnectorName?: string | null;
}

interface RegisterResult {
  success: boolean;
  user?: any;
  error?: string;
}

/**
 * Gets the wallet address from the provider synchronously after connect.
 */
async function getWalletAddress(provider: IProvider): Promise<string | null> {
  try {
    const wallet = new SolanaWallet(provider as any);
    const accounts = await wallet.requestAccounts();
    const resolved = Array.isArray(accounts) ? accounts[0] : accounts;
    if (typeof resolved === "string" && resolved.length > 0) {
      return resolved;
    }
  } catch {
    // Fall through to older provider methods.
  }

  try {
    const accounts = await (provider as any).request?.({
      method: "getAccounts",
      params: {},
    });
    const resolved = Array.isArray(accounts) ? accounts[0] : accounts;
    if (typeof resolved === "string" && resolved.length > 0) {
      return resolved;
    }
  } catch {
    // Fall through to the shared helper.
  }

  return getPrimarySolanaAccount(provider);
}

async function resolveWalletAddress(
  provider: IProvider,
  maxRetries: number,
  resolvedWalletAddress?: string | null
): Promise<string | null> {
  if (resolvedWalletAddress && resolvedWalletAddress.length > 0) {
    return resolvedWalletAddress;
  }

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const walletAddress = await getWalletAddress(provider);
    if (walletAddress) {
      return walletAddress;
    }

    if (attempt < maxRetries - 1) {
      await new Promise((resolve) => setTimeout(resolve, 350 * (attempt + 1)));
    }
  }

  return null;
}

/**
 * Gets the Web3Auth identity token, preferring the older direct API that
 * matched the previously working social flow.
 */
async function getIdentityToken(
  web3Auth: Web3AuthInstance
): Promise<string | undefined> {
  if (web3Auth.idToken) {
    return web3Auth.idToken;
  }

  try {
    const tokenResult = await web3Auth.authenticateUser?.();
    const resolved =
      typeof tokenResult === "string"
        ? tokenResult
        : tokenResult?.idToken || tokenResult?.token;
    if (resolved) {
      return resolved;
    }
  } catch (error) {
    console.warn("[registerUserAfterLogin] authenticateUser failed", error);
  }

  for (let attempt = 0; attempt < 6; attempt++) {
    if (web3Auth.idToken) {
      return web3Auth.idToken;
    }

    try {
      const tokenInfo = await web3Auth.getIdentityToken?.();
      if (tokenInfo?.idToken) {
        return tokenInfo.idToken;
      }
    } catch (error) {
      if (attempt === 5) {
        console.warn("[registerUserAfterLogin] getIdentityToken failed", error);
      }
    }

    if (attempt < 5) {
      await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
    }
  }

  return undefined;
}

/**
 * Registers a user with Web3Auth-backed social auth.
 * This path is now used only for Google/social login.
 */
async function registerWalletSession(
  walletAddress: string,
  web3Auth: Web3AuthInstance
): Promise<RegisterResult> {
  const registrationPayload = await buildRegistrationPayload(walletAddress, web3Auth);

  const res = await fetch("/api/user/register", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      ...registrationPayload.headers,
    },
    body: JSON.stringify({
      walletAddress,
      authType: "social",
      ...registrationPayload.body,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    console.error("[registerUserAfterLogin] register failed", res.status, txt);
    return { success: false, error: `Registration failed: ${res.status}` };
  }

  const data = await res.json();
  console.log("[registerUserAfterLogin] user registered");
  return { success: true, user: data.user };
}

async function buildRegistrationPayload(
  walletAddress: string,
  web3Auth: Web3AuthInstance
) {
  const headers: Record<string, string> = {
    "X-Wallet-Address": walletAddress,
  };
  const body: Record<string, unknown> = {};
  const [idToken, userInfoResult] = await Promise.all([
    getIdentityToken(web3Auth),
    web3Auth
      .getUserInfo?.()
      .catch((error) => {
        console.warn("[registerUserAfterLogin] getUserInfo failed", error);
        return {};
      }) ?? Promise.resolve({}),
  ]);

  const userInfo: any = userInfoResult || {};
  const resolvedToken = idToken || userInfo.idToken || userInfo.token;

  if (resolvedToken) {
    persistClientAuthToken(resolvedToken);
    headers.Authorization = `Bearer ${resolvedToken}`;
  }

  body.email = userInfo.email ?? null;
  body.name = userInfo.name ?? null;
  body.profileImage = userInfo.profileImage ?? null;

  return { headers, body };
}

/**
 * Main function to register user immediately after social login.
 * Call this directly after the Web3Auth social connect step resolves.
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
  maxRetries: number = 3,
  resolvedWalletAddress?: string | null
): Promise<RegisterResult> {
  console.log("[registerUserAfterLogin] Starting registration...");

  // Step 1: Get wallet address from provider
  const walletAddress = await resolveWalletAddress(
    provider,
    Math.max(maxRetries, 3),
    resolvedWalletAddress
  );
  if (!walletAddress) {
    console.error("[registerUserAfterLogin] Could not get wallet address");
    return { success: false, error: "Could not get wallet address" };
  }

  console.log("[registerUserAfterLogin] Wallet address:", walletAddress);

  // Step 2: Register with retries
  let lastError: string | undefined;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      let result: RegisterResult;

      result = await registerWalletSession(walletAddress, web3Auth);

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
