import * as jose from 'jose';

const JWKS_URL = 'https://api-auth.web3auth.io/.well-known/jwks.json';
const jwks = jose.createRemoteJWKSet(new URL(JWKS_URL));

export interface VerifiedWeb3AuthToken {
  raw: string;
  payload: any; // refine later
}

export async function extractBearerOrCookie(req: Request): Promise<string | null> {
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) return authHeader.split(' ')[1] || null;
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
    const cookies = Object.fromEntries(cookieHeader.split(';').map(p => p.trim().split('=')));
    if (cookies.web3auth_token) return cookies.web3auth_token;
  }
  return null;
}

export async function verifyWeb3Auth(req: Request): Promise<VerifiedWeb3AuthToken | null> {
  try {
    const token = await extractBearerOrCookie(req);
    if (!token) return null;
    const { payload } = await jose.jwtVerify(token, jwks, { algorithms: ['ES256'] });
    return { raw: token, payload };
  } catch (e) {
    return null;
  }
}

export function deriveWalletFromPayload(payload: any): string | null {
  // Different Web3Auth networks / verifiers structure wallet info variably.
  // Try common shapes; DO NOT treat sub as a Solana address unless it matches base58 length heuristics.
  const fromArray = payload?.wallets?.[0]?.address;
  if (typeof fromArray === 'string' && fromArray.length >= 32 && fromArray.length <= 44) return fromArray;
  const direct = payload?.walletAddress;
  if (typeof direct === 'string' && direct.length >= 32 && direct.length <= 44) return direct;
  // Accept sub only if plausible base58 (basic char whitelist & length) to reduce false positives.
  const sub = payload?.sub;
  if (typeof sub === 'string' && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(sub)) return sub;
  return null;
}

export function isLikelyBase58Address(str: string | null | undefined): boolean {
  if (!str) return false;
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(str);
}