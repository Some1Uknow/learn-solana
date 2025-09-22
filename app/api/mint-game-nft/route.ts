import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { mintedNfts } from '@/lib/db/schema/mintedNfts';
import { gameProgress } from '@/lib/db/schema/gameProgress';
import { eq, and } from 'drizzle-orm';
// server-side mint fallback removed
import bs58 from 'bs58';
import { verifyWeb3Auth, deriveWalletFromPayload, isLikelyBase58Address } from '@/lib/auth/verifyWeb3Auth';

// legacy verifyAuth removed (centralized in verifyWeb3Auth)

export async function POST(req: NextRequest) {
  try {
    const verified = await verifyWeb3Auth(req);
    if (!verified) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    const body = await req.json().catch(() => ({}));
  const { gameId, walletAddress: overrideWallet, mintAddress: clientMintAddress, clientMint } = body || {};
    if (!gameId || typeof gameId !== 'string') {
      return new Response(JSON.stringify({ error: 'gameId required'}), { status: 400 });
    }
    let walletAddress = deriveWalletFromPayload(verified.payload);
    if (!walletAddress && typeof overrideWallet === 'string' && isLikelyBase58Address(overrideWallet)) {
      // Temporarily allow override without binding for UX; will re-harden later.
      walletAddress = overrideWallet;
    }
    if (!walletAddress) return new Response(JSON.stringify({ error: 'walletAddress unresolved'}), { status: 400 });

    // Require eligibility to claim
    try {
      const progress = await db.query.gameProgress.findFirst({ where: and(eq(gameProgress.gameId, gameId), eq(gameProgress.walletAddress, walletAddress)) });
      const canClaim = !!progress?.canClaim;
      if (!canClaim) {
        return new Response(JSON.stringify({ error: 'Not eligible to claim. Complete the game first.' }), { status: 403 });
      }
    } catch {}

    // Prevent duplicate mint per game/wallet
    try {
      const existing = await db.query.mintedNfts.findFirst({ where: and(eq(mintedNfts.gameId, gameId), eq(mintedNfts.walletAddress, walletAddress)) });
      if (existing) {
        return new Response(JSON.stringify({ error: 'Already minted for this game.' }), { status: 409 });
      }
    } catch {}
    // If client minted, just record it after lightweight validation
    if (clientMint && clientMintAddress) {
      try {
        // Basic base58 validation
        bs58.decode(clientMintAddress);
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid mintAddress base58'}), { status: 400 });
      }
      await db.insert(mintedNfts).values({ gameId, walletAddress, mintAddress: clientMintAddress });
      // Update progress: set claimedAt & disable canClaim
      try {
        const now = new Date();
        await db.update(gameProgress)
          .set({ claimedAt: now, canClaim: false, updatedAt: now })
          .where(and(eq(gameProgress.gameId, gameId), eq(gameProgress.walletAddress, walletAddress)));
      } catch (e) {
        console.warn('[mint-game-nft] progress update failed (non-fatal)', e);
      }
      return new Response(JSON.stringify({ mintAddress: clientMintAddress, alreadyMinted: false, recorded: true }), { status: 200 });
    }

    // Server mint removed: only client-funded mint is supported
    return new Response(JSON.stringify({ error: 'Only clientMint is supported.' }), { status: 400 });
  } catch (e) {
    console.error('mint-game-nft error', e);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}