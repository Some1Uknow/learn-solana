import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { verifyRunnerCallback } from "@/lib/build-challenges/runner-auth";
import { BuildChallengeError, finishBuildAttempt } from "@/lib/build-challenges/service";

type Params = Promise<{ attemptId: string }>;

const resultSchema = z.object({
  status: z.enum(["passed", "failed", "error"]),
  artifactSha256: z.string().regex(/^[a-f0-9]{64}$/).optional(),
  artifactSize: z.number().int().positive().max(5 * 1024 * 1024).optional(),
  runnerVersion: z.string().max(80).optional(),
  summary: z.string().max(500).optional(),
  result: z.unknown().optional(),
  errorCode: z.string().max(80).optional(),
});

export async function POST(request: NextRequest, { params }: { params: Params }) {
  const body = await request.text();
  if (!verifyRunnerCallback(body, request.headers.get("x-build-runner-timestamp"), request.headers.get("x-build-runner-signature"))) {
    return NextResponse.json({ error: "Invalid runner signature" }, { status: 401 });
  }
  const parsed = resultSchema.safeParse(
    (() => {
      try {
        return JSON.parse(body || "{}");
      } catch {
        return null;
      }
    })()
  );
  if (!parsed.success) return NextResponse.json({ error: "Invalid runner result" }, { status: 400 });

  try {
    const { attemptId } = await params;
    const attempt = await finishBuildAttempt({ attemptId, ...parsed.data });
    return NextResponse.json({ id: attempt.id, status: attempt.status });
  } catch (error) {
    if (error instanceof BuildChallengeError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("[build/attempts:result]", error);
    return NextResponse.json({ error: "Could not record result" }, { status: 500 });
  }
}
