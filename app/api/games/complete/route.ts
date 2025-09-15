import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { gameProgress } from '@/lib/db/schema/gameProgress';
import { eq, and } from 'drizzle-orm';
import { verifyWeb3Auth, deriveWalletFromPayload, isLikelyBase58Address } from '@/lib/auth/verifyWeb3Auth';

export async function POST(req: NextRequest) {
  try {
    const verified = await verifyWeb3Auth(req);
    if (!verified) {
      return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { gameId, walletAddress: overrideWallet } = body;
    if (!gameId || typeof gameId !== 'string') {
      return new Response(JSON.stringify({ error: 'gameId required' }), { status: 400 });
    }

    let walletAddress = deriveWalletFromPayload(verified.payload);
    if (!walletAddress && typeof overrideWallet === 'string' && isLikelyBase58Address(overrideWallet)) {
      // Temporarily trust override (will reintroduce binding requirement after UX fix)
      walletAddress = overrideWallet;
    }
    if (!walletAddress) {
      return new Response(JSON.stringify({ error: 'Wallet address missing (supply walletAddress override with base58)'}), { status: 400 });
    }

    // Fetch existing progress
    const existing = await db.query.gameProgress.findFirst({
      where: and(eq(gameProgress.gameId, gameId), eq(gameProgress.walletAddress, walletAddress)),
    });

    const now = new Date();
    if (!existing) {
      await db.insert(gameProgress).values({
        gameId,
        walletAddress,
        completedAt: now,
        canClaim: true,
      });
    } else if (!existing.completedAt) {
      await db.update(gameProgress)
        .set({ completedAt: now, canClaim: existing.claimedAt ? false : true, updatedAt: now })
        .where(and(eq(gameProgress.gameId, gameId), eq(gameProgress.walletAddress, walletAddress)));
    } else if (!existing.claimedAt && !existing.canClaim) {
      // Re-enable claim if somehow disabled but unclaimed
      await db.update(gameProgress)
        .set({ canClaim: true, updatedAt: now })
        .where(and(eq(gameProgress.gameId, gameId), eq(gameProgress.walletAddress, walletAddress)));
    }

    const refreshed = await db.query.gameProgress.findFirst({
      where: and(eq(gameProgress.gameId, gameId), eq(gameProgress.walletAddress, walletAddress)),
    });

    return new Response(JSON.stringify({ progress: refreshed }), { status: 200 });
  } catch (e) {
    console.error('[games/complete] error', e);
    return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
  }
}