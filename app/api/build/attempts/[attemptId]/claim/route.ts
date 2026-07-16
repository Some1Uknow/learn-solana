import { NextRequest, NextResponse } from "next/server";

import { verifyRunnerCallback } from "@/lib/build-challenges/runner-auth";
import { BuildChallengeError, claimBuildAttempt } from "@/lib/build-challenges/service";

type Params = Promise<{ attemptId: string }>;

export async function POST(request: NextRequest, { params }: { params: Params }) {
  const body = await request.text();
  if (!verifyRunnerCallback(body, request.headers.get("x-build-runner-timestamp"), request.headers.get("x-build-runner-signature"))) {
    return NextResponse.json({ error: "Invalid runner signature" }, { status: 401 });
  }

  try {
    const { attemptId } = await params;
    const attempt = await claimBuildAttempt(attemptId);
    return NextResponse.json({ id: attempt.id, status: attempt.status });
  } catch (error) {
    if (error instanceof BuildChallengeError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("[build/attempts:claim]", error);
    return NextResponse.json({ error: "Could not claim attempt" }, { status: 500 });
  }
}
