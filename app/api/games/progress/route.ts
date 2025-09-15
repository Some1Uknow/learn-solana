import { db } from '@/lib/db';
import { gameProgress } from '@/lib/db/schema/gameProgress';
import { eq } from 'drizzle-orm';
import { verifyWeb3Auth, deriveWalletFromPayload, isLikelyBase58Address } from '@/lib/auth/verifyWeb3Auth';

export async function GET(req: Request) {
  const verified = await verifyWeb3Auth(req);
  if (!verified) return new Response(JSON.stringify({ error: 'Unauthorized'}), { status: 401 });
  const url = new URL(req.url);
  const override = url.searchParams.get('walletAddress');
  let walletAddress = deriveWalletFromPayload(verified.payload);
  if (!walletAddress && override && isLikelyBase58Address(override)) {
    // Temporarily allow read-only override without binding (security hardening deferred)
    walletAddress = override;
  }
  if (!walletAddress) return new Response(JSON.stringify({ error: 'Wallet address missing'}), { status: 400 });
  const rows = await db.query.gameProgress.findMany({ where: eq(gameProgress.walletAddress, walletAddress) });
  return new Response(JSON.stringify({ progress: rows }), { status: 200 });
}