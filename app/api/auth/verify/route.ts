import { NextRequest, NextResponse } from "next/server";
import { verifyWeb3Auth } from "@/lib/auth/verifyWeb3Auth";

export async function GET(req: NextRequest) {
  try {
    const verified = await verifyWeb3Auth(req);
    if (!verified) {
      return NextResponse.json(
        { authenticated: false, user: null, expires: null },
        { status: 200 }
      );
    }

    const { payload, source } = verified;

    // Extract user information from JWT
    const userInfo = {
      sub: payload.sub,
      walletAddress: payload.walletAddress,
      email: payload.email,
      name: payload.name,
      profileImage: payload.profileImage,
      authMethod: payload.authMethod,
      source,
      verifier: payload.verifier,
      verifierId: payload.verifierId,
      aggregateVerifier: payload.aggregateVerifier,
      wallets: payload.wallets || [],
    };

    return NextResponse.json({ 
      authenticated: true, 
      user: userInfo,
      expires: payload.exp 
    }, { status: 200 });
  } catch (error) {
    console.error("JWT verification error:", error);
    return NextResponse.json({ 
      error: "Invalid token",
      authenticated: false,
      user: null,
      expires: null,
    }, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { idToken, appPubKey } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    const forwardedRequest = new Request(req.url, {
      method: "POST",
      headers: {
        authorization: `Bearer ${idToken}`,
      },
    });
    const verified = await verifyWeb3Auth(forwardedRequest);
    if (!verified) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    const { payload } = verified;

    if (appPubKey) {
      // Find matching wallet in JWT for social login
      const wallets = (payload as any).wallets || [];
      const normalizedAppKey = appPubKey.toLowerCase().replace(/^0x/, "");

      const isValid = wallets.some((wallet: any) => {
        if (wallet.type !== "web3auth_app_key") return false;

        const walletKey = wallet.public_key.toLowerCase();

        // Direct key comparison for ed25519 keys
        if (walletKey === normalizedAppKey) return true;

        // Handle compressed secp256k1 keys
        if (
          wallet.curve === "secp256k1" &&
          walletKey.length === 66 &&
          normalizedAppKey.length === 128
        ) {
          const compressedWithoutPrefix = walletKey.substring(2);
          return normalizedAppKey.startsWith(compressedWithoutPrefix);
        }

        return false;
      });

      if (!isValid) {
        return NextResponse.json({ error: "Invalid public key" }, { status: 400 });
      }
    }

    return NextResponse.json({ 
      authenticated: true,
      message: "Verification successful" 
    }, { status: 200 });
  } catch (error) {
    console.error("Social login verification error:", error);
    return NextResponse.json({ error: "Verification error" }, { status: 500 });
  }
}
