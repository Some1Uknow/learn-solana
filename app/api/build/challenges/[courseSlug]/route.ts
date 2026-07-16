import { NextResponse } from "next/server";

import { buildChallengeSubmissionsEnabled } from "@/lib/build-challenges/config";
import { getBuildChallengeCourse, toPublicBuildChallengeCourse } from "@/lib/build-challenges/source";

type Params = Promise<{ courseSlug: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const { courseSlug } = await params;
  const course = getBuildChallengeCourse(courseSlug);
  if (!course) return NextResponse.json({ error: "Build challenge not found" }, { status: 404 });
  return NextResponse.json({
    submissionsEnabled: buildChallengeSubmissionsEnabled,
    challenge: toPublicBuildChallengeCourse(course),
  });
}
