import { NextRequest } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { syncAppUser } from "@/lib/auth/app-user";
import { requirePrivyUser } from "@/lib/auth/privy-server";
import { runtimeLabProgress } from "@/lib/db/schema/runtimeLabProgress";
import { getRuntimeLabProgram } from "@/lib/runtime-lab/flows";

const detailPanels = new Set(["runtime", "accounts", "failures"]);

type ProgressRecord = typeof runtimeLabProgress.$inferSelect;

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringRecord(value: unknown): Record<string, string> {
  if (!isPlainRecord(value)) return {};

  return Object.entries(value).reduce<Record<string, string>>((current, [key, item]) => {
    if (typeof item === "string") {
      current[key] = item;
    }
    return current;
  }, {});
}

function booleanRecord(value: unknown): Record<string, boolean> {
  if (!isPlainRecord(value)) return {};

  return Object.entries(value).reduce<Record<string, boolean>>((current, [key, item]) => {
    if (typeof item === "boolean") {
      current[key] = item;
    }
    return current;
  }, {});
}

function serializeProgress(item: ProgressRecord) {
  return {
    version: 1,
    programId: item.programId,
    flowId: item.flowId,
    activeStepIndex: item.activeStepIndex,
    selectedAnswers: item.selectedAnswers ?? {},
    revealedSteps: item.revealedSteps ?? {},
    selectedFailures: item.selectedFailures ?? {},
    activePanel: item.activePanel,
    updatedAt: item.updatedAt,
  };
}

export async function GET(req: NextRequest) {
  try {
    const verified = await requirePrivyUser(req);
    if (!verified) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { searchParams } = new URL(req.url);
    const programId = searchParams.get("programId");

    if (programId && !getRuntimeLabProgram(programId)) {
      return new Response(JSON.stringify({ error: "program not found" }), {
        status: 404,
      });
    }

    const { user } = await syncAppUser({
      privyUserId: verified.userId,
    });

    if (programId) {
      const progress = await db.query.runtimeLabProgress.findFirst({
        where: and(
          eq(runtimeLabProgress.userId, user.id),
          eq(runtimeLabProgress.programId, programId)
        ),
      });

      return new Response(
        JSON.stringify({
          userId: user.id,
          progress: progress ? serializeProgress(progress) : null,
        }),
        { status: 200 }
      );
    }

    const progress = await db.query.runtimeLabProgress.findMany({
      where: eq(runtimeLabProgress.userId, user.id),
    });

    return new Response(
      JSON.stringify({
        userId: user.id,
        progress: progress.reduce<Record<string, ReturnType<typeof serializeProgress>>>(
          (current, item) => {
            current[item.programId] = serializeProgress(item);
            return current;
          },
          {}
        ),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("[runtime-lab/progress:GET] error", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
    });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const verified = await requirePrivyUser(req);
    if (!verified) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const body = await req.json().catch(() => ({}));
    const programId = typeof body.programId === "string" ? body.programId : "";
    const flowId = typeof body.flowId === "string" ? body.flowId : "";
    const activePanel = detailPanels.has(body.activePanel) ? body.activePanel : "runtime";
    const program = getRuntimeLabProgram(programId);
    const flow = program?.flows.find((item) => item.id === flowId);

    if (!program) {
      return new Response(JSON.stringify({ error: "program not found" }), {
        status: 404,
      });
    }

    if (!flow) {
      return new Response(JSON.stringify({ error: "flow not found" }), {
        status: 404,
      });
    }

    const rawStepIndex = Number.isInteger(body.activeStepIndex)
      ? body.activeStepIndex
      : 0;
    const activeStepIndex = Math.min(
      Math.max(rawStepIndex, 0),
      Math.max(0, flow.steps.length - 1)
    );

    const { user } = await syncAppUser({
      privyUserId: verified.userId,
    });
    const now = new Date();
    const selectedAnswers = stringRecord(body.selectedAnswers);
    const revealedSteps = booleanRecord(body.revealedSteps);
    const selectedFailures = stringRecord(body.selectedFailures);

    const existing = await db.query.runtimeLabProgress.findFirst({
      where: and(
        eq(runtimeLabProgress.userId, user.id),
        eq(runtimeLabProgress.programId, program.id)
      ),
    });

    if (!existing) {
      await db.insert(runtimeLabProgress).values({
        userId: user.id,
        programId: program.id,
        flowId: flow.id,
        activeStepIndex,
        selectedAnswers,
        revealedSteps,
        selectedFailures,
        activePanel,
        updatedAt: now,
      });
    } else {
      await db
        .update(runtimeLabProgress)
        .set({
          flowId: flow.id,
          activeStepIndex,
          selectedAnswers,
          revealedSteps,
          selectedFailures,
          activePanel,
          updatedAt: now,
        })
        .where(
          and(
            eq(runtimeLabProgress.userId, user.id),
            eq(runtimeLabProgress.programId, program.id)
          )
        );
    }

    const refreshed = await db.query.runtimeLabProgress.findFirst({
      where: and(
        eq(runtimeLabProgress.userId, user.id),
        eq(runtimeLabProgress.programId, program.id)
      ),
    });

    return new Response(
      JSON.stringify({
        userId: user.id,
        progress: refreshed ? serializeProgress(refreshed) : null,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("[runtime-lab/progress:PUT] error", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const verified = await requirePrivyUser(req);
    if (!verified) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const { searchParams } = new URL(req.url);
    const programId = searchParams.get("programId");
    const program = programId ? getRuntimeLabProgram(programId) : null;

    if (!program) {
      return new Response(JSON.stringify({ error: "program not found" }), {
        status: 404,
      });
    }

    const { user } = await syncAppUser({
      privyUserId: verified.userId,
    });

    await db
      .delete(runtimeLabProgress)
      .where(
        and(
          eq(runtimeLabProgress.userId, user.id),
          eq(runtimeLabProgress.programId, program.id)
        )
      );

    return new Response(JSON.stringify({ userId: user.id, deleted: true }), {
      status: 200,
    });
  } catch (error) {
    console.error("[runtime-lab/progress:DELETE] error", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
    });
  }
}
