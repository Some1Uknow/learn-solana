import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { requirePrivyUser } from "@/lib/auth/privy-server";
import { syncAppUser } from "@/lib/auth/app-user";
import {
  buildChallengeSubmissionsEnabled,
  buildChallengeUnavailableMessage,
  buildRunnerUrl,
} from "@/lib/build-challenges/config";
import { issueBuildSubmissionToken } from "@/lib/build-challenges/runner-auth";
import { BuildChallengeError, createBuildAttempt } from "@/lib/build-challenges/service";

const schema = z.object({
  challengeSlug: z.string().min(1).max(120),
  stageSlug: z.string().min(1).max(160),
});

function errorStatus(error: BuildChallengeError) {
  if (error.code === "not_found") return 404;
  if (error.code === "locked") return 403;
  if (error.code === "rate_limited") return 429;
  if (error.code === "attempt_active") return 409;
  return 409;
}

export async function POST(request: NextRequest) {
  if (!buildChallengeSubmissionsEnabled || !buildRunnerUrl) {
    return NextResponse.json({ error: buildChallengeUnavailableMessage }, { status: 503 });
  }

  const verified = await requirePrivyUser(request);
  if (!verified) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Choose a valid stage." }, { status: 400 });

  try {
    const { user } = await syncAppUser({ privyUserId: verified.userId });
    const attempt = await createBuildAttempt({ userId: user.id, ...parsed.data });
    const uploadToken = await issueBuildSubmissionToken({
      attemptId: attempt.id,
      userId: user.id,
      challengeSlug: attempt.challengeSlug,
      stageSlug: attempt.stageSlug,
    });
    return NextResponse.json({
      attemptId: attempt.id,
      runnerUrl: buildRunnerUrl,
      uploadToken,
      expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(),
    });
  } catch (error) {
    if (error instanceof BuildChallengeError) {
      return NextResponse.json({ error: error.message }, { status: errorStatus(error) });
    }
    console.error("[build/attempts:create]", error);
    return NextResponse.json({ error: "Could not start a test." }, { status: 500 });
  }
}
