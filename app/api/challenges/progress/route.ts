import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { exerciseProgress } from "@/lib/db/schema/exerciseProgress";
import { eq, and } from "drizzle-orm";
import { requirePrivyUser } from "@/lib/auth/privy-server";
import { syncAppUser } from "@/lib/auth/app-user";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const track = searchParams.get("track");

    if (!track) {
      return new Response(JSON.stringify({ error: "track query param required" }), {
        status: 400,
      });
    }

    const verified = await requirePrivyUser(req);
    if (!verified) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { user } = await syncAppUser({
      privyUserId: verified.userId,
    });

    const completed = await db.query.exerciseProgress.findMany({
      where: and(
        eq(exerciseProgress.userId, user.id),
        eq(exerciseProgress.trackSlug, track)
      ),
      columns: {
        exerciseSlug: true,
        completedAt: true,
        attemptCount: true,
        status: true,
      },
    });

    const progressMap: Record<
      string,
      { completedAt: Date | null; attemptCount: number; status: string }
    > = {};

    for (const item of completed) {
      progressMap[item.exerciseSlug] = {
        completedAt: item.completedAt,
        attemptCount: item.attemptCount,
        status: item.status,
      };
    }

    return new Response(
      JSON.stringify({
        track,
        userId: user.id,
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
