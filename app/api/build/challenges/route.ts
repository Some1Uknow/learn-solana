import { NextResponse } from "next/server";

import { buildChallengeSubmissionsEnabled } from "@/lib/build-challenges/config";
import { listBuildChallengeCourses, toPublicBuildChallengeCourse } from "@/lib/build-challenges/source";

export async function GET() {
  return NextResponse.json({
    submissionsEnabled: buildChallengeSubmissionsEnabled,
    challenges: listBuildChallengeCourses().map(toPublicBuildChallengeCourse),
  });
}
