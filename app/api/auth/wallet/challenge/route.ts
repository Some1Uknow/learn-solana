import { NextRequest, NextResponse } from 'next/server';
import { canIssueAppSession, signWalletChallenge } from '@/lib/auth/appSession';
import { buildWalletAuthMessage, isValidSolanaAddress } from '@/lib/solana/signature';

export async function POST(req: NextRequest) {
  try {
    if (!canIssueAppSession()) {
      return NextResponse.json(
        { error: 'APP_AUTH_SECRET must be configured for wallet login' },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const walletAddress = typeof body.walletAddress === 'string' ? body.walletAddress.trim() : '';

    if (!walletAddress || !isValidSolanaAddress(walletAddress)) {
      return NextResponse.json({ error: 'Valid walletAddress required' }, { status: 400 });
    }

    const nonce = crypto.randomUUID();
    const challengeToken = await signWalletChallenge({ walletAddress, nonce });
    const message = buildWalletAuthMessage(walletAddress, nonce);

    return NextResponse.json({ walletAddress, message, challengeToken }, { status: 200 });
  } catch (error) {
    console.error('wallet challenge error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
