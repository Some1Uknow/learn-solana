import { NextRequest, NextResponse } from 'next/server';
import {
  canIssueAppSession,
  setAppSessionCookie,
  verifyWalletChallengeToken,
} from '@/lib/auth/appSession';
import { buildWalletAuthMessage, isValidSolanaAddress, verifyArbitraryWalletSignature } from '@/lib/solana/signature';
import { upsertUserByWallet } from '@/lib/auth/upsertUser';

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
    const signature = typeof body.signature === 'string' ? body.signature.trim() : '';
    const challengeToken = typeof body.challengeToken === 'string' ? body.challengeToken.trim() : '';
    const walletName = typeof body.walletName === 'string' ? body.walletName.trim() : '';

    if (!walletAddress || !isValidSolanaAddress(walletAddress)) {
      return NextResponse.json({ error: 'Valid walletAddress required' }, { status: 400 });
    }
    if (!signature || !challengeToken) {
      return NextResponse.json({ error: 'signature and challengeToken are required' }, { status: 400 });
    }

    const challenge = await verifyWalletChallengeToken(challengeToken);
    if (!challenge || challenge.walletAddress !== walletAddress) {
      return NextResponse.json({ error: 'Invalid or expired wallet challenge' }, { status: 401 });
    }

    const message = buildWalletAuthMessage(walletAddress, challenge.nonce);
    const isValid = verifyArbitraryWalletSignature(walletAddress, signature, message);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const { user, created, enrichedFields } = await upsertUserByWallet({
      walletAddress,
      name: walletName || null,
    });

    const response = NextResponse.json(
      {
        authenticated: true,
        authMethod: 'native_wallet',
        user,
        created,
        enrichedFields,
      },
      { status: 200 }
    );

    await setAppSessionCookie(response, {
      walletAddress: user.walletAddress,
      authMethod: 'native_wallet',
      email: user.email,
      name: user.name,
      profileImage: user.profileImage,
    });

    return response;
  } catch (error) {
    console.error('wallet verify error', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
