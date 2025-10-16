"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

export default function ChallengeEditorClient({
  starterCode,
  track,
  currentIndex,
  totalCount,
}: {
  starterCode?: string;
  track?: string;
  currentIndex?: number;
  totalCount?: number;
}) {
  const [code, setCode] = useState(starterCode || "// Write your Rust solution here\nfn main() {\n    println!(\"Hello, Rustacean!\");\n}\n");
  const [output, setOutput] = useState<string>("");

  useEffect(() => {
    setCode(starterCode || "");
    setOutput("");
  }, [starterCode]);

  const lineCount = useMemo(() => (code ? code.split("\n").length : 1), [code]);
  const lines = useMemo(() => Array.from({ length: lineCount }, (_, i) => i + 1), [lineCount]);

  const gutterRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const syncScroll = () => {
    if (!gutterRef.current || !textareaRef.current) return;
    gutterRef.current.scrollTop = textareaRef.current.scrollTop;
  };

  const handleRun = () => {
    setOutput(
      [
        "Client-only preview",
        "— execution coming soon.",
        "",
        "Next: WASM rustc or sandbox, hidden tests, diagnostics",
      ].join("\n")
    );
  };
  const handleReset = () => setCode(starterCode || "");
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
    <section className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="relative min-h-0 flex flex-1 flex-col overflow-hidden">
        {/* Editor header (mobile) */}
  <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-black/40 px-4 py-2 sm:hidden">
          <div className="text-xs text-zinc-400">Language: Rust</div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-zinc-300">Copy</button>
            <button onClick={handleReset} className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-zinc-300">Reset</button>
            <button onClick={handleRun} className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-[11px] font-semibold text-emerald-200">Run</button>
          </div>
        </div>

        {/* Editor header (desktop) */}
        <div className="hidden shrink-0 items-center justify-between border-b border-white/10 bg-black/40 px-5 py-3 sm:flex">
          <div className="flex items-center gap-3 text-sm text-zinc-300">
            <span className="rounded-md border border-white/10 bg-white/[0.06] px-2 py-0.5 text-xs uppercase tracking-[0.2em] text-zinc-400">Language</span>
            <span className="font-medium text-white">Rust</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleCopy} className={desktopButtonClasses}>Copy</button>
            <button onClick={handleReset} className={desktopButtonClasses}>Reset</button>
            <button onClick={handleRun} className={primaryButtonClasses}>Run Code</button>
          </div>
        </div>

        {/* Simple editor */}
  <div className="grid h-full min-h-0 flex-1 grid-cols-[48px_1fr] overflow-hidden">
          <div
            ref={gutterRef}
            className="select-none border-r border-white/10 bg-black/40 px-2 py-3 text-right text-[11px] leading-5 text-zinc-600"
          >
            {lines.map((n) => (
              <div key={n} className="tabular-nums">{n}</div>
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
            className="h-full min-h-0 w-full resize-none overflow-auto bg-transparent p-3 font-mono text-[12.5px] leading-5 text-zinc-100 outline-none [caret-color:#22d3ee]"
          />
        </div>
      </div>

      {/* Output and Bottom navigation */}
      <div className="border-t border-white/10 bg-black/40 p-3 sm:p-4">
        <div className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-zinc-400">Output</div>
        <pre className="max-h-40 overflow-auto rounded-lg border border-white/10 bg-white/[0.03] p-3 text-xs text-zinc-300">{output || "Run to see the result here."}</pre>

        <div className="mt-3 flex items-center justify-between">
          <Link
            href={currentIndex && currentIndex > 1 && track ? `/challenges/${track}/${currentIndex - 1}` : "#"}
            className={`rounded-md border px-3 py-1.5 text-xs transition ${
              currentIndex && currentIndex > 1
                ? "border-white/10 bg-white/5 text-zinc-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
                : "pointer-events-none border-white/5 bg-white/[0.03] text-zinc-600"
            }`}
          >
            ← Previous
          </Link>
          <Link
            href={currentIndex && totalCount && track && currentIndex < totalCount ? `/challenges/${track}/${currentIndex + 1}` : "#"}
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
