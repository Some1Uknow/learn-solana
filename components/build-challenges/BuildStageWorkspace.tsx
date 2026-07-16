"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronDown,
  CircleAlert,
  FileUp,
  Loader2,
  LockKeyhole,
  RefreshCw,
  TerminalSquare,
  Upload,
} from "lucide-react";

import { LoginRequiredModal } from "@/components/ui/login-required-modal";
import { useAuth } from "@/hooks/use-auth";
import { useLoginGate } from "@/hooks/use-login-gate";
import { authFetch } from "@/lib/auth/authFetch";

type Stage = {
  slug: string;
  order: number;
  title: string;
  promise: string;
  estimatedMinutes: number;
  goal: string;
  contract: string[];
  task: string;
  buildCommand: string;
  commonMistakes: string[];
  publicChecks: Array<{ key: string; label: string }>;
};

type Progress = {
  currentStageSlug: string;
  completedStageCount: number;
  stages: Array<{ slug: string; status: string; attemptCount: number }>;
};

type AttemptResult = {
  checks: Array<{ key: string; label: string; status: "passed" | "failed"; message?: string; hint?: string }>;
  hidden: { passed: number; total: number };
};

type Attempt = {
  id: string;
  status: string;
  summary: string | null;
  result: AttemptResult | null;
  errorCode: string | null;
};

type Phase = "idle" | "uploading" | "verifying" | "running" | "passed" | "failed" | "error";

type Props = {
  challenge: {
    slug: string;
    shortTitle: string;
    starter: { downloadUrl: string; artifactPath: string };
    stages: Stage[];
  };
  stage: Stage;
  submissionsEnabled: boolean;
};

const maxArtifactBytes = 5 * 1024 * 1024;

async function responseError(response: Response, fallback: string) {
  const body = (await response.json().catch(() => null)) as { error?: string } | null;
  return body?.error ?? fallback;
}

function phaseLabel(phase: Phase) {
  if (phase === "uploading") return "Uploading artifact";
  if (phase === "verifying") return "Verifying program";
  if (phase === "running") return "Running tests";
  return null;
}

export function BuildStageWorkspace({ challenge, stage, submissionsEnabled }: Props) {
  const { authenticated, ready } = useAuth();
  const { requireLogin, showModal, setShowModal } = useLoginGate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const refreshProgress = useCallback(async () => {
    if (!ready || !authenticated) {
      setProgress(null);
      setProgressLoaded(true);
      return;
    }
    setProgressLoaded(false);
    const response = await authFetch(`/api/build/progress/${challenge.slug}`);
    if (response.ok) {
      const payload = (await response.json()) as { progress: Progress };
      setProgress(payload.progress);
    }
    setProgressLoaded(true);
  }, [authenticated, challenge.slug, ready]);

  useEffect(() => {
    void refreshProgress();
  }, [refreshProgress]);

  const stageProgress = progress?.stages.find((item) => item.slug === stage.slug);
  const isPassed = stageProgress?.status === "passed" || phase === "passed";
  const isLocked =
    stage.order > 1 &&
    (!authenticated || (progressLoaded && !isPassed && progress?.currentStageSlug !== stage.slug));
  const nextStage = challenge.stages[stage.order];
  const statusLabel = phaseLabel(phase);

  const selectFile = useCallback((candidate: File | null) => {
    setError(null);
    setAttempt(null);
    setPhase("idle");
    if (!candidate) return;
    if (!candidate.name.toLowerCase().endsWith(".so")) {
      setFile(null);
      setError("Choose the compiled .so file from target/deploy.");
      return;
    }
    if (candidate.size === 0 || candidate.size > maxArtifactBytes) {
      setFile(null);
      setError("The program must be between 1 byte and 5 MiB.");
      return;
    }
    setFile(candidate);
  }, []);

  const pollAttempt = useCallback(async (attemptId: string) => {
    for (let poll = 0; poll < 35; poll += 1) {
      await new Promise((resolve) => window.setTimeout(resolve, 1200));
      const response = await authFetch(`/api/build/attempts/${attemptId}`);
      if (!response.ok) throw new Error(await responseError(response, "Could not read your test result."));
      const payload = (await response.json()) as { attempt: Attempt };
      setAttempt(payload.attempt);
      if (payload.attempt.status === "passed") {
        setPhase("passed");
        await refreshProgress();
        return;
      }
      if (payload.attempt.status === "failed") {
        setPhase("failed");
        await refreshProgress();
        return;
      }
      if (payload.attempt.status === "error" || payload.attempt.status === "expired") {
        setPhase("error");
        setError(payload.attempt.summary ?? "The test could not finish. Your file is still ready to retry.");
        return;
      }
    }
    setPhase("error");
    setError("The grader is taking longer than expected. Check again in a moment.");
  }, [refreshProgress]);

  const submit = useCallback(async () => {
    if (!file || isLocked) return;
    if (!submissionsEnabled) {
      setError("Automated testing is being prepared. Keep your compiled file; you can submit it when testing opens.");
      return;
    }
    setError(null);
    setAttempt(null);
    try {
      setPhase("uploading");
      const created = await authFetch("/api/build/attempts", {
        method: "POST",
        body: JSON.stringify({ challengeSlug: challenge.slug, stageSlug: stage.slug }),
      });
      if (!created.ok) throw new Error(await responseError(created, "Could not start a test."));
      const ticket = (await created.json()) as { attemptId: string; runnerUrl: string; uploadToken: string };
      setPhase("verifying");
      const form = new FormData();
      form.append("artifact", file);
      const uploaded = await fetch(`${ticket.runnerUrl}/v1/submissions`, {
        method: "POST",
        headers: { Authorization: `Bearer ${ticket.uploadToken}` },
        body: form,
      });
      if (!uploaded.ok) throw new Error(await responseError(uploaded, "The grader could not accept this program."));
      setPhase("running");
      await pollAttempt(ticket.attemptId);
    } catch (cause) {
      setPhase("error");
      setError(cause instanceof Error ? cause.message : "The test could not start.");
    }
  }, [challenge.slug, file, isLocked, pollAttempt, stage.slug, submissionsEnabled]);

  const recoveryHint = useMemo(() => attempt?.result?.checks.find((check) => check.status === "failed")?.hint, [attempt]);
  const hasActiveRun = phase === "uploading" || phase === "verifying" || phase === "running";

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="px-4 pb-16 pt-28 sm:px-6 sm:pb-20">
        <div className="mx-auto max-w-6xl">
          <header className="border-b border-white/10 pb-6 sm:pb-8">
            <Link href={`/build/${challenge.slug}`} className="text-sm text-zinc-400 transition-colors duration-100 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solana-green">
              {challenge.shortTitle}
            </Link>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-5">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-solana-green">Stage {stage.order} of {challenge.stages.length}</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{stage.title}</h1>
                <p className="mt-2 max-w-2xl text-base leading-7 text-zinc-400">{stage.promise}</p>
              </div>
              <span className="font-mono text-xs tabular-nums text-zinc-500">~{stage.estimatedMinutes} min</span>
            </div>
            <ProgressRail stages={challenge.stages} activeSlug={stage.slug} progress={progress} />
          </header>

          {isLocked ? (
            <section className="py-16 text-center sm:py-24">
              <LockKeyhole className="mx-auto h-5 w-5 text-zinc-500" aria-hidden="true" />
              <h2 className="mt-5 text-xl font-semibold">Finish the previous stage first.</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-400">The vault is cumulative. Each stage gives the next test a dependable foundation.</p>
              <Link href={`/build/${challenge.slug}/${challenge.stages[stage.order - 2]?.slug ?? challenge.stages[0].slug}`} className="mt-6 inline-flex min-h-11 items-center bg-solana-green px-4 text-sm font-semibold text-zinc-950 transition-colors duration-100 hover:bg-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solana-green">
                Return to your next step
              </Link>
            </section>
          ) : (
            <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:py-14">
              <article className="max-w-2xl">
                <Section title="Your goal"><p>{stage.goal}</p></Section>
                <Section title="The contract">
                  <ul className="space-y-3 text-sm leading-6 text-zinc-300">
                    {stage.contract.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-solana-green" />{item}</li>)}
                  </ul>
                </Section>
                <Section title="Build it"><p>{stage.task}</p></Section>
                <div className="mt-8 border-l-2 border-solana-green py-1 pl-4">
                  <p className="text-xs font-medium uppercase tracking-[0.12em] text-zinc-500">Then build</p>
                  <code className="mt-2 block font-mono text-sm text-zinc-100">$ {stage.buildCommand}</code>
                </div>
                <details className="group mt-10 border-y border-white/10 py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-medium text-zinc-300 marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solana-green">
                    Common mistakes <ChevronDown className="h-4 w-4 transition-transform duration-150 group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-zinc-500">
                    {stage.commonMistakes.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </details>
              </article>

              <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="border border-white/10 bg-[#101114] p-4 sm:p-5">
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-zinc-500">Your next move</p>
                  <h2 className="mt-2 text-lg font-semibold">Test your program</h2>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">Upload the one compiled file. We keep the source on your machine.</p>
                  <input ref={inputRef} type="file" accept=".so,application/octet-stream" className="sr-only" onChange={(event) => selectFile(event.target.files?.[0] ?? null)} />
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
                    onDragOver={(event) => event.preventDefault()}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(event) => { event.preventDefault(); setIsDragging(false); selectFile(event.dataTransfer.files?.[0] ?? null); }}
                    className={`mt-5 flex min-h-32 w-full flex-col items-center justify-center border border-dashed px-4 text-center transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solana-green ${isDragging ? "border-solana-green bg-solana-green/10" : "border-white/15 hover:border-white/30"}`}
                  >
                    {file ? <FileUp className="h-5 w-5 text-solana-green" aria-hidden="true" /> : <Upload className="h-5 w-5 text-zinc-400" aria-hidden="true" />}
                    <span className="mt-3 text-sm font-medium text-zinc-200">{file ? file.name : "Drop your .so here"}</span>
                    <span className="mt-1 text-xs text-zinc-500">{file ? `${(file.size / 1024).toFixed(1)} KB · replace file` : "or choose from target/deploy"}</span>
                  </button>
                  <button
                    type="button"
                    disabled={!file || hasActiveRun || isPassed || !submissionsEnabled}
                    onClick={() => requireLogin(() => void submit())}
                    className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-solana-green px-4 text-sm font-semibold text-zinc-950 transition-[background-color,transform] duration-100 hover:bg-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solana-green focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    {hasActiveRun ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <TerminalSquare className="h-4 w-4" aria-hidden="true" />}
                    {statusLabel ?? (isPassed ? "Stage passed" : "Test program")}
                  </button>
                  <p className="mt-3 font-mono text-[11px] leading-5 text-zinc-500">{challenge.starter.artifactPath} · max 5 MiB</p>
                  {!submissionsEnabled ? <p className="mt-3 text-xs leading-5 text-zinc-500">Automated testing is being prepared. Your local build is still the right next step.</p> : null}

                  <ResultPanel phase={phase} attempt={attempt} error={error} recoveryHint={recoveryHint} nextHref={nextStage ? `/build/${challenge.slug}/${nextStage.slug}` : "/modules/anchor-programs"} />
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>
      <LoginRequiredModal open={showModal} onOpenChange={setShowModal} title="Sign in to test your program" description="Your build progress and test result will be saved to this account." />
    </div>
  );
}

function ProgressRail({ stages, activeSlug, progress }: { stages: Stage[]; activeSlug: string; progress: Progress | null }) {
  return (
    <ol className="mt-8 grid grid-cols-5 border-t border-white/10 pt-3" aria-label="Build progress">
      {stages.map((item) => {
        const status = progress?.stages.find((stage) => stage.slug === item.slug)?.status;
        const active = item.slug === activeSlug;
        const complete = status === "passed";
        return (
          <li key={item.slug} className="min-w-0 pr-2 last:pr-0">
            <span className={`block h-1 transition-colors duration-300 ${complete ? "bg-solana-green" : active ? "bg-zinc-300" : "bg-white/10"}`} />
            <span className={`mt-2 block font-mono text-[10px] tabular-nums ${active ? "text-zinc-100" : "text-zinc-600"}`}>{String(item.order).padStart(2, "0")}</span>
          </li>
        );
      })}
    </ol>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="border-b border-white/10 py-8 first:pt-0"><h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">{title}</h2><div className="mt-4 text-base leading-7 text-zinc-300">{children}</div></section>;
}

function ResultPanel({ phase, attempt, error, recoveryHint, nextHref }: { phase: Phase; attempt: Attempt | null; error: string | null; recoveryHint?: string; nextHref: string }) {
  if (phase === "idle") return null;
  if (phase === "uploading" || phase === "verifying" || phase === "running") return <div className="mt-5 border-t border-white/10 pt-4" role="status" aria-live="polite"><p className="text-sm text-zinc-300">{phaseLabel(phase)}…</p><div className="mt-3 h-px overflow-hidden bg-white/10"><div className="h-full w-2/3 animate-[pulse_1.2s_ease-in-out_infinite] bg-solana-green motion-reduce:animate-none" /></div></div>;
  if (phase === "passed") return <div className="mt-5 border-t border-white/10 pt-4" role="status" aria-live="polite"><div className="flex items-center gap-2 text-solana-green"><Check className="h-4 w-4" aria-hidden="true" /><p className="text-sm font-medium">Stage passed.</p></div><p className="mt-2 text-sm leading-6 text-zinc-400">Your vault is ready for the next constraint.</p><Link href={nextHref} className="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-zinc-100 underline decoration-solana-green underline-offset-4 hover:text-solana-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solana-green">{nextHref === "/modules/anchor-programs" ? "Continue learning" : "Continue to next stage"}</Link></div>;
  return <div className="mt-5 border-t border-white/10 pt-4" role="status" aria-live="polite"><div className="flex gap-2 text-red-200"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /><div><p className="text-sm font-medium">{error ?? attempt?.summary ?? "Not there yet."}</p>{attempt?.result ? <div className="mt-3 space-y-2 text-xs leading-5 text-zinc-400">{attempt.result.checks.map((check) => <p key={check.key} className={check.status === "passed" ? "text-zinc-400" : "text-zinc-200"}>{check.status === "passed" ? "✓" : "×"} {check.label}{check.message ? ` — ${check.message}` : ""}</p>)}<p>{attempt.result.hidden.passed} of {attempt.result.hidden.total} security checks passed.</p></div> : null}{recoveryHint ? <div className="mt-4 border-l-2 border-solana-green pl-3 text-sm leading-6 text-zinc-300"><span className="font-medium text-solana-green">Hint: </span>{recoveryHint}</div> : null}</div></div><p className="mt-4 flex items-center gap-2 text-xs text-zinc-500"><RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Your file is still selected—build again and retest.</p></div>;
}
