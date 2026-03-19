import { db } from '@/lib/db';
import { gameProgress } from '@/lib/db/schema/gameProgress';
import { eq } from 'drizzle-orm';
import { verifyWeb3Auth, resolveAuthenticatedWallet } from '@/lib/auth/verifyWeb3Auth';

export async function GET(req: Request) {
  const verified = await verifyWeb3Auth(req);
  if (!verified) return new Response(JSON.stringify({ error: 'Unauthorized'}), { status: 401 });
  const { walletAddress, error } = resolveAuthenticatedWallet(req, verified.payload);
  if (error === 'wallet_mismatch') {
    return new Response(JSON.stringify({ error: 'Wallet mismatch'}), { status: 403 });
  }
  if (!walletAddress) return new Response(JSON.stringify({ error: 'Wallet address missing'}), { status: 400 });
  const rows = await db.query.gameProgress.findMany({ where: eq(gameProgress.walletAddress, walletAddress) });
  return new Response(JSON.stringify({ progress: rows }), { status: 200 });
}
