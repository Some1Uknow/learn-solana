import { NextRequest, NextResponse } from "next/server";

import { requirePrivyUser } from "@/lib/auth/privy-server";
import { syncAppUser } from "@/lib/auth/app-user";
import { BuildChallengeError, getBuildProgress } from "@/lib/build-challenges/service";

type Params = Promise<{ courseSlug: string }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const verified = await requirePrivyUser(request);
  if (!verified) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { courseSlug } = await params;
    const { user } = await syncAppUser({ privyUserId: verified.userId });
    return NextResponse.json({ progress: await getBuildProgress(user.id, courseSlug) });
  } catch (error) {
    if (error instanceof BuildChallengeError && error.code === "not_found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    console.error("[build/progress]", error);
    return NextResponse.json({ error: "Could not load build progress." }, { status: 500 });
  }
}
