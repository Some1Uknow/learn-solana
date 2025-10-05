import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";
import { extractAndVerifyJWT } from "@/lib/auth/web3auth";
import { registerSchema } from "@/lib/validation/userRegistration";
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

    // Social path requires a valid Web3Auth JWT
    if (authType === "social") {
      const { token, payload } = await extractAndVerifyJWT(req);
      if (!token || !payload) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }
      authToken = token;
      jwtPayload = payload;
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

    // If JWT supplied and it contains wallet(s), ensure match (defense-in-depth)
    if (jwtPayload && jwtPayload.wallets && Array.isArray(jwtPayload.wallets)) {
      const tokenWallet = (
        jwtPayload.wallets.find((w: any) => w?.address) || {}
      ).address;
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
      if (signature) {
        const ok = verifyWalletSignature(walletAddress, signature);
        if (!ok) {
          return NextResponse.json(
            { error: "Invalid signature" },
            { status: 401 }
          );
        }
        signatureValidated = true;
      } else {
        debugLog("register", "external wallet signature missing", {
          wallet: walletAddress,
        });
      }
    }

    // Normalize email
    const email = body.email ? body.email.toLowerCase() : undefined;
    const { name, profileImage } = body;

    // We intentionally ignore other token fields for minimal schema

    // Registration semantics:
    // - If user with wallet exists: return it unchanged (idempotent)
    // - Optionally enrich ONLY blank (null/undefined) fields if caller supplies them
    // - If user doesn't exist: insert new record
    const existing = await db.query.users.findFirst({
      where: eq(users.walletAddress, walletAddress),
    });
    let saved;
    let created = false;
    const enrichedFields: string[] = [];

    if (existing) {
      const updates: Record<string, any> = {};
      // Only fill missing fields (null or undefined) — never overwrite existing non-null data
      if (existing.email == null && email) {
        updates.email = email;
        enrichedFields.push("email");
      }
      if (existing.name == null && name) {
        updates.name = name;
        enrichedFields.push("name");
      }
      if (existing.profileImage == null && profileImage) {
        updates.profileImage = profileImage;
        enrichedFields.push("profileImage");
      }
      if (Object.keys(updates).length > 0) {
        updates.updatedAt = new Date();
        await db.update(users).set(updates).where(eq(users.id, existing.id));
        saved = { ...existing, ...updates };
      } else {
        saved = existing; // pure no-op
      }
    } else {
      const inserted = await db
        .insert(users)
        .values({ walletAddress, email, name, profileImage })
        .returning();
      saved = inserted[0];
      created = true;
    }

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

    return response;
  } catch (error) {
    console.error("User register error", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
