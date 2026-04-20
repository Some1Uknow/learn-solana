import { NextResponse } from "next/server";
import { z } from "zod";
import { getExercise } from "@/lib/challenges/exercises";

const requestSchema = z.object({
  code: z.string().min(1, "Code is required").max(10000),
  track: z.string().min(1),
  exerciseSlug: z.string().min(1),
  mode: z.enum(["run", "submit"]).default("run"),
});

const normalizeStdout = (value: string) => value.replace(/\r\n/g, "\n").trimEnd();

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = requestSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request payload.", issues: parsed.error.format() },
      { status: 400 }
    );
  }

  const { code, track, exerciseSlug, mode } = parsed.data;
  const exercise = getExercise(track, exerciseSlug);

  if (!exercise || !exercise.executor) {
    return NextResponse.json(
      { error: "Execution is not configured for this exercise." },
      { status: 400 }
    );
  }

  const executor = exercise.executor;

  if (executor.type !== "rust-playground") {
    return NextResponse.json(
      { error: "Unsupported execution backend for this exercise." },
      { status: 400 }
    );
  }

  const results = [];

  for (const test of executor.tests) {
    const codeSegments = [test.harnessBefore, code, test.harnessAfter].filter(
      (segment): segment is string => Boolean(segment && segment.trim().length > 0)
    );
    const combinedCode = codeSegments.join("\n\n");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    let playgroundResponse: Response;

    try {
      playgroundResponse = await fetch("https://play.rust-lang.org/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channel: executor.channel ?? "stable",
          edition: executor.edition ?? "2021",
          crateType: "bin",
          mode: executor.mode ?? "debug",
          tests: false,
          code: combinedCode,
          backtrace: true,
        }),
        signal: controller.signal,
      });
    } catch (error) {
      clearTimeout(timeout);
      const message = error instanceof Error ? error.message : "Rust playground request failed.";
      return NextResponse.json({ error: message }, { status: 502 });
    }

    clearTimeout(timeout);

    if (!playgroundResponse.ok) {
      const errorBody = await playgroundResponse.text();
      return NextResponse.json(
        {
          error: "Rust playground returned an error response.",
          status: playgroundResponse.status,
          body: errorBody,
        },
        { status: 502 }
      );
    }

    const playgroundJson = (await playgroundResponse.json().catch(() => null)) as
      | {
          success?: boolean;
          stdout?: string;
          stderr?: string;
          exit_code?: number | string | null;
          error?: string;
        }
      | null;

    if (!playgroundJson) {
      return NextResponse.json(
        { error: "Failed to parse response from Rust playground." },
        { status: 502 }
      );
    }

    const stdout = playgroundJson.stdout ?? "";
    const stderr = playgroundJson.stderr ?? "";
    const playgroundSuccess = Boolean(playgroundJson.success);
    const expected = normalizeStdout(test.expectedStdout);
    const actual = normalizeStdout(stdout);
    const passed = playgroundSuccess && actual === expected;

    results.push({
      name: test.name,
      displayInput: test.displayInput,
      passed,
      expectedStdout: test.expectedStdout,
      actualStdout: stdout,
      stderr: playgroundSuccess ? "" : stderr,
      compiler: {
        success: playgroundSuccess,
        exitCode:
          typeof playgroundJson.exit_code === "string"
            ? Number.parseInt(playgroundJson.exit_code, 10)
            : typeof playgroundJson.exit_code === "number"
            ? playgroundJson.exit_code
            : null,
      },
      error: playgroundJson.error ?? null,
    });
  }

  const firstFailure = results.find((result) => !result.passed) ?? null;
  const passedCount = results.filter((result) => result.passed).length;
  const passed = results.length > 0 ? passedCount === results.length : null;

  return NextResponse.json(
    {
      stdout: firstFailure?.actualStdout ?? results.at(-1)?.actualStdout ?? "",
      stderr: firstFailure?.stderr ?? results.at(-1)?.stderr ?? "",
      passed,
      mode,
      tests: results,
      message:
        passed === true
          ? `All ${results.length} test case${results.length === 1 ? "" : "s"} passed.`
          : firstFailure?.error ??
            `${passedCount}/${results.length} test case${
              results.length === 1 ? "" : "s"
            } passed.`,
    },
    { status: 200 }
  );
}
