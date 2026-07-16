import { NextRequest, NextResponse } from "next/server";

import { requirePrivyUser } from "@/lib/auth/privy-server";
import { syncAppUser } from "@/lib/auth/app-user";
import { getBuildAttemptForUser } from "@/lib/build-challenges/service";

type Params = Promise<{ attemptId: string }>;

export async function GET(request: NextRequest, { params }: { params: Params }) {
  const verified = await requirePrivyUser(request);
  if (!verified) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { attemptId } = await params;
  const { user } = await syncAppUser({ privyUserId: verified.userId });
  const attempt = await getBuildAttemptForUser(attemptId, user.id);
  if (!attempt) return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  return NextResponse.json({ attempt });
}
