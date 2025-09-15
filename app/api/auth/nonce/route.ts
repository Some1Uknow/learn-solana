import { NextRequest } from 'next/server';
import { verifyWeb3Auth } from '@/lib/auth/verifyWeb3Auth';
import { db } from '@/lib/db';
import { walletBindings } from '@/lib/db/schema/walletBindings';
import { eq } from 'drizzle-orm';
import { randomBytes } from 'crypto';

function createNonce() {
  return 'learnsol-' + randomBytes(16).toString('hex');
}

export async function POST(req: NextRequest) {
  try {
    const verified = await verifyWeb3Auth(req);
    if (!verified) return new Response(JSON.stringify({ error: 'Unauthorized'}), { status: 401 });
    const { walletAddress } = await req.json().catch(() => ({}));
    if (!walletAddress || typeof walletAddress !== 'string') {
      return new Response(JSON.stringify({ error: 'walletAddress required'}), { status: 400 });
    }
    const nonce = createNonce();
    const existing = await db.query.walletBindings.findFirst({ where: eq(walletBindings.walletAddress, walletAddress) });
    if (!existing) {
      await db.insert(walletBindings).values({ walletAddress, userSub: verified.payload.sub || 'unknown', pendingNonce: nonce });
    } else {
      await db.update(walletBindings).set({ pendingNonce: nonce, updatedAt: new Date() }).where(eq(walletBindings.id, existing.id));
    }
    return new Response(JSON.stringify({ nonce }), { status: 200 });
  } catch (e) {
    console.error('[auth/nonce] error', e);
    return new Response(JSON.stringify({ error: 'Internal error'}), { status: 500 });
  }
}
