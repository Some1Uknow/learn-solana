import * as jose from "jose";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  try {
    // Extract JWT token from Authorization header or cookies
    const cookieStore = await cookies();
    const authHeader = req.headers.get("authorization");
    let idToken = authHeader?.split(" ")[1];
    
    // Fallback to cookies if no header
    if (!idToken) {
      idToken = cookieStore.get("web3auth_token")?.value;
    }

    if (!idToken) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // Verify JWT using Web3Auth JWKS
    const jwks = jose.createRemoteJWKSet(new URL("https://api-auth.web3auth.io/.well-known/jwks.json"));
    const { payload } = await jose.jwtVerify(idToken, jwks, { algorithms: ["ES256"] });

    // Extract user information from JWT
    const userInfo = {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      profileImage: payload.profileImage,
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
      authenticated: false 
    }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { idToken, appPubKey } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // Verify JWT using Web3Auth JWKS
    const jwks = jose.createRemoteJWKSet(new URL("https://api-auth.web3auth.io/.well-known/jwks.json"));
    const { payload } = await jose.jwtVerify(idToken, jwks, { algorithms: ["ES256"] });

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
