import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { mintedNfts } from '@/lib/db/schema/mintedNfts';
import { eq, and } from 'drizzle-orm';
import { verifyWeb3Auth, deriveWalletFromPayload, isLikelyBase58Address } from '@/lib/auth/verifyWeb3Auth';

export async function GET(req: NextRequest) {
  try {
    const verified = await verifyWeb3Auth(req);
    if (!verified) return new Response(JSON.stringify({ error: 'Unauthorized'}), { status: 401 });

    const { searchParams } = new URL(req.url);
    const override = searchParams.get('walletAddress');
    let walletAddress = deriveWalletFromPayload(verified.payload);
    if (!walletAddress && override && isLikelyBase58Address(override)) walletAddress = override;
    if (!walletAddress) return new Response(JSON.stringify({ error: 'walletAddress unresolved'}), { status: 400 });

    const rows = await db.query.mintedNfts.findMany({
      where: eq(mintedNfts.walletAddress, walletAddress),
      orderBy: (t, { desc }) => [desc(t.createdAt)]
    });
    return new Response(JSON.stringify({ walletAddress, nfts: rows }), { status: 200 });
  } catch (e) {
    console.error('[games/nfts] error', e);
    return new Response(JSON.stringify({ error: 'Internal Server Error'}), { status: 500 });
  }
}
