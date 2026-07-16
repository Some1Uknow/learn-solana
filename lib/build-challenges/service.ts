import { and, desc, eq, gte, inArray, lt, or, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  buildAttempts,
  buildStageProgress,
  type BuildAttemptResult,
} from "@/lib/db/schema/buildChallenges";
import {
  buildAttemptExpiryMs,
  buildAttemptRateLimit,
  buildAttemptRateWindowMs,
  buildRunExpiryMs,
} from "./config";
import { getBuildChallengeCourse, getBuildChallengeStage } from "./source";

export class BuildChallengeError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "not_found"
      | "locked"
      | "rate_limited"
      | "attempt_active"
      | "invalid_transition"
  ) {
    super(message);
  }
}

export type SafeAttemptResult = BuildAttemptResult;

function isTerminal(status: string) {
  return status === "passed" || status === "failed" || status === "error" || status === "expired";
}

function safeResult(value: unknown): SafeAttemptResult | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Partial<SafeAttemptResult>;
  if (!Array.isArray(item.checks) || !item.hidden || typeof item.hidden !== "object") return null;
  const checks = item.checks.flatMap((check) => {
    if (!check || typeof check !== "object") return [];
    const value = check as Record<string, unknown>;
    if (
      typeof value.key !== "string" ||
      typeof value.label !== "string" ||
      (value.status !== "passed" && value.status !== "failed")
    ) {
      return [];
    }
    return [
      {
        key: value.key,
        label: value.label,
        status: value.status,
        ...(typeof value.message === "string" ? { message: value.message.slice(0, 500) } : {}),
        ...(typeof value.hint === "string" ? { hint: value.hint.slice(0, 500) } : {}),
      } as SafeAttemptResult["checks"][number],
    ];
  });
  const hidden = item.hidden as Record<string, unknown>;
  if (!Number.isInteger(hidden.passed) || !Number.isInteger(hidden.total)) return null;
  return {
    checks,
    hidden: { passed: Number(hidden.passed), total: Number(hidden.total) },
  };
}

export async function expireStaleBuildAttempts(userId: string, challengeSlug: string) {
  const now = Date.now();
  await db
    .update(buildAttempts)
    .set({ status: "expired", finishedAt: new Date() })
    .where(
      and(
        eq(buildAttempts.userId, userId),
        eq(buildAttempts.challengeSlug, challengeSlug),
        or(
          and(eq(buildAttempts.status, "created"), lt(buildAttempts.createdAt, new Date(now - buildAttemptExpiryMs))),
          and(eq(buildAttempts.status, "running"), lt(buildAttempts.startedAt, new Date(now - buildRunExpiryMs)))
        )
      )
    );
}

export async function getBuildProgress(userId: string, challengeSlug: string) {
  const course = getBuildChallengeCourse(challengeSlug);
  if (!course) throw new BuildChallengeError("Build challenge not found", "not_found");
  await expireStaleBuildAttempts(userId, challengeSlug);

  const [stages, latestAttempt] = await Promise.all([
    db.query.buildStageProgress.findMany({
      where: and(eq(buildStageProgress.userId, userId), eq(buildStageProgress.challengeSlug, challengeSlug)),
    }),
    db.query.buildAttempts.findFirst({
      where: and(eq(buildAttempts.userId, userId), eq(buildAttempts.challengeSlug, challengeSlug)),
      orderBy: [desc(buildAttempts.createdAt)],
    }),
  ]);

  const passed = new Set(stages.filter((stage) => stage.status === "passed").map((stage) => stage.stageSlug));
  const current = course.stages.find((stage) => !passed.has(stage.slug)) ?? course.stages.at(-1)!;
  return {
    currentStageSlug: current.slug,
    completedStageCount: passed.size,
    stages: course.stages.map((stage) => {
      const record = stages.find((item) => item.stageSlug === stage.slug);
      return {
        slug: stage.slug,
        status: record?.status ?? (stage.slug === current.slug ? "current" : "locked"),
        attemptCount: record?.attemptCount ?? 0,
        completedAt: record?.completedAt ?? null,
      };
    }),
    latestAttempt: latestAttempt ? serializeBuildAttempt(latestAttempt) : null,
  };
}

export async function createBuildAttempt(input: {
  userId: string;
  challengeSlug: string;
  stageSlug: string;
}) {
  const course = getBuildChallengeCourse(input.challengeSlug);
  const stage = getBuildChallengeStage(input.challengeSlug, input.stageSlug);
  if (!course || !stage) throw new BuildChallengeError("Build challenge not found", "not_found");

  await expireStaleBuildAttempts(input.userId, input.challengeSlug);
  const progress = await getBuildProgress(input.userId, input.challengeSlug);
  if (progress.completedStageCount === course.stages.length) {
    throw new BuildChallengeError("You have already completed this build.", "locked");
  }
  if (progress.currentStageSlug !== input.stageSlug) {
    throw new BuildChallengeError("Complete the earlier stage before testing this one.", "locked");
  }

  const oneMinuteAgo = new Date(Date.now() - buildAttemptRateWindowMs);
  const [recent, active] = await Promise.all([
    db.query.buildAttempts.findMany({
      where: and(
        eq(buildAttempts.userId, input.userId),
        gte(buildAttempts.createdAt, oneMinuteAgo)
      ),
    }),
    db.query.buildAttempts.findFirst({
      where: and(
        eq(buildAttempts.userId, input.userId),
        eq(buildAttempts.challengeSlug, input.challengeSlug),
        eq(buildAttempts.stageSlug, input.stageSlug),
        inArray(buildAttempts.status, ["created", "running"])
      ),
    }),
  ]);

  if (recent.length >= buildAttemptRateLimit) {
    throw new BuildChallengeError("Take a breath—try again in a minute.", "rate_limited");
  }
  if (active) {
    throw new BuildChallengeError("Your previous test is still running.", "attempt_active");
  }

  const [attempt] = await db
    .insert(buildAttempts)
    .values({
      userId: input.userId,
      challengeSlug: course.slug,
      stageSlug: stage.slug,
      status: "created",
    })
    .returning();
  return attempt;
}

export async function getBuildAttemptForUser(attemptId: string, userId: string) {
  await db
    .update(buildAttempts)
    .set({ status: "expired", finishedAt: new Date() })
    .where(
      and(
        eq(buildAttempts.id, attemptId),
        eq(buildAttempts.userId, userId),
        eq(buildAttempts.status, "created"),
        lt(buildAttempts.createdAt, new Date(Date.now() - buildAttemptExpiryMs))
      )
    );
  const attempt = await db.query.buildAttempts.findFirst({
    where: and(eq(buildAttempts.id, attemptId), eq(buildAttempts.userId, userId)),
  });
  return attempt ? serializeBuildAttempt(attempt) : null;
}

export async function claimBuildAttempt(attemptId: string) {
  const [attempt] = await db
    .update(buildAttempts)
    .set({ status: "running", startedAt: new Date() })
    .where(and(eq(buildAttempts.id, attemptId), eq(buildAttempts.status, "created")))
    .returning();
  if (attempt) return attempt;
  throw new BuildChallengeError("This submission can no longer be claimed.", "invalid_transition");
}

export async function finishBuildAttempt(input: {
  attemptId: string;
  status: "passed" | "failed" | "error";
  artifactSha256?: string;
  artifactSize?: number;
  runnerVersion?: string;
  summary?: string;
  result?: unknown;
  errorCode?: string;
}) {
  const result = input.result ? safeResult(input.result) : null;
  if (input.result && !result) throw new BuildChallengeError("Invalid grader result", "invalid_transition");

  return db.transaction(async (tx) => {
    const pendingAttempt = await tx.query.buildAttempts.findFirst({
      where: eq(buildAttempts.id, input.attemptId),
    });
    if (!pendingAttempt) {
      throw new BuildChallengeError("This submission cannot accept a result.", "invalid_transition");
    }
    const previousProgress = await tx.query.buildStageProgress.findFirst({
      where: and(
        eq(buildStageProgress.userId, pendingAttempt.userId),
        eq(buildStageProgress.challengeSlug, pendingAttempt.challengeSlug),
        eq(buildStageProgress.stageSlug, pendingAttempt.stageSlug)
      ),
    });
    const [attempt] = await tx
      .update(buildAttempts)
      .set({
        status: input.status,
        artifactSha256: input.artifactSha256?.slice(0, 64) ?? null,
        artifactSize: input.artifactSize ?? null,
        runnerVersion: input.runnerVersion?.slice(0, 80) ?? null,
        summary: input.summary?.slice(0, 500) ?? null,
        result,
        errorCode: input.errorCode?.slice(0, 80) ?? null,
        finishedAt: new Date(),
      })
      .where(and(eq(buildAttempts.id, input.attemptId), eq(buildAttempts.status, "running")))
      .returning();

    if (!attempt) {
      const existing = await tx.query.buildAttempts.findFirst({
        where: eq(buildAttempts.id, input.attemptId),
      });
      if (existing && isTerminal(existing.status)) return existing;
      throw new BuildChallengeError("This submission cannot accept a result.", "invalid_transition");
    }

    if (input.status === "error") return attempt;

    const delayedHint =
      input.status === "failed" && (previousProgress?.attemptCount ?? 0) + 1 >= 2
        ? getBuildChallengeStage(attempt.challengeSlug, attempt.stageSlug)?.delayedHint
        : null;
    const resultWithHint =
      delayedHint && result
        ? {
            ...result,
            checks: result.checks.map((check, index) =>
              index === result.checks.findIndex((item) => item.status === "failed")
                ? { ...check, hint: delayedHint }
                : check
            ),
          }
        : result;

    if (resultWithHint !== result) {
      await tx.update(buildAttempts).set({ result: resultWithHint }).where(eq(buildAttempts.id, attempt.id));
    }

    await tx
      .insert(buildStageProgress)
      .values({
        userId: attempt.userId,
        challengeSlug: attempt.challengeSlug,
        stageSlug: attempt.stageSlug,
        status: input.status === "passed" ? "passed" : "in_progress",
        attemptCount: 1,
        lastAttemptId: attempt.id,
        completedAt: input.status === "passed" ? new Date() : null,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [buildStageProgress.userId, buildStageProgress.challengeSlug, buildStageProgress.stageSlug],
        set: {
          status: input.status === "passed" ? "passed" : sql`build_stage_progress.status`,
          attemptCount: sql`build_stage_progress.attempt_count + 1`,
          lastAttemptId: attempt.id,
          completedAt: input.status === "passed" ? new Date() : sql`build_stage_progress.completed_at`,
          updatedAt: new Date(),
        },
      });
    return attempt;
  });
}

function serializeBuildAttempt(attempt: typeof buildAttempts.$inferSelect) {
  return {
    id: attempt.id,
    challengeSlug: attempt.challengeSlug,
    stageSlug: attempt.stageSlug,
    status: attempt.status,
    summary: attempt.summary,
    result: safeResult(attempt.result),
    errorCode: attempt.errorCode,
    createdAt: attempt.createdAt,
    startedAt: attempt.startedAt,
    finishedAt: attempt.finishedAt,
  };
}
