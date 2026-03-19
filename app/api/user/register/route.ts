import { NextRequest, NextResponse } from "next/server";
import { deriveWalletFromPayload, verifyWeb3Auth } from "@/lib/auth/verifyWeb3Auth";
import { registerSchema } from "@/lib/validation/userRegistration";
import { canIssueAppSession, setAppSessionCookie } from "@/lib/auth/appSession";
import { upsertUserByWallet } from "@/lib/auth/upsertUser";
import {
  isValidSolanaAddress,
  verifyWalletSignature,
  SIGN_MESSAGE_PREFIX,
} from "@/lib/solana/signature";
import { debugLog } from "@/lib/utils/debug";

export async function POST(req: NextRequest) {
  try {
    const raw = await req.json().catch(() => ({}));
    const parse = registerSchema.safeParse(raw);
    if (!parse.success) {
      return NextResponse.json(
        { error: "Invalid request body", issues: parse.error.issues },
        { status: 422 }
      );
    }
    const body = parse.data;
    const authType = body.authType || "social"; // default to social
    const headerWallet = req.headers.get("x-wallet-address");
    const headerSig = req.headers.get("x-wallet-signature");
    let walletAddress = (headerWallet || body.walletAddress)?.trim();
    let authToken: string | undefined;
    let jwtPayload: any;

    // Verify Web3Auth JWT whenever one is supplied.
    // Social login requires it. External wallets can also provide it, which
    // lets the rest of the app keep using JWT-backed authenticated routes.
    const verified = await verifyWeb3Auth(req);
    if (verified) {
      authToken = verified.raw;
      jwtPayload = verified.payload;
    } else if (authType === "social") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // wallet address must be present now
    if (!walletAddress) {
      return NextResponse.json(
        { error: "walletAddress required" },
        { status: 400 }
      );
    }
    if (!isValidSolanaAddress(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid Solana wallet address" },
        { status: 400 }
      );
    }

    // If JWT supplied and it contains a wallet, ensure it matches the claimed address.
    if (jwtPayload) {
      const tokenWallet = deriveWalletFromPayload(jwtPayload);
      if (tokenWallet && tokenWallet !== walletAddress) {
        return NextResponse.json(
          { error: "JWT wallet mismatch" },
          { status: 403 }
        );
      }
    }

    // External wallet flow: require signature proving control of key
    let signatureValidated = false;
    if (authType === "external_wallet") {
      const signature = headerSig || body.signature || undefined;
      if (!signature) {
        debugLog("register", "external wallet signature missing", {
          wallet: walletAddress,
        });
        return NextResponse.json(
          {
            error: "Signature required for external wallet registration",
            messageToSign: SIGN_MESSAGE_PREFIX + walletAddress,
          },
          { status: 401 }
        );
      }

      const ok = verifyWalletSignature(walletAddress, signature);
      if (!ok) {
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
      signatureValidated = true;
    }

    const { user: saved, created, enrichedFields } = await upsertUserByWallet({
      walletAddress,
      email: body.email,
      name: body.name,
      profileImage: body.profileImage,
    });

    // Sanitize user object (exclude nothing for now but keep explicit)
    const {
      id,
      walletAddress: wa,
      email: em,
      name: nm,
      profileImage: pi,
      createdAt,
      updatedAt,
    } = saved;
    debugLog("register", "completed", {
      created,
      enrichedFields,
      wallet: wa,
      signatureValidated,
    });
    const response = NextResponse.json(
      {
        user: {
          id,
          walletAddress: wa,
          email: em,
          name: nm,
          profileImage: pi,
          createdAt,
          updatedAt,
        },
        created,
        enrichedFields,
        signatureValidated,
        messageToSign: SIGN_MESSAGE_PREFIX + walletAddress,
      },
      { status: 200 }
    );
    if (authToken) {
      response.cookies.set({
        name: "web3auth_token",
        value: authToken,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
        secure: process.env.NODE_ENV !== "development",
      });
    }
    if (canIssueAppSession()) {
      await setAppSessionCookie(response, {
        walletAddress: wa,
        authMethod: authType === "external_wallet" ? "external_wallet" : "social",
        email: em,
        name: nm,
        profileImage: pi,
      });
    }

    return response;
  } catch (error) {
    console.error("User register error", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
