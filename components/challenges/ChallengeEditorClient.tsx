"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import { CheckCircle2, ChevronDown, ClipboardList, Play, Send, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useExerciseProgress } from "@/hooks/use-exercise-progress";
import { useLoginGate } from "@/hooks/use-login-gate";
import { LoginRequiredModal } from "@/components/ui/login-required-modal";
import { RustMonacoEditor } from "./RustMonacoEditor";

const MIN_OUTPUT_HEIGHT = 260;
const MIN_EDITOR_HEIGHT = 220;
const INITIAL_EDITOR_HEIGHT = 360;
const SEPARATOR_HEIGHT = 16;

type RunMode = "run" | "submit";
type SaveState = "idle" | "saving" | "saved" | "failed";

type RunResult = {
  stdout: string;
  stderr: string;
  testResults?: Array<{
    name: string;
    displayInput?: string;
    passed: boolean;
    expectedStdout: string;
    actualStdout: string;
    stderr: string;
  }>;
  passed: boolean | null;
  mode?: RunMode;
  message?: string;
};

function getCaseLabel(name: string, index: number) {
  if (!name || name.toLowerCase() === "main" || name.toLowerCase() === "test") {
    return `Case ${index + 1}`;
  }

  return name;
}

function formatCaseOutput(value: string | undefined) {
  if (!value) return "(empty)";
  return value.trimEnd() || "(empty)";
}

export default function ChallengeEditorClient({
  starterCode,
  track,
  currentIndex: _currentIndex,
  totalCount: _totalCount,
  exerciseSlug,
  previousHref,
  nextHref,
  canExecute,
}: {
  starterCode?: string;
  track?: string;
  currentIndex?: number;
  totalCount?: number;
  exerciseSlug?: string;
  previousHref?: string;
  nextHref?: string;
  canExecute?: boolean;
}) {
  const { authenticated } = useAuth();
  const { requireLogin, showModal, setShowModal } = useLoginGate();
  const { progress, markCompleted } = useExerciseProgress(track);
  const [code, setCode] = useState(
    starterCode ||
      '// Write your Rust solution here\nfn main() {\n    println!("Hello, Rustacean!");\n}\n'
  );
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [runningAction, setRunningAction] = useState<RunMode | null>(null);
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [testsCollapsed, setTestsCollapsed] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [editorHeight, setEditorHeight] = useState(INITIAL_EDITOR_HEIGHT);
  const [isResizing, setIsResizing] = useState(false);
  const isCompleted = Boolean(exerciseSlug && progress[exerciseSlug]);

  useEffect(() => {
    setCode(starterCode || "");
    setRunResult(null);
    setActiveCaseIndex(0);
    setTestsCollapsed(false);
    setSaveState("idle");
    setSaveError(null);
  }, [starterCode]);

  const clampEditorHeight = useCallback((value: number) => {
    const container = containerRef.current;
    if (!container) return value;

    const rect = container.getBoundingClientRect();
    const minHeight = MIN_EDITOR_HEIGHT;
    const maxHeight = Math.max(minHeight, rect.height - MIN_OUTPUT_HEIGHT - SEPARATOR_HEIGHT);
    const clamped = Math.min(Math.max(value, minHeight), maxHeight);
    return Number.isFinite(clamped) ? clamped : minHeight;
  }, []);

  const updateEditorHeightFromPointer = useCallback(
    (clientY: number) => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const desired = clientY - rect.top;
      setEditorHeight((prev) => clampEditorHeight(Number.isFinite(desired) ? desired : prev));
    },
    [clampEditorHeight]
  );

  useEffect(() => {
    setEditorHeight((prev) => clampEditorHeight(prev));
    const handleResize = () => {
      setEditorHeight((prev) => clampEditorHeight(prev));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clampEditorHeight]);

  useEffect(() => {
    if (!isResizing) return;

    const handlePointerMove = (event: PointerEvent) => {
      event.preventDefault();
      updateEditorHeightFromPointer(event.clientY);
    };
    const stop = () => setIsResizing(false);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stop);
    window.addEventListener("pointercancel", stop);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stop);
      window.removeEventListener("pointercancel", stop);
    };
  }, [isResizing, updateEditorHeightFromPointer]);

  useEffect(() => {
    if (!isResizing) return;

    const originalCursor = document.body.style.cursor;
    const originalSelect = document.body.style.userSelect;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.body.style.cursor = originalCursor;
      document.body.style.userSelect = originalSelect;
    };
  }, [isResizing]);

  const canRun = Boolean(canExecute && track && exerciseSlug);
  const isRunning = runningAction !== null;

  const persistCompletion = useCallback(
    async (solutionCode: string) => {
      if (!track || !exerciseSlug) return;
      setSaveError(null);
      await markCompleted(exerciseSlug, solutionCode);
    },
    [exerciseSlug, markCompleted, track]
  );

  const executeChallenge = useCallback(
    async (mode: RunMode) => {
      if (!canRun) {
        setRunResult({
          stdout: "",
          stderr: "",
          testResults: [],
          passed: null,
          mode,
          message: "Execution is not available for this challenge yet.",
        });
        return;
      }

      setRunningAction(mode);
      setRunResult(null);
      setActiveCaseIndex(0);
      setSaveState("idle");
      setSaveError(null);

      try {
        const response = await fetch("/api/challenges/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            track,
            exerciseSlug,
            mode,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setRunResult({
            stdout: "",
            stderr: data?.stderr ?? "",
            testResults: Array.isArray(data?.tests) ? data.tests : [],
            passed: null,
            mode,
            message:
              data?.error ??
              data?.message ??
              "Rust playground execution failed. Please review your code and try again.",
          });
          return;
        }

        const passed =
          typeof data?.passed === "boolean" ? data.passed : data?.compiler?.success ?? null;

        const nextTests = Array.isArray(data?.tests) ? data.tests : [];
        const firstFailureIndex = nextTests.findIndex((test: { passed?: boolean }) => !test.passed);

        setRunResult({
          stdout: data?.stdout ?? "",
          stderr: data?.stderr ?? "",
          testResults: nextTests,
          passed,
          mode,
          message: data?.message,
        });
        setActiveCaseIndex(firstFailureIndex >= 0 ? firstFailureIndex : 0);

        if (mode === "submit" && passed === true) {
          if (isCompleted) {
            setSaveState("saved");
            return;
          }

          try {
            setSaveState("saving");
            await persistCompletion(code);
            setSaveState("saved");
          } catch (error) {
            console.error("Failed to save progress:", error);
            setSaveState("failed");
            setSaveError("All cases passed, but progress could not be saved. Try again.");
          }
        }
      } catch (error) {
        setRunResult({
          stdout: "",
          stderr: "",
          testResults: [],
          passed: null,
          mode,
          message:
            "Unable to reach the Rust execution service right now. Please check your connection and try again.",
        });
      } finally {
        setRunningAction(null);
      }
    },
    [canRun, code, exerciseSlug, isCompleted, persistCompletion, track]
  );

  const handleRun = useCallback(() => {
    if (!canRun) {
      setRunResult({
        stdout: "",
        stderr: "",
        testResults: [],
        passed: null,
        mode: "run",
        message: "Execution is not available for this challenge yet.",
      });
      return;
    }

    void executeChallenge("run");
  }, [canRun, executeChallenge]);

  const handleSubmit = useCallback(() => {
    if (!canRun) {
      setRunResult({
        stdout: "",
        stderr: "",
        testResults: [],
        passed: null,
        mode: "submit",
        message: "Execution is not available for this challenge yet.",
      });
      return;
    }

    if (authenticated) {
      void executeChallenge("submit");
      return;
    }

    requireLogin(() => {
      void executeChallenge("submit");
    });
  }, [authenticated, canRun, executeChallenge, requireLogin]);

  const handleReset = () => {
    setCode(starterCode || "");
    setRunResult(null);
    setActiveCaseIndex(0);
    setTestsCollapsed(false);
    setSaveState("idle");
    setSaveError(null);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {}
  };

  const handleSeparatorPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    updateEditorHeightFromPointer(event.clientY);
    setIsResizing(true);
  };

  const desktopButtonClasses =
    "rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white";
  const runButtonClasses =
    "inline-flex items-center gap-2 rounded-md border border-cyan-400/35 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-400/20";
  const submitButtonClasses =
    "inline-flex items-center gap-2 rounded-md border border-emerald-400/45 bg-emerald-400/15 px-4 py-2 text-sm font-semibold text-emerald-100 transition hover:border-emerald-300/70 hover:bg-emerald-400/25";

  const testResults = runResult?.testResults ?? [];
  const selectedCase =
    testResults.length > 0 ? testResults[Math.min(activeCaseIndex, testResults.length - 1)] : null;
  const passedCount = testResults.filter((test) => test.passed).length;

  return (
    <>
      <section ref={containerRef} className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        <div
          className="relative min-h-0 shrink-0 flex flex-col overflow-hidden"
          style={{ height: editorHeight, minHeight: MIN_EDITOR_HEIGHT }}
        >
          <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-black/40 px-4 py-2 sm:px-5 sm:py-3">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <span className="rounded-md border border-white/10 bg-white/[0.06] px-2 py-0.5 text-xs uppercase tracking-[0.2em] text-zinc-400">
                Language
              </span>
              <span className="font-medium text-white">Rust</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleCopy} className={desktopButtonClasses}>
                Copy
              </button>
              <button onClick={handleReset} className={desktopButtonClasses}>
                Reset
              </button>
            </div>
          </div>

          <div className="h-full min-h-0 flex-1 overflow-hidden">
            <RustMonacoEditor value={code} onChange={setCode} onRun={handleRun} height="100%" />
          </div>
        </div>

        <div
          role="separator"
          aria-orientation="horizontal"
          aria-label="Resize output panel"
          onPointerDown={handleSeparatorPointerDown}
          className={`relative z-10 flex h-4 shrink-0 cursor-row-resize items-center justify-center transition ${
            isResizing ? "bg-white/10" : "bg-transparent hover:bg-white/5"
          }`}
        >
          <div
            className={`h-1 w-16 rounded-full transition ${
              isResizing ? "bg-emerald-300/70" : "bg-white/30"
            }`}
          />
        </div>

        <div
          className="flex shrink-0 flex-col border-t border-white/10 bg-black/40 p-3 sm:p-4"
          style={{ minHeight: MIN_OUTPUT_HEIGHT, flex: "1 1 0%" }}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleRun}
                disabled={isRunning || !canRun}
                className={`${runButtonClasses} ${
                  isRunning || !canRun ? "cursor-not-allowed opacity-60" : ""
                }`}
              >
                <Play className="h-4 w-4" />
                {runningAction === "run" ? "Running..." : "Run"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isRunning || !canRun}
                className={`${submitButtonClasses} ${
                  isRunning || !canRun ? "cursor-not-allowed opacity-60" : ""
                }`}
              >
                <Send className="h-4 w-4" />
                {runningAction === "submit" ? "Submitting..." : "Submit"}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setTestsCollapsed((collapsed) => !collapsed)}
              aria-expanded={!testsCollapsed}
              className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium text-zinc-500 transition hover:text-zinc-300"
            >
              {testsCollapsed ? "Show tests" : "Hide tests"}
              <ChevronDown
                className={`h-3.5 w-3.5 transition ${testsCollapsed ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <div className="min-h-0 w-full flex-1 overflow-auto rounded-lg border border-white/10 bg-[#090a0d] text-xs text-zinc-300">
            {isRunning ? (
              <div className="flex h-full min-h-[120px] items-center justify-center text-zinc-400">
                {runningAction === "submit"
                  ? "Submitting against configured cases..."
                  : "Running configured cases..."}
              </div>
            ) : !runResult ? (
              <div className="flex h-full min-h-[120px] items-center justify-center text-center text-zinc-500">
                Run cases to compare your output against each configured input. Submit saves
                progress only when every case passes.
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-white">
                    <ClipboardList className="h-4 w-4 text-emerald-300" />
                    Test Cases
                  </div>
                  {runResult.passed === true ? (
                    <div className="text-xs text-zinc-500">All sample test cases passed</div>
                  ) : runResult.message ? (
                    <div className="text-xs text-zinc-500">{runResult.message}</div>
                  ) : null}
                </div>

                {testResults.length > 0 ? (
                  <>
                    <div className="flex items-center overflow-x-auto border-b border-white/10 bg-white/[0.02]">
                      {testResults.map((test, index) => {
                        const isActive =
                          index === Math.min(activeCaseIndex, testResults.length - 1);
                        const Icon = test.passed ? CheckCircle2 : XCircle;

                        return (
                          <button
                            key={`${test.name}-${index}`}
                            type="button"
                            onClick={() => setActiveCaseIndex(index)}
                            className={`flex min-w-[128px] items-center justify-center gap-2 border-r border-white/10 px-4 py-3 text-sm font-semibold transition ${
                              isActive
                                ? "bg-white/[0.07] text-white"
                                : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-200"
                            }`}
                          >
                            <Icon
                              className={`h-4 w-4 ${
                                test.passed ? "text-emerald-300" : "text-rose-300"
                              }`}
                            />
                            {getCaseLabel(test.name, index)}
                          </button>
                        );
                      })}
                    </div>

                    {testsCollapsed ? (
                      <div className="flex items-center justify-between px-4 py-4 text-sm text-zinc-400 sm:px-5">
                        <span>
                          {passedCount}/{testResults.length} case
                          {testResults.length === 1 ? "" : "s"} passed
                        </span>
                        {runResult.passed === true ? (
                          <span className="inline-flex items-center gap-2 text-emerald-200">
                            <CheckCircle2 className="h-4 w-4" />
                            Accepted
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-rose-200">
                            <XCircle className="h-4 w-4" />
                            Needs work
                          </span>
                        )}
                      </div>
                    ) : selectedCase ? (
                      <div className="space-y-5 p-4 sm:p-5">
                        <section>
                          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            Input
                          </div>
                          <pre className="min-h-[76px] whitespace-pre-wrap break-words rounded-md border border-white/10 bg-black/35 p-4 text-sm leading-6 text-zinc-100">
                            {selectedCase.displayInput ?? "No input"}
                          </pre>
                        </section>

                        <section>
                          <span
                            className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-semibold ${
                              selectedCase.passed
                                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                                : "border-rose-400/25 bg-rose-400/10 text-rose-200"
                            }`}
                          >
                            {selectedCase.passed ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <XCircle className="h-4 w-4" />
                            )}
                            {selectedCase.passed ? "Accepted" : "Wrong Answer"}
                          </span>
                          {runResult.mode === "submit" && runResult.passed === true ? (
                            saveState === "saved" ? (
                              <div className="mt-3 rounded-md border border-emerald-400/25 bg-emerald-400/10 px-4 py-3 text-sm font-medium text-emerald-100">
                                Path completed. Progress saved.
                              </div>
                            ) : saveState === "saving" ? (
                              <div className="mt-3 rounded-md border border-cyan-400/25 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-100">
                                Saving progress...
                              </div>
                            ) : null
                          ) : null}
                          {saveError ? (
                            <div className="mt-3 rounded-md border border-amber-300/25 bg-amber-400/10 px-4 py-3 text-sm font-medium text-amber-100">
                              {saveError}
                            </div>
                          ) : null}
                        </section>

                        <section>
                          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            Your Output
                          </div>
                          <pre className="whitespace-pre-wrap break-words rounded-md border border-white/10 bg-black/35 p-4 text-sm leading-6 text-zinc-100">
                            {formatCaseOutput(selectedCase.actualStdout)}
                          </pre>
                        </section>

                        <section>
                          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
                            Expected Output
                          </div>
                          <pre className="whitespace-pre-wrap break-words rounded-md border border-white/10 bg-black/35 p-4 text-sm leading-6 text-zinc-100">
                            {formatCaseOutput(selectedCase.expectedStdout)}
                          </pre>
                        </section>

                        {selectedCase.stderr ? (
                          <section>
                            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-100/60">
                              Compiler Output
                            </div>
                            <pre className="whitespace-pre-wrap break-words rounded-md border border-amber-300/20 bg-amber-400/10 p-4 text-sm leading-6 text-amber-50">
                              {selectedCase.stderr}
                            </pre>
                          </section>
                        ) : null}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <pre className="m-4 rounded-md border border-white/10 bg-black/35 p-4 text-sm text-zinc-300">
                    {runResult.stderr
                      ? `stderr:\n${runResult.stderr}`
                      : runResult.stdout
                        ? `stdout:\n${runResult.stdout}`
                        : "(no output)"}
                  </pre>
                )}
              </div>
            )}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <Link
              href={previousHref ?? "#"}
              className={`rounded-md border px-3 py-1.5 text-xs transition ${
                previousHref
                  ? "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
                  : "pointer-events-none border-white/5 bg-white/[0.03] text-zinc-600"
              }`}
            >
              ← Previous
            </Link>
            <Link
              href={nextHref ?? "#"}
              className={`rounded-md border px-3 py-1.5 text-xs transition ${
                nextHref
                  ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200 hover:border-cyan-400/50 hover:bg-cyan-400/15"
                  : "pointer-events-none border-white/5 bg-white/[0.03] text-zinc-600"
              }`}
            >
              Next →
            </Link>
          </div>
        </div>
      </section>

      <LoginRequiredModal
        open={showModal}
        onOpenChange={setShowModal}
        title="Sign in to submit"
        description="Run cases are available while you practice. Sign in to submit and save completion."
      />
    </>
  );
}
