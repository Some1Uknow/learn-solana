import * as jose from "jose";
import { APP_SESSION_COOKIE, verifyAppSessionToken } from "@/lib/auth/appSession";

const JWKS_URL = "https://api-auth.web3auth.io/.well-known/jwks.json";
const jwks = jose.createRemoteJWKSet(new URL(JWKS_URL));
const WEB3AUTH_EXPECTED_AUD = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
const WEB3AUTH_EXPECTED_ISS = "https://api-auth.web3auth.io";

export interface VerifiedWeb3AuthToken {
  raw: string;
  payload: any;
  source: "app_session" | "web3auth";
}

function parseCookieHeader(cookieHeader: string | null): Record<string, string> {
  if (!cookieHeader) return {};

  return Object.fromEntries(
    cookieHeader
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        if (index === -1) return [part, ""];
        return [part.slice(0, index), part.slice(index + 1)];
      })
  );
}

export async function extractBearerOrCookie(req: Request): Promise<string | null> {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length) || null;
  }

  const cookies = parseCookieHeader(req.headers.get("cookie"));
  return cookies.web3auth_token || null;
}

export async function verifyWeb3Auth(req: Request): Promise<VerifiedWeb3AuthToken | null> {
  try {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.slice("Bearer ".length) || null;
      if (!token) return null;

      const { payload } = await jose.jwtVerify(token, jwks, {
        algorithms: ["ES256"],
        issuer: WEB3AUTH_EXPECTED_ISS,
        audience: WEB3AUTH_EXPECTED_AUD || undefined,
      });

      return { raw: token, payload, source: "web3auth" };
    }

    const cookies = parseCookieHeader(req.headers.get("cookie"));
    const appSessionToken = cookies[APP_SESSION_COOKIE];
    if (appSessionToken) {
      const payload = await verifyAppSessionToken(appSessionToken);
      if (payload) {
        return { raw: appSessionToken, payload, source: "app_session" };
      }
    }

    const token = cookies.web3auth_token || null;
    if (!token) return null;

    const { payload } = await jose.jwtVerify(token, jwks, {
      algorithms: ["ES256"],
      issuer: WEB3AUTH_EXPECTED_ISS,
      audience: WEB3AUTH_EXPECTED_AUD || undefined,
    });

    return { raw: token, payload, source: "web3auth" };
  } catch {
    return null;
  }
}

export function deriveWalletFromPayload(payload: any): string | null {
  const fromWallets = payload?.wallets?.find((wallet: any) => typeof wallet?.address === "string")?.address;
  if (typeof fromWallets === "string" && isLikelyBase58Address(fromWallets)) {
    return fromWallets;
  }

  const direct = payload?.walletAddress;
  if (typeof direct === "string" && isLikelyBase58Address(direct)) {
    return direct;
  }

  const sub = payload?.sub;
  if (typeof sub === "string" && isLikelyBase58Address(sub)) {
    return sub;
  }

  return null;
}

export function isLikelyBase58Address(str: string | null | undefined): boolean {
  if (!str) return false;
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(str);
}
