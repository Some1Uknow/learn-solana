import { NextRequest, NextResponse } from 'next/server';
import * as jose from 'jose';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/users';
import { eq } from 'drizzle-orm';

// Reusable auth verification similar to chat route
const JWKS_URL = 'https://api-auth.web3auth.io/.well-known/jwks.json';
const jwks = jose.createRemoteJWKSet(new URL(JWKS_URL));

async function verifyAuthentication(req: Request): Promise<{ isAuthenticated: boolean; user?: any; token?: string }> {
  try {
    const authHeader = req.headers.get('authorization');
    let token = authHeader?.split(' ')[1];
    console.log('[register] Incoming auth header:', authHeader ? 'present' : 'none');
    if (!token) {
      const cookie = req.headers.get('cookie');
      console.log('[register] Cookie header present:', !!cookie);
      if (cookie) {
        const cookies = cookie.split(';').reduce((acc: Record<string,string>, pair) => {
          const [k,v] = pair.trim().split('=');
          acc[k] = v; return acc;
        }, {});
        token = cookies.web3auth_token;
        console.log('[register] Extracted web3auth_token cookie:', token ? 'present' : 'absent');
      }
    }
    if (!token) return { isAuthenticated: false };

    const { payload } = await jose.jwtVerify(token, jwks, { algorithms: ['ES256'] });
    console.log('[register] JWT verified. Payload keys:', Object.keys(payload));
    return { isAuthenticated: true, token, user: payload };
  } catch (e) {
    console.error('Auth fail', e);
    return { isAuthenticated: false };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const authType = body?.authType as 'social' | 'external_wallet' | undefined;
    const xWallet = req.headers.get('x-wallet-address') || body?.walletAddress;
    const xSig = req.headers.get('x-wallet-signature') || body?.signature;
    const { email, name, profileImage } = body || {};

    let walletAddress = xWallet as string | undefined;
    let authToken: string | undefined;
    if (!authType || authType === 'social') {
      // Social path: require and verify Web3Auth JWT
      const auth = await verifyAuthentication(req);
      if (!auth.isAuthenticated || !auth.user) {
        return new Response(
          JSON.stringify({ error: 'Authentication required', detail: 'Missing or invalid Web3Auth identity token.'}),
          { status: 401 }
        );
      }
      authToken = auth.token;
      // Wallet address still required from body to associate user
      walletAddress = typeof body?.walletAddress === 'string' ? body.walletAddress : undefined;
    } else if (authType === 'external_wallet') {
      // Minimal check: must have walletAddress
      if (!walletAddress || typeof walletAddress !== 'string') {
        return new Response(JSON.stringify({ error: 'walletAddress required for external_wallet'}), { status: 400 });
      }
      // Optional: signature verification can be added here for Solana (ed25519)
      // We accept unsigned for now to improve UX; can be tightened later.
    }

    if (!walletAddress || typeof walletAddress !== 'string') {
      return new Response(JSON.stringify({ error: 'walletAddress required'}), { status: 400 });
    }

    // We intentionally ignore other token fields for minimal schema

    // Upsert logic: try find existing
    const existing = await db.query.users.findFirst({ where: eq(users.walletAddress, walletAddress) });
    let saved;
    const now = new Date();
    if (existing) {
      await db.update(users)
        .set({
          email: email ?? existing.email,
          name: name ?? existing.name,
          profileImage: profileImage ?? existing.profileImage,
          updatedAt: now,
        })
        .where(eq(users.id, existing.id));
      saved = { ...existing, email: email ?? existing.email, name: name ?? existing.name, profileImage: profileImage ?? existing.profileImage, updatedAt: now };
    } else {
      const inserted = await db.insert(users).values({ walletAddress, email, name, profileImage }).returning();
      saved = inserted[0];
    }

    const response = NextResponse.json({ user: saved }, { status: 200 });
    if (authToken) {
      response.cookies.set({
        name: 'web3auth_token',
        value: authToken,
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV !== 'development',
      });
    }

    return response;
  } catch (error) {
    console.error('User register error', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error'}), { status: 500 });
  }
}
