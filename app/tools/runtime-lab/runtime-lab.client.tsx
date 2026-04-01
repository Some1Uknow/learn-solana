"use client";

import { startTransition, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  TriangleAlert,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BreadcrumbSchema } from "@/components/seo";
import { runtimeLabPrograms } from "@/lib/runtime-lab/flows";
import { cn } from "@/lib/utils";

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
  { name: "Runtime Lab", url: "/tools/runtime-lab" },
];

const statusTone = {
  pass: "text-emerald-300 border-emerald-300/30 bg-emerald-300/10",
  warn: "text-amber-300 border-amber-300/30 bg-amber-300/10",
  fail: "text-red-300 border-red-300/30 bg-red-300/10",
};

type DetailPanel = "runtime" | "accounts" | "failures";

export default function RuntimeLabClient() {
  const [activeProgramId, setActiveProgramId] = useState(runtimeLabPrograms[0]?.id ?? "");
  const [activeFlowId, setActiveFlowId] = useState(
    runtimeLabPrograms[0]?.flows[0]?.id ?? ""
  );
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedSteps, setRevealedSteps] = useState<Record<string, boolean>>({});
  const [selectedFailures, setSelectedFailures] = useState<Record<string, string>>({});
  const [activePanel, setActivePanel] = useState<DetailPanel>("runtime");

  const activeProgram =
    runtimeLabPrograms.find((program) => program.id === activeProgramId) ??
    runtimeLabPrograms[0];
  if (!activeProgram) return null;

  const activeFlow =
    activeProgram.flows.find((flow) => flow.id === activeFlowId) ??
    activeProgram.flows[0];
  if (!activeFlow) return null;

  const filteredSteps = useMemo(() => {
    const q = query.toLowerCase().trim();
    return activeFlow.steps
      .map((step, index) => ({ step, index }))
      .filter(({ step }) =>
        q
          ? step.title.toLowerCase().includes(q) ||
            step.concept.toLowerCase().includes(q) ||
            step.objective.toLowerCase().includes(q)
          : true
      );
  }, [activeFlow.steps, query]);

  const safeActiveStepIndex = filteredSteps.some(({ index }) => index === activeStepIndex)
    ? activeStepIndex
    : filteredSteps[0]?.index ?? 0;

  const activeStep = activeFlow.steps[safeActiveStepIndex];
  if (!activeStep) return null;

  const selectedAnswer = selectedAnswers[activeStep.id];
  const isRevealed = revealedSteps[activeStep.id] ?? false;
  const isCorrect = selectedAnswer === activeStep.correctOptionId;
  const selectedFailureId =
    selectedFailures[activeStep.id] ?? activeStep.failures[0]?.id ?? "";
  const selectedFailure =
    activeStep.failures.find((failure) => failure.id === selectedFailureId) ??
    activeStep.failures[0];

  function handleProgramChange(programId: string) {
    const nextProgram = runtimeLabPrograms.find((program) => program.id === programId);
    if (!nextProgram) return;
    startTransition(() => {
      setActiveProgramId(programId);
      setActiveFlowId(nextProgram.flows[0]?.id ?? "");
      setActiveStepIndex(0);
      setQuery("");
      setActivePanel("runtime");
    });
  }

  function handleFlowChange(flowId: string) {
    startTransition(() => {
      setActiveFlowId(flowId);
      setActiveStepIndex(0);
      setQuery("");
      setActivePanel("runtime");
    });
  }

  function handleStepChange(nextIndex: number) {
    startTransition(() => {
      setActiveStepIndex(nextIndex);
    });
  }

  function handleAnswerSelect(optionId: string) {
    setSelectedAnswers((current) => ({
      ...current,
      [activeStep.id]: optionId,
    }));
    setRevealedSteps((current) => ({
      ...current,
      [activeStep.id]: false,
    }));
  }

  function handleReveal() {
    if (!selectedAnswer) return;
    setRevealedSteps((current) => ({
      ...current,
      [activeStep.id]: true,
    }));
  }

  function handleFailureChange(failureId: string) {
    setSelectedFailures((current) => ({
      ...current,
      [activeStep.id]: failureId,
    }));
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <BreadcrumbSchema items={breadcrumbItems} />
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <nav className="mb-8 text-sm text-neutral-500">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/tools" className="transition-colors hover:text-white">
              Tools
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Runtime Lab</span>
          </nav>

          <div className="mb-8">
            <p className="mb-3 text-xs uppercase tracking-widest text-[#14f195]">
              Runtime Lab
            </p>
            <h1 className="mb-4 text-4xl font-medium tracking-tight md:text-5xl">
              Learn Solana program flows
            </h1>
            <p className="max-w-3xl text-lg text-neutral-400">
              Pick a program, choose a flow, then walk through the runtime checks,
              state changes, and failures that shape how Solana programs behave.
            </p>
          </div>

          <section className="mb-8">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-medium text-white">Programs</h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Vault Bootcamp stays first. The rest build out the library around it.
                </p>
              </div>
              <div className="text-sm text-neutral-500">
                {runtimeLabPrograms.length} programs
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {runtimeLabPrograms.map((program) => {
                const isActive = program.id === activeProgram.id;
                return (
                  <button
                    key={program.id}
                    type="button"
                    onClick={() => handleProgramChange(program.id)}
                    className={cn(
                      "rounded-lg border p-5 text-left transition-all",
                      isActive
                        ? "border-neutral-700 bg-neutral-900/60"
                        : "border-neutral-800 bg-neutral-900/30 hover:border-neutral-700 hover:bg-neutral-900/50"
                    )}
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-xs uppercase tracking-widest text-[#14f195]">
                        {program.difficulty}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {program.flows.length} flow{program.flows.length === 1 ? "" : "s"}
                      </span>
                    </div>
                    <h3 className="text-base font-medium text-white">{program.name}</h3>
                    <p className="mt-2 text-sm text-neutral-500">{program.focus}</p>
                    <p className="mt-3 text-sm text-neutral-400">{program.description}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="mb-8 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_auto_auto] md:items-center">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search steps in this flow..."
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-neutral-700 focus:bg-neutral-900"
              />
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/30 px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">Program</p>
              <p className="mt-1 text-sm text-white">{activeProgram.name}</p>
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/30 px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">Flow</p>
              <p className="mt-1 text-sm text-white">{activeFlow.title}</p>
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-900/30 px-4 py-3">
              <p className="text-[10px] uppercase tracking-widest text-neutral-500">Duration</p>
              <p className="mt-1 text-sm text-white">{activeFlow.duration}</p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
              <div className="flex h-full flex-col gap-4">
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/30">
                  <div className="border-b border-neutral-800 px-5 py-4">
                    <p className="text-xs uppercase tracking-widest text-neutral-500">
                      Flows in {activeProgram.name}
                    </p>
                  </div>
                  <div className="space-y-3 p-4">
                    {activeProgram.flows.map((flow) => (
                      <button
                        key={flow.id}
                        type="button"
                        onClick={() => handleFlowChange(flow.id)}
                        className={cn(
                          "w-full rounded-lg border p-4 text-left transition-all",
                          flow.id === activeFlow.id
                            ? "border-neutral-700 bg-neutral-900/70"
                            : "border-neutral-800 bg-neutral-950/70 hover:border-neutral-700 hover:bg-neutral-900"
                        )}
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-xs uppercase tracking-widest text-[#14f195]">
                            {flow.difficulty}
                          </span>
                          <span className="text-xs text-neutral-500">{flow.duration}</span>
                        </div>
                        <h3 className="text-sm font-medium text-white">{flow.title}</h3>
                        <p className="mt-2 text-xs leading-5 text-neutral-500">
                          {flow.tagline}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 flex-col rounded-lg border border-neutral-800 bg-neutral-900/30">
                  <div className="border-b border-neutral-800 px-5 py-4">
                    <p className="text-xs uppercase tracking-widest text-neutral-500">
                      Step rail
                    </p>
                    <p className="mt-2 text-sm text-neutral-400">
                      {filteredSteps.length} visible steps
                    </p>
                  </div>
                  <div className="space-y-3 overflow-y-auto p-4">
                    {filteredSteps.map(({ step, index }) => (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => handleStepChange(index)}
                        className={cn(
                          "w-full rounded-lg border p-4 text-left transition-all",
                          index === safeActiveStepIndex
                            ? "border-neutral-700 bg-neutral-900/70"
                            : "border-neutral-800 bg-neutral-950/70 hover:border-neutral-700 hover:bg-neutral-900"
                        )}
                      >
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <span className="text-xs text-neutral-500">Step {index + 1}</span>
                          <span className="text-xs text-[#14f195]">{step.eyebrow}</span>
                        </div>
                        <h4 className="text-sm font-medium text-white">{step.title}</h4>
                        <p className="mt-2 text-xs leading-5 text-neutral-500">{step.concept}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className="space-y-6">
              <section className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-6">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-widest text-[#14f195]">
                      {activeStep.eyebrow}
                    </p>
                    <h2 className="mt-2 text-2xl font-medium text-white">
                      {activeStep.title}
                    </h2>
                    <p className="mt-2 text-sm text-neutral-400">{activeStep.objective}</p>
                  </div>
                  <div className="shrink-0 rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-400">
                    {safeActiveStepIndex + 1}/{activeFlow.steps.length}
                  </div>
                </div>

                <div className="mb-5 rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <p className="text-xs uppercase tracking-widest text-neutral-500">
                    Flow memory hook
                  </p>
                  <p className="mt-2 text-sm text-neutral-300">{activeFlow.memoryHook}</p>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
                  <div>
                    <p className="mb-3 text-xs uppercase tracking-widest text-[#14f195]">
                      Predict first
                    </p>
                    <h3 className="mb-4 text-base font-medium text-white">
                      {activeStep.prompt}
                    </h3>
                    <div className="space-y-3">
                      {activeStep.options.map((option) => {
                        const isChosen = selectedAnswer === option.id;
                        const isCorrectChoice =
                          isRevealed && option.id === activeStep.correctOptionId;
                        const isWrongChoice =
                          isRevealed && isChosen && option.id !== activeStep.correctOptionId;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => handleAnswerSelect(option.id)}
                            className={cn(
                              "w-full rounded-lg border p-4 text-left transition-all",
                              isCorrectChoice
                                ? "border-emerald-400/40 bg-emerald-400/10"
                                : isWrongChoice
                                ? "border-red-400/40 bg-red-400/10"
                                : isChosen
                                ? "border-neutral-700 bg-neutral-900/60"
                                : "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                            )}
                          >
                            <p className="text-sm leading-6 text-neutral-200">{option.label}</p>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleReveal}
                        disabled={!selectedAnswer}
                        className="rounded-lg border border-[#14f195]/40 bg-[#14f195]/10 px-4 py-2 text-sm font-medium text-[#14f195] transition hover:bg-[#14f195]/20 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Check prediction
                      </button>
                      <p className="text-sm text-neutral-500">
                        Pick an answer before revealing the explanation.
                      </p>
                    </div>

                    {isRevealed && (
                      <div
                        className={cn(
                          "mt-4 rounded-lg border p-4",
                          isCorrect
                            ? "border-emerald-400/30 bg-emerald-400/10"
                            : "border-red-400/30 bg-red-400/10"
                        )}
                      >
                        <div className="flex items-center gap-2 text-sm font-medium text-white">
                          {isCorrect ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                          ) : (
                            <TriangleAlert className="h-4 w-4 text-red-300" />
                          )}
                          {isCorrect ? "Correct" : "Not quite"}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-neutral-300">
                          {
                            activeStep.options.find((option) => option.id === selectedAnswer)
                              ?.rationale
                          }
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                    <p className="text-xs uppercase tracking-widest text-neutral-500">
                      Coach note
                    </p>
                    <p className="mt-2 text-sm leading-6 text-neutral-300">
                      {activeStep.coachNote}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleStepChange(Math.max(0, safeActiveStepIndex - 1))}
                    disabled={safeActiveStepIndex === 0}
                    className="inline-flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleStepChange(
                        Math.min(activeFlow.steps.length - 1, safeActiveStepIndex + 1)
                      )
                    }
                    disabled={safeActiveStepIndex >= activeFlow.steps.length - 1}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#14f195]/40 bg-[#14f195]/10 px-4 py-2 text-sm font-medium text-[#14f195] transition hover:bg-[#14f195]/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </section>

              <section className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-6">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-medium text-white">Evidence</h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      Runtime proof, account diffs, and failure analysis for this step.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: "runtime", label: "Runtime" },
                      { id: "accounts", label: "Accounts" },
                      { id: "failures", label: "Failures" },
                    ].map((panel) => (
                      <button
                        key={panel.id}
                        type="button"
                        onClick={() => setActivePanel(panel.id as DetailPanel)}
                        className={cn(
                          "rounded-full border px-3 py-1.5 text-xs font-medium uppercase tracking-wider transition",
                          activePanel === panel.id
                            ? "border-[#14f195]/30 bg-[#14f195]/10 text-[#14f195]"
                            : "border-neutral-800 bg-neutral-950 text-neutral-500 hover:border-neutral-700"
                        )}
                      >
                        {panel.label}
                      </button>
                    ))}
                  </div>
                </div>

                {activePanel === "runtime" && (
                  <div className="grid gap-6 xl:grid-cols-2">
                    <div>
                      <h4 className="mb-4 text-base font-medium text-white">Runtime checks</h4>
                      <div className="space-y-3">
                        {activeStep.checks.map((check) => (
                          <div
                            key={check.label}
                            className="rounded-lg border border-neutral-800 bg-neutral-950 p-4"
                          >
                            <div className="mb-2 flex items-center justify-between gap-3">
                              <p className="text-sm font-medium text-white">{check.label}</p>
                              <span
                                className={cn(
                                  "rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
                                  statusTone[check.status]
                                )}
                              >
                                {check.status}
                              </span>
                            </div>
                            <p className="text-sm leading-6 text-neutral-400">{check.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-4 text-base font-medium text-white">Runtime timeline</h4>
                      <div className="space-y-3">
                        {activeStep.logs.map((log, index) => (
                          <div
                            key={`${log.label}-${index}`}
                            className="rounded-lg border border-neutral-800 bg-neutral-950 p-4"
                          >
                            <p className="text-xs uppercase tracking-widest text-neutral-500">
                              {log.label}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-neutral-400">
                              {log.detail}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activePanel === "accounts" && (
                  <div className="space-y-4">
                    {activeStep.accounts.map((account) => (
                      <div
                        key={account.id}
                        className="rounded-lg border border-neutral-800 bg-neutral-950 p-4"
                      >
                        <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h4 className="text-base font-medium text-white">{account.name}</h4>
                            <p className="mt-1 text-sm text-neutral-500">{account.summary}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-mono text-xs text-[#14f195]">{account.address}</p>
                            <p className="mt-1 text-xs text-neutral-500">{account.owner}</p>
                          </div>
                        </div>

                        <div className="mb-3 flex flex-wrap gap-2">
                          {account.chips.map((chip) => (
                            <span
                              key={chip}
                              className="rounded-full border border-neutral-800 bg-neutral-900 px-2 py-1 text-[10px] uppercase tracking-wider text-neutral-500"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          {account.changes.map((change) => (
                            <div
                              key={change.label}
                              className="rounded-lg border border-neutral-800 bg-neutral-900 p-3"
                            >
                              <p className="text-xs uppercase tracking-widest text-neutral-500">
                                {change.label}
                              </p>
                              <div className="mt-2 flex items-center gap-2 text-sm">
                                <span className="text-neutral-500">{change.before}</span>
                                <ArrowRight className="h-3.5 w-3.5 text-neutral-600" />
                                <span className="text-white">{change.after}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activePanel === "failures" && (
                  <div className="grid gap-6 xl:grid-cols-[220px_minmax(0,1fr)]">
                    <div className="flex flex-wrap gap-2 xl:flex-col">
                      {activeStep.failures.map((failure) => (
                        <button
                          key={failure.id}
                          type="button"
                          onClick={() => handleFailureChange(failure.id)}
                          className={cn(
                            "rounded-lg border px-3 py-3 text-left text-xs font-medium uppercase tracking-wider transition",
                            selectedFailure?.id === failure.id
                              ? "border-[#14f195]/30 bg-[#14f195]/10 text-[#14f195]"
                              : "border-neutral-800 bg-neutral-950 text-neutral-500 hover:border-neutral-700"
                          )}
                        >
                          {failure.title}
                        </button>
                      ))}
                    </div>

                    {selectedFailure && (
                      <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <h4 className="text-base font-medium text-white">
                            {selectedFailure.title}
                          </h4>
                          <span className="text-xs text-red-300">
                            {selectedFailure.error}
                          </span>
                        </div>
                        <p className="mb-4 text-sm leading-6 text-neutral-400">
                          {selectedFailure.why}
                        </p>
                        <div className="rounded-lg border border-neutral-800 bg-neutral-900 p-3">
                          <p className="text-xs uppercase tracking-widest text-neutral-500">
                            First fix to try
                          </p>
                          <p className="mt-2 text-sm leading-6 text-neutral-300">
                            {selectedFailure.fix}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>

              <section className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-6">
                <h3 className="mb-2 text-lg font-medium text-white">
                  Continue after this lab
                </h3>
                <p className="mb-4 text-sm text-neutral-500">
                  Once the runtime model clicks, move to Visual Builder to map the same accounts and instructions visually.
                </p>
                <Link
                  href="/tools/visual-builder"
                  className="inline-flex items-center text-sm text-[#14f195]"
                >
                  <span>Open Visual Builder</span>
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
