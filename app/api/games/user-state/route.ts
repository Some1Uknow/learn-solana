import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { gameProgress } from '@/lib/db/schema/gameProgress';
import { mintedNfts } from '@/lib/db/schema/mintedNfts';
import { eq } from 'drizzle-orm';
import { verifyWeb3Auth, deriveWalletFromPayload, isLikelyBase58Address } from '@/lib/auth/verifyWeb3Auth';

/**
 * Single unified API endpoint that returns complete game state for a user.
 * Combines progress + minted NFTs in one call to prevent race conditions and flickering.
 */
export async function GET(req: NextRequest) {
  try {
    const verified = await verifyWeb3Auth(req);
    if (!verified) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const override = searchParams.get('walletAddress');
    let walletAddress = deriveWalletFromPayload(verified.payload);
    
    if (!walletAddress && override && isLikelyBase58Address(override)) {
      walletAddress = override;
    }
    
    if (!walletAddress) {
      return new Response(JSON.stringify({ error: 'Wallet address missing' }), { status: 400 });
    }

    // Fetch both progress and minted NFTs in parallel
    const [progressRows, nftRows] = await Promise.all([
      db.query.gameProgress.findMany({
        where: eq(gameProgress.walletAddress, walletAddress),
      }),
      db.query.mintedNfts.findMany({
        where: eq(mintedNfts.walletAddress, walletAddress),
        orderBy: (t, { desc }) => [desc(t.createdAt)],
      }),
    ]);

    // Combine into a single game state object
    const gameStates: Record<string, {
      completed: boolean;
      completedAt: string | null;
      canClaim: boolean;
      claimedAt: string | null;
      mintAddress: string | null;
      nftMinted: boolean;
    }> = {};

    // Add progress data
    for (const row of progressRows) {
      gameStates[row.gameId] = {
        completed: !!row.completedAt,
        completedAt: row.completedAt?.toISOString() || null,
        canClaim: !!row.canClaim,
        claimedAt: row.claimedAt?.toISOString() || null,
        mintAddress: null,
        nftMinted: false,
      };
    }

    // Merge NFT data
    for (const nft of nftRows) {
      if (gameStates[nft.gameId]) {
        gameStates[nft.gameId].mintAddress = nft.mintAddress;
        gameStates[nft.gameId].nftMinted = true;
      } else {
        // NFT exists but no progress entry (shouldn't happen, but handle it)
        gameStates[nft.gameId] = {
          completed: true,
          completedAt: nft.createdAt.toISOString(),
          canClaim: false,
          claimedAt: nft.createdAt.toISOString(),
          mintAddress: nft.mintAddress,
          nftMinted: true,
        };
      }
    }

    return new Response(
      JSON.stringify({
        walletAddress,
        gameStates,
        nfts: nftRows, // Keep full NFT list for NFTs modal
      }),
      { status: 200 }
    );
  } catch (e) {
    console.error('[games/user-state] error', e);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
