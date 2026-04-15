import { PrivyClient } from "@privy-io/node";
import type { User as PrivyServerUser } from "@privy-io/node";

type VerifiedPrivyAccessToken = {
  userId: string;
  sessionId: string;
  appId: string;
  issuer: string;
  issuedAt: number;
  expiration: number;
};

let privyClient: PrivyClient | null = null;

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

export function extractPrivyAccessToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length).trim();
    if (token) return token;
  }

  const cookies = parseCookieHeader(req.headers.get("cookie"));
  return cookies.privy_token || null;
}

function getPrivyClient() {
  if (privyClient) return privyClient;

  const appId = process.env.PRIVY_APP_ID || process.env.NEXT_PUBLIC_PRIVY_APP_ID;
  const appSecret = process.env.PRIVY_APP_SECRET;

  if (!appId || !appSecret) {
    throw new Error("Missing Privy server credentials");
  }

  privyClient = new PrivyClient({
    appId,
    appSecret,
  });

  return privyClient;
}

export async function getPrivyUserById(userId: string): Promise<PrivyServerUser | null> {
  try {
    return await getPrivyClient().users()._get(userId);
  } catch {
    return null;
  }
}

export async function verifyPrivyAccessToken(
  accessToken: string
): Promise<VerifiedPrivyAccessToken | null> {
  try {
    const verified = await getPrivyClient().utils().auth().verifyAccessToken(accessToken);
    return {
      userId: verified.user_id,
      sessionId: verified.session_id,
      appId: verified.app_id,
      issuer: verified.issuer,
      issuedAt: verified.issued_at,
      expiration: verified.expiration,
    };
  } catch {
    return null;
  }
}

export async function requirePrivyUser(req: Request) {
  const accessToken = extractPrivyAccessToken(req);
  if (!accessToken) return null;

  const verified = await verifyPrivyAccessToken(accessToken);
  if (!verified) return null;

  return {
    accessToken,
    ...verified,
  };
}
