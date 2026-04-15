import {
  extractPrivyAccessToken,
  requirePrivyUser,
} from "@/lib/auth/privy-server";

export interface VerifiedWeb3AuthToken {
  raw: string;
  payload: any;
  source: "privy";
}

export interface ResolvedAuthenticatedWallet {
  walletAddress: string | null;
  error: "wallet_mismatch" | "invalid_wallet" | null;
}

export async function extractBearerOrCookie(req: Request): Promise<string | null> {
  return extractPrivyAccessToken(req);
}

export async function verifyWeb3Auth(req: Request): Promise<VerifiedWeb3AuthToken | null> {
  const verified = await requirePrivyUser(req);
  if (!verified) {
    return null;
  }

  return {
    raw: verified.accessToken,
    payload: {
      sub: verified.userId,
      sid: verified.sessionId,
      aud: verified.appId,
      iss: verified.issuer,
      iat: verified.issuedAt,
      exp: verified.expiration,
    },
    source: "privy",
  };
}

export function deriveWalletFromPayload(payload: any): string | null {
  const direct = payload?.walletAddress;
  if (typeof direct === "string" && isLikelyBase58Address(direct)) {
    return direct;
  }

  return null;
}

export function extractWalletFromRequest(req: Request): string | null {
  const headerWallet = req.headers.get("x-wallet-address")?.trim();
  if (headerWallet) {
    return headerWallet;
  }

  try {
    const requestUrl = new URL(req.url);
    const queryWallet = requestUrl.searchParams.get("walletAddress")?.trim();
    if (queryWallet) {
      return queryWallet;
    }
  } catch {
    // Ignore invalid or relative URLs in non-Next contexts.
  }

  return null;
}

export function resolveAuthenticatedWallet(
  req: Request,
  payload: any
): ResolvedAuthenticatedWallet {
  const tokenWallet = deriveWalletFromPayload(payload);
  const requestWallet = extractWalletFromRequest(req);

  if (requestWallet && !isLikelyBase58Address(requestWallet)) {
    return { walletAddress: null, error: "invalid_wallet" };
  }

  if (requestWallet && tokenWallet && requestWallet !== tokenWallet) {
    return { walletAddress: null, error: "wallet_mismatch" };
  }

  return {
    walletAddress: requestWallet ?? tokenWallet,
    error: null,
  };
}

export function isLikelyBase58Address(str: string | null | undefined): boolean {
  if (!str) return false;
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(str);
}
