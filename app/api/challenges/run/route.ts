import { NextResponse } from "next/server";
import { z } from "zod";
import { getChallenge } from "@/lib/challenges/registry";

const trackValues = ["rust", "anchor"] as const;

const requestSchema = z.object({
  code: z.string().min(1, "Code is required").max(10000),
  track: z.enum(trackValues),
  challengeId: z.coerce.number().int().positive(),
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

  const { code, track, challengeId } = parsed.data;
  const challenge = getChallenge(track, challengeId);

  if (!challenge || !challenge.executor) {
    return NextResponse.json(
      { error: "Execution is not configured for this challenge." },
      { status: 400 }
    );
  }

  const executor = challenge.executor;

  if (executor.type !== "rust-playground") {
    return NextResponse.json(
      { error: "Unsupported execution backend for this challenge." },
      { status: 400 }
    );
  }

  const codeSegments = [executor.harnessBefore, code, executor.harnessAfter].filter(
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
  const expected = normalizeStdout(executor.expectedStdout);
  const actual = normalizeStdout(stdout);
  const passed = playgroundSuccess && actual === expected;

  const exitCodeRaw = playgroundJson.exit_code;
  const exitCode =
    typeof exitCodeRaw === "string"
      ? Number.parseInt(exitCodeRaw, 10)
      : typeof exitCodeRaw === "number"
      ? exitCodeRaw
      : null;

  const payload = {
    stdout,
    stderr,
    expectedStdout: executor.expectedStdout,
    passed,
    compiler: {
      success: playgroundSuccess,
      exitCode,
    },
    message: playgroundSuccess
      ? passed
        ? "Output matches the expected signal."
        : "Output mismatch. The decoded signal differs from the expected answer."
      : playgroundJson.error ?? "Compilation failed. Review stderr for diagnostics.",
  };

  return NextResponse.json(payload, { status: 200 });
}
