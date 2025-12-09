import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { challengeProgress } from "@/lib/db/schema/challengeProgress";
import { eq, and } from "drizzle-orm";
import {
  verifyWeb3Auth,
  deriveWalletFromPayload,
  isLikelyBase58Address,
} from "@/lib/auth/verifyWeb3Auth";

export async function GET(req: NextRequest) {
  try {
    const verified = await verifyWeb3Auth(req);
    if (!verified) {
      return new Response(JSON.stringify({ error: "Authentication required" }), {
        status: 401,
      });
    }

    const { searchParams } = new URL(req.url);
    const track = searchParams.get("track");
    const overrideWallet = searchParams.get("wallet");

    if (!track) {
      return new Response(JSON.stringify({ error: "track query param required" }), {
        status: 400,
      });
    }

    let walletAddress = deriveWalletFromPayload(verified.payload);
    if (
      !walletAddress &&
      typeof overrideWallet === "string" &&
      isLikelyBase58Address(overrideWallet)
    ) {
      walletAddress = overrideWallet;
    }

    if (!walletAddress) {
      return new Response(
        JSON.stringify({ error: "Wallet address missing" }),
        { status: 400 }
      );
    }

    // Fetch all completed challenges for this user + track
    const completed = await db.query.challengeProgress.findMany({
      where: and(
        eq(challengeProgress.walletAddress, walletAddress),
        eq(challengeProgress.track, track)
      ),
      columns: {
        challengeId: true,
        completedAt: true,
        attempts: true,
      },
    });

    // Return as a map of challengeId -> completion info
    const progressMap: Record<
      number,
      { completedAt: Date; attempts: number }
    > = {};

    for (const item of completed) {
      progressMap[item.challengeId] = {
        completedAt: item.completedAt,
        attempts: item.attempts,
      };
    }

    return new Response(
      JSON.stringify({
        track,
        wallet: walletAddress,
        progress: progressMap,
        completedCount: completed.length,
      }),
      { status: 200 }
    );
  } catch (e) {
    console.error("[challenges/progress] error", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
    });
  }
}
