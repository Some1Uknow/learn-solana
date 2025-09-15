import { NextRequest } from 'next/server';
import { verifyWeb3Auth, isLikelyBase58Address } from '@/lib/auth/verifyWeb3Auth';
import { db } from '@/lib/db';
import { walletBindings } from '@/lib/db/schema/walletBindings';
import { eq } from 'drizzle-orm';
import nacl from 'tweetnacl';
import bs58 from 'bs58';

export async function POST(req: NextRequest) {
  try {
    const verified = await verifyWeb3Auth(req);
    if (!verified) return new Response(JSON.stringify({ error: 'Unauthorized'}), { status: 401 });
    const { walletAddress, signature } = await req.json().catch(() => ({}));
    if (!walletAddress || typeof walletAddress !== 'string' || !isLikelyBase58Address(walletAddress)) {
      return new Response(JSON.stringify({ error: 'Valid walletAddress required'}), { status: 400 });
    }
    if (!signature || typeof signature !== 'string') {
      return new Response(JSON.stringify({ error: 'signature required'}), { status: 400 });
    }
    const binding = await db.query.walletBindings.findFirst({ where: eq(walletBindings.walletAddress, walletAddress) });
    if (!binding || !binding.pendingNonce) {
      return new Response(JSON.stringify({ error: 'No pending nonce. Request a nonce first.'}), { status: 400 });
    }
    // Verify signature over the nonce message
    let ok = false;
    try {
      const message = new TextEncoder().encode(binding.pendingNonce);
      const sigBytes = bs58.decode(signature);
      const pubKeyBytes = bs58.decode(walletAddress);
      ok = nacl.sign.detached.verify(message, sigBytes, pubKeyBytes);
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Signature verification failed'}), { status: 400 });
    }
    if (!ok) return new Response(JSON.stringify({ error: 'Invalid signature'}), { status: 400 });
    // Mark bound
    await db.update(walletBindings).set({ pendingNonce: null, boundAt: new Date(), updatedAt: new Date(), userSub: verified.payload.sub || binding.userSub }).where(eq(walletBindings.id, binding.id));
    return new Response(JSON.stringify({ bound: true }), { status: 200 });
  } catch (e) {
    console.error('[auth/bind-wallet] error', e);
    return new Response(JSON.stringify({ error: 'Internal error'}), { status: 500 });
  }
}
