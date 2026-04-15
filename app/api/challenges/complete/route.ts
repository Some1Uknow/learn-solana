import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { exerciseProgress } from "@/lib/db/schema/exerciseProgress";
import { eq, and } from "drizzle-orm";
import { requirePrivyUser } from "@/lib/auth/privy-server";
import { syncAppUser } from "@/lib/auth/app-user";
import { getExercise } from "@/lib/challenges/exercises";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { track, exerciseSlug, code } = body;

    const verified = await requirePrivyUser(req);
    if (!verified) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    if (!track || typeof track !== "string") {
      return new Response(JSON.stringify({ error: "track required" }), {
        status: 400,
      });
    }

    if (!exerciseSlug || typeof exerciseSlug !== "string") {
      return new Response(JSON.stringify({ error: "exerciseSlug required" }), {
        status: 400,
      });
    }

    if (!getExercise(track, exerciseSlug)) {
      return new Response(JSON.stringify({ error: "exercise not found" }), {
        status: 404,
      });
    }

    const { user } = await syncAppUser({
      privyUserId: verified.userId,
    });

    // Check for existing completion
    const existing = await db.query.exerciseProgress.findFirst({
      where: and(
        eq(exerciseProgress.userId, user.id),
        eq(exerciseProgress.trackSlug, track),
        eq(exerciseProgress.exerciseSlug, exerciseSlug)
      ),
    });

    const now = new Date();

    if (!existing) {
      // First completion
      await db.insert(exerciseProgress).values({
        userId: user.id,
        trackSlug: track,
        exerciseSlug,
        status: "completed",
        completedAt: now,
        attemptCount: 1,
        lastRunAt: now,
        lastCode: typeof code === "string" ? code : null,
      });
    } else {
      await db
        .update(exerciseProgress)
        .set({
          status: "completed",
          completedAt: existing.completedAt ?? now,
          attemptCount: existing.attemptCount + 1,
          lastRunAt: now,
          lastCode: typeof code === "string" ? code : existing.lastCode,
          updatedAt: now,
        })
        .where(
          and(
            eq(exerciseProgress.userId, user.id),
            eq(exerciseProgress.trackSlug, track),
            eq(exerciseProgress.exerciseSlug, exerciseSlug)
          )
        );
    }

    const refreshed = await db.query.exerciseProgress.findFirst({
      where: and(
        eq(exerciseProgress.userId, user.id),
        eq(exerciseProgress.trackSlug, track),
        eq(exerciseProgress.exerciseSlug, exerciseSlug)
      ),
    });

    return new Response(
      JSON.stringify({
        userId: user.id,
        progress: refreshed
          ? {
              exerciseSlug: refreshed.exerciseSlug,
              completedAt: refreshed.completedAt,
              attemptCount: refreshed.attemptCount,
              status: refreshed.status,
            }
          : null,
      }),
      { status: 200 }
    );
  } catch (e) {
    console.error("[challenges/complete] error", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
    });
  }
}
