import { NextRequest, NextResponse } from "next/server";
import { requirePrivyUser } from "@/lib/auth/privy-server";
import { syncAppUser } from "@/lib/auth/app-user";

function readOptionalString(value: unknown) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : null;
}

export async function POST(req: NextRequest) {
  try {
    const verified = await requirePrivyUser(req);
    if (!verified) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { user, created, enrichedFields } = await syncAppUser({
      privyUserId: verified.userId,
      profile: {
        email: readOptionalString(body?.email),
        name: readOptionalString(body?.name),
        profileImage: readOptionalString(body?.profileImage),
        walletAddress: readOptionalString(body?.walletAddress),
      },
    });

    return NextResponse.json(
      {
        user,
        created,
        enrichedFields,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[auth/sync] error", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
