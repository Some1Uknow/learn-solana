"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Link from "next/link";
import { useWeb3AuthUser, useWeb3Auth } from "@web3auth/modal/react";
import { authFetch } from "@/lib/auth/authFetch";

const MIN_OUTPUT_HEIGHT = 150;
const MIN_EDITOR_HEIGHT = 220;
const INITIAL_OUTPUT_HEIGHT = 220;

type RunResult = {
  stdout: string;
  stderr: string;
  expectedStdout?: string;
  passed: boolean | null;
  message?: string;
};

export default function ChallengeEditorClient({
  starterCode,
  track,
  currentIndex,
  totalCount,
  challengeId,
  canExecute,
}: {
  starterCode?: string;
  track?: string;
  currentIndex?: number;
  totalCount?: number;
  challengeId?: number;
  canExecute?: boolean;
}) {
  const { userInfo } = useWeb3AuthUser();
  const { provider, isConnected } = useWeb3Auth();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [code, setCode] = useState(
    starterCode ||
      '// Write your Rust solution here\nfn main() {\n    println!("Hello, Rustacean!");\n}\n'
  );
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);
  const [outputHeight, setOutputHeight] = useState(INITIAL_OUTPUT_HEIGHT);
  const [isResizing, setIsResizing] = useState(false);

  // Fetch wallet address from Web3Auth provider
  useEffect(() => {
    let cancelled = false;
    async function fetchAddress() {
      if (!provider || !isConnected) {
        setWalletAddress(null);
        return;
      }
      try {
        const accounts = await provider.request({
          method: "getAccounts",
          params: {},
        });
        const addr = Array.isArray(accounts) ? accounts[0] : accounts;
        if (!cancelled && addr) setWalletAddress(addr);
      } catch (e) {
        console.error("Failed to get wallet address:", e);
      }
    }
    fetchAddress();
    return () => { cancelled = true; };
  }, [provider, isConnected]);

  // Fetch existing progress to check if already solved
  useEffect(() => {
    let cancelled = false;
    async function fetchProgress() {
      if (!walletAddress || !track || !challengeId) {
        setProgressLoaded(true);
        return;
      }
      try {
        const res = await authFetch(`/api/challenges/progress?track=${track}&wallet=${walletAddress}`);
        if (res.ok && !cancelled) {
          const data = await res.json();
          const progressMap = data.progress || {};
          if (progressMap[challengeId]) {
            setIsSolved(true);
          }
        }
      } catch (e) {
        console.error("Failed to fetch progress:", e);
      }
      if (!cancelled) setProgressLoaded(true);
    }
    fetchProgress();
    return () => { cancelled = true; };
  }, [walletAddress, track, challengeId]);

  useEffect(() => {
    setCode(starterCode || "");
    setRunResult(null);
  }, [starterCode]);

  const lineCount = useMemo(() => (code ? code.split("\n").length : 1), [code]);
  const lines = useMemo(
    () => Array.from({ length: lineCount }, (_, i) => i + 1),
    [lineCount]
  );

  const gutterRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const clampOutputHeight = useCallback(
    (value: number) => {
      const container = containerRef.current;
      if (!container) return value;
      const rect = container.getBoundingClientRect();
      const minHeight = MIN_OUTPUT_HEIGHT;
      const maxHeight = Math.max(minHeight, rect.height - MIN_EDITOR_HEIGHT);
      const clamped = Math.min(Math.max(value, minHeight), maxHeight);
      return Number.isFinite(clamped) ? clamped : minHeight;
    },
    []
  );

  const updateOutputHeightFromPointer = useCallback(
    (clientY: number) => {
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const desired = rect.bottom - clientY;
      setOutputHeight((prev) => clampOutputHeight(Number.isFinite(desired) ? desired : prev));
    },
    [clampOutputHeight]
  );

  useEffect(() => {
    setOutputHeight((prev) => clampOutputHeight(prev));
    const handleResize = () => {
      setOutputHeight((prev) => clampOutputHeight(prev));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [clampOutputHeight]);

  useEffect(() => {
    if (!isResizing) return;
    const handlePointerMove = (event: PointerEvent) => {
      event.preventDefault();
      updateOutputHeightFromPointer(event.clientY);
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
  }, [isResizing, updateOutputHeightFromPointer]);

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

  const syncScroll = () => {
    if (!gutterRef.current || !textareaRef.current) return;
    gutterRef.current.scrollTop = textareaRef.current.scrollTop;
  };

  const handleSeparatorPointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
    updateOutputHeightFromPointer(event.clientY);
    setIsResizing(true);
  };

  const canRun = Boolean(canExecute && track && challengeId);

  const handleRun = async () => {
    if (!canRun) {
      setRunResult({
        stdout: "",
        stderr: "",
        expectedStdout: undefined,
        passed: null,
        message: "Execution is not available for this challenge yet.",
      });
      return;
    }

    setIsRunning(true);
    setRunResult(null);

    try {
      const response = await fetch("/api/challenges/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          track,
          challengeId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRunResult({
          stdout: "",
          stderr: data?.stderr ?? "",
          expectedStdout: data?.expectedStdout,
          passed: null,
          message:
            data?.error ??
            data?.message ??
            "Rust playground execution failed. Please review your code and try again.",
        });
        return;
      }

      const passed =
        typeof data?.passed === "boolean" ? data.passed : data?.compiler?.success ?? null;

      setRunResult({
        stdout: data?.stdout ?? "",
        stderr: data?.stderr ?? "",
        expectedStdout: data?.expectedStdout,
        passed,
        message: data?.message,
      });

      // Auto-save progress if passed, user is authenticated, and NOT already solved
      // This prevents duplicate API calls and incorrect attempts incrementing
      if (passed === true && walletAddress && track && challengeId && !isSolved) {
        setIsSolved(true);
        try {
          await authFetch("/api/challenges/complete", {
            method: "POST",
            body: JSON.stringify({
              track,
              challengeId,
              code,
              walletAddress,
            }),
          });
        } catch (e) {
          // Silently fail - the user still sees their success
          console.error("Failed to save progress:", e);
        }
      }
    } catch (error) {
      setRunResult({
        stdout: "",
        stderr: "",
        expectedStdout: undefined,
        passed: null,
        message:
          "Unable to reach the Rust execution service right now. Please check your connection and try again.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCode(starterCode || "");
    setRunResult(null);
  };
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {}
  };

  const desktopButtonClasses =
    "rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white";
  const primaryButtonClasses =
    "rounded-md border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:border-emerald-400/60 hover:bg-emerald-400/20";

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-0 flex-1 flex-col overflow-hidden"
    >
      <div className="relative min-h-0 flex flex-1 flex-col overflow-hidden">
        {/* Editor header (mobile) */}
        <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-black/40 px-4 py-2 sm:hidden">
          <div className="text-xs text-zinc-400">Language: Rust</div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-zinc-300"
            >
              Copy
            </button>
            <button
              onClick={handleReset}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-zinc-300"
            >
              Reset
            </button>
            <button
              onClick={handleRun}
              disabled={isRunning || !canRun}
              className={`rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-[11px] font-semibold text-emerald-200 transition ${
                isRunning || !canRun
                  ? "cursor-not-allowed opacity-60"
                  : "hover:border-emerald-400/50 hover:bg-emerald-400/15"
              }`}
            >
              {isRunning ? "Running..." : "Run"}
            </button>
          </div>
        </div>

        {/* Editor header (desktop) */}
        <div className="hidden shrink-0 items-center justify-between border-b border-white/10 bg-black/40 px-5 py-3 sm:flex">
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
            <button
              onClick={handleRun}
              disabled={isRunning || !canRun}
              className={`${
                isRunning || !canRun ? "opacity-60 cursor-not-allowed" : ""
              } ${primaryButtonClasses}`}
            >
              {isRunning ? "Running..." : "Run Code"}
            </button>
          </div>
        </div>

        {/* Simple editor */}
        <div className="grid h-full min-h-0 flex-1 grid-cols-[48px_1fr] overflow-hidden">
          <div
            ref={gutterRef}
            className="select-none border-r border-white/10 bg-black/40 px-2 py-3 text-right text-[11px] leading-5 text-zinc-600 overflow-hidden"
          >
            {lines.map((n) => (
              <div key={n} className="tabular-nums">
                {n}
              </div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onScroll={syncScroll}
            spellCheck={false}
            aria-label="Rust code editor"
            title="Rust code editor"
            className="h-full min-h-0 w-full resize-none overflow-y-scroll overflow-x-auto overscroll-contain bg-transparent p-3 pr-4 font-mono text-[12.5px] leading-5 text-zinc-100 outline-none [caret-color:#22d3ee]"
          />
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

      {/* Output and Bottom navigation */}
      <div
        className="flex shrink-0 flex-col border-t border-white/10 bg-black/40 p-3 sm:p-4"
        style={{ height: outputHeight, minHeight: MIN_OUTPUT_HEIGHT }}
      >
        <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">
          Output
        </div>
  <pre className="min-h-0 w-full flex-1 overflow-auto rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-zinc-300">
          {isRunning
            ? "Running on Rust Playground..."
            : (() => {
                if (!runResult) return "Run to see the result here.";
                const chunks: string[] = [];
                if (runResult.stdout) {
                  chunks.push(`stdout:\n${runResult.stdout}`);
                }
                if (runResult.stderr) {
                  chunks.push(`stderr:\n${runResult.stderr}`);
                }
                if (chunks.length === 0) {
                  chunks.push("(no output)");
                }
                return chunks.join("\n\n");
              })()}
        </pre>

        {runResult && (
          <div
            role="status"
            className={`mt-3 rounded-xl border px-4 py-3 text-sm shadow-[0_6px_30px_rgba(0,0,0,0.25)] sm:text-[13px] transition ${
              runResult.passed === true
                ? "border-emerald-300/60 bg-gradient-to-r from-emerald-500/25 via-emerald-400/20 to-cyan-400/20 text-emerald-50"
                : runResult.passed === false
                ? "border-rose-400/60 bg-gradient-to-r from-rose-500/25 via-rose-400/15 to-amber-400/15 text-rose-50"
                : "border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 via-sky-500/15 to-indigo-500/15 text-cyan-50"
            }`}
          >
            {runResult.passed === true ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-base font-semibold text-white sm:text-lg">
                  <span className="text-xl sm:text-2xl" aria-hidden>🎉</span>
                  <span>Congratulations! Signal decoded perfectly.</span>
                </div>
                <p className="text-xs text-white/90 sm:text-sm">
                  All tests passed and your output matches the expected transmission.
                </p>
              </div>
            ) : runResult.passed === false ? (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-base font-semibold text-white sm:text-lg">
                  <span className="text-xl sm:text-2xl" aria-hidden>⚠️</span>
                  <span>Not quite — the decoded signal differs.</span>
                </div>
                <p className="text-xs text-white/90 sm:text-sm">
                  Compare your stdout against the expected transmission and keep iterating.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-base font-semibold text-white sm:text-lg">
                  <span className="text-xl sm:text-2xl" aria-hidden>ℹ️</span>
                  <span>Execution completed with diagnostics.</span>
                </div>
                <p className="text-xs text-white/90 sm:text-sm">
                  Review the output below for compiler details or runtime messages.
                </p>
              </div>
            )}

            {runResult.expectedStdout && (
              <div className="mt-2 rounded-md bg-black/30 px-2 py-1 text-[11px] text-white/80 sm:text-xs">
                Expected stdout: <code>{runResult.expectedStdout}</code>
              </div>
            )}
            {runResult.message && (
              <div className="mt-2 text-[11px] text-white/80 sm:text-xs">
                {runResult.message}
              </div>
            )}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <Link
            href={
              currentIndex && currentIndex > 1 && track
                ? `/challenges/${track}/${currentIndex - 1}`
                : "#"
            }
            className={`rounded-md border px-3 py-1.5 text-xs transition ${
              currentIndex && currentIndex > 1
                ? "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
                : "pointer-events-none border-white/5 bg-white/[0.03] text-zinc-600"
            }`}
          >
            ← Previous
          </Link>
          <Link
            href={
              currentIndex && totalCount && track && currentIndex < totalCount
                ? `/challenges/${track}/${currentIndex + 1}`
                : "#"
            }
            className={`rounded-md border px-3 py-1.5 text-xs transition ${
              currentIndex && totalCount && track && currentIndex < totalCount
                ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200 hover:border-cyan-400/50 hover:bg-cyan-400/15"
                : "pointer-events-none border-white/5 bg-white/[0.03] text-zinc-600"
            }`}
          >
            Next →
          </Link>
        </div>
      </div>
    </section>
  );
}
