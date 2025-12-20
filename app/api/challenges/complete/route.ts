import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { challengeProgress } from "@/lib/db/schema/challengeProgress";
import { eq, and } from "drizzle-orm";
import {
  verifyWeb3Auth,
  deriveWalletFromPayload,
  isLikelyBase58Address,
} from "@/lib/auth/verifyWeb3Auth";

export async function POST(req: NextRequest) {
  try {
    // Clone request so we can read body even if verifyWeb3Auth consumes it
    const clonedReq = req.clone();
    const body = await clonedReq.json().catch(() => ({}));
    const { track, challengeId, code, walletAddress: overrideWallet } = body;

    // Try JWT auth first (for social logins)
    const verified = await verifyWeb3Auth(req);
    
    // Determine wallet address from JWT or request body
    let walletAddress: string | null = null;
    
    if (verified) {
      // JWT auth succeeded - derive wallet from token
      walletAddress = deriveWalletFromPayload(verified.payload);
    }
    
    // Fallback: Accept wallet from request body for external wallet users
    // External wallets (Phantom, etc.) don't get Web3Auth JWTs
    if (!walletAddress && typeof overrideWallet === "string" && isLikelyBase58Address(overrideWallet)) {
      walletAddress = overrideWallet;
    }

    if (!track || typeof track !== "string") {
      return new Response(JSON.stringify({ error: "track required" }), {
        status: 400,
      });
    }

    if (!challengeId || typeof challengeId !== "number") {
      return new Response(JSON.stringify({ error: "challengeId required" }), {
        status: 400,
      });
    }

    if (!walletAddress) {
      return new Response(
        JSON.stringify({ error: "Wallet address missing" }),
        { status: 400 }
      );
    }

    // Check for existing completion
    const existing = await db.query.challengeProgress.findFirst({
      where: and(
        eq(challengeProgress.walletAddress, walletAddress),
        eq(challengeProgress.track, track),
        eq(challengeProgress.challengeId, challengeId)
      ),
    });

    const now = new Date();

    if (!existing) {
      // First completion
      await db.insert(challengeProgress).values({
        walletAddress,
        track,
        challengeId,
        completedAt: now,
        attempts: 1,
        solutionCode: typeof code === "string" ? code : null,
      });
    } else {
      // Already completed - increment attempts and update solution
      await db
        .update(challengeProgress)
        .set({
          attempts: existing.attempts + 1,
          solutionCode: typeof code === "string" ? code : existing.solutionCode,
          updatedAt: now,
        })
        .where(
          and(
            eq(challengeProgress.walletAddress, walletAddress),
            eq(challengeProgress.track, track),
            eq(challengeProgress.challengeId, challengeId)
          )
        );
    }

    const refreshed = await db.query.challengeProgress.findFirst({
      where: and(
        eq(challengeProgress.walletAddress, walletAddress),
        eq(challengeProgress.track, track),
        eq(challengeProgress.challengeId, challengeId)
      ),
    });

    return new Response(JSON.stringify({ progress: refreshed }), { status: 200 });
  } catch (e) {
    console.error("[challenges/complete] error", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
    });
  }
}
