import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { NextResponse } from 'next/server';

export const APP_SESSION_COOKIE = 'learnsol_session';
const APP_SESSION_ISSUER = 'learn.sol';
const APP_SESSION_AUDIENCE = 'learn.sol.app';
const APP_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export interface AppSessionPayload extends JWTPayload {
  walletAddress: string;
  authMethod: 'social' | 'external_wallet' | 'native_wallet';
  email?: string | null;
  name?: string | null;
  profileImage?: string | null;
}

export interface WalletChallengePayload extends JWTPayload {
  walletAddress: string;
  nonce: string;
}

function resolveSecretSource(): string | null {
  return (
    process.env.APP_AUTH_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.JWT_SECRET ||
    (process.env.NODE_ENV !== 'production' ? 'learn-sol-dev-session-secret' : null)
  );
}

function getSecretKey(): Uint8Array {
  const secret = resolveSecretSource();
  if (!secret) {
    throw new Error('Missing APP_AUTH_SECRET (or AUTH_SECRET/JWT_SECRET) for app sessions');
  }
  return new TextEncoder().encode(secret);
}

export function canIssueAppSession(): boolean {
  return Boolean(resolveSecretSource());
}

export async function signAppSession(payload: Omit<AppSessionPayload, 'iss' | 'aud'>) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuer(APP_SESSION_ISSUER)
    .setAudience(APP_SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(`${APP_SESSION_MAX_AGE_SECONDS}s`)
    .sign(getSecretKey());
}

export async function verifyAppSessionToken(token: string): Promise<AppSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ['HS256'],
      issuer: APP_SESSION_ISSUER,
      audience: APP_SESSION_AUDIENCE,
    });

    if (typeof payload.walletAddress !== 'string' || payload.walletAddress.length === 0) {
      return null;
    }

    return payload as AppSessionPayload;
  } catch {
    return null;
  }
}

export async function signWalletChallenge(payload: Omit<WalletChallengePayload, "iss" | "aud">) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuer(`${APP_SESSION_ISSUER}.wallet-challenge`)
    .setAudience(`${APP_SESSION_AUDIENCE}.wallet-challenge`)
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(getSecretKey());
}

export async function verifyWalletChallengeToken(
  token: string
): Promise<WalletChallengePayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey(), {
      algorithms: ["HS256"],
      issuer: `${APP_SESSION_ISSUER}.wallet-challenge`,
      audience: `${APP_SESSION_AUDIENCE}.wallet-challenge`,
    });

    if (
      typeof payload.walletAddress !== "string" ||
      payload.walletAddress.length === 0 ||
      typeof payload.nonce !== "string" ||
      payload.nonce.length === 0
    ) {
      return null;
    }

    return payload as WalletChallengePayload;
  } catch {
    return null;
  }
}

export async function setAppSessionCookie(
  response: NextResponse,
  payload: Omit<AppSessionPayload, 'iss' | 'aud'>
) {
  const token = await signAppSession(payload);
  response.cookies.set({
    name: APP_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: APP_SESSION_MAX_AGE_SECONDS,
    secure: process.env.NODE_ENV !== 'development',
  });
  return token;
}

export function clearAppSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: APP_SESSION_COOKIE,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    secure: process.env.NODE_ENV !== 'development',
  });
}
