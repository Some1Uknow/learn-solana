import { NextRequest } from 'next/server';
import * as jose from 'jose';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema/users';
import { eq } from 'drizzle-orm';

// Reusable auth verification similar to chat route
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

  const jwks = jose.createRemoteJWKSet(new URL('https://api-auth.web3auth.io/jwks'));
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
    const auth = await verifyAuthentication(req);
    if (!auth.isAuthenticated || !auth.user) {
      return new Response(JSON.stringify({ error: 'Authentication required', detail: 'Missing or invalid Web3Auth identity token. Ensure getIdentityToken() succeeds client-side.'}), { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { walletAddress, email, name, profileImage } = body || {};
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

    return new Response(JSON.stringify({ user: saved }), { status: 200, headers: { 'Content-Type': 'application/json' }});
  } catch (error) {
    console.error('User register error', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error'}), { status: 500 });
  }
}
