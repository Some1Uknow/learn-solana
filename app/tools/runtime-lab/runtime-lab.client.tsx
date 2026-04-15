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
import { runtimeLabPrograms } from "@/lib/runtime-lab/flows";
import { cn } from "@/lib/utils";
import { ToolsPageFrame } from "../tools-shell";
import styles from "../tools.module.css";
import { toolsDisplay, toolsMono } from "../tools-theme";

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
    <ToolsPageFrame
      breadcrumbItems={breadcrumbItems}
      heroKicker="Runtime Lab"
      title="Learn Solana program flows"
      description="Pick a program, choose a flow, then walk through the runtime checks, state changes, and failure paths that shape how the instruction behaves."
      heroActions={
        <div className={styles.pillRow}>
          <span className={styles.accentPill}>{runtimeLabPrograms.length} programs</span>
          <span className={styles.ghostPill}>Step-by-step predictions</span>
          <span className={styles.ghostPill}>Runtime evidence</span>
        </div>
      }
      heroAside={
        <div className={styles.heroPanel}>
          <div className={`${styles.heroStatLabel} ${toolsMono.className}`}>Active flow</div>
          <div className={`${styles.heroStatValue} ${toolsDisplay.className}`}>{activeProgram.name}</div>
          <div className={styles.heroStatNote}>
            {activeFlow.title} · {activeFlow.duration}. Use this lab to connect narrative flow,
            runtime checks, and actual account changes.
          </div>
        </div>
      }
    >
      <section className={styles.section}>
        <div className={styles.shell}>
          <section className={styles.stack}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionIntro}>
                <div className={`${styles.sectionEyebrow} ${toolsMono.className}`}>Program library</div>
                <h2 className={`${styles.sectionTitle} ${toolsDisplay.className}`}>
                  Pick the program family first
                </h2>
                <p className={styles.sectionBody}>
                  Vault Bootcamp stays first, then the rest of the library expands around it.
                </p>
              </div>
            </div>

            <div className={styles.catalogGridWide}>
              {runtimeLabPrograms.map((program) => {
                const isActive = program.id === activeProgram.id;
                return (
                  <button
                    key={program.id}
                    type="button"
                    onClick={() => handleProgramChange(program.id)}
                    className={styles.surfaceCard}
                    style={{
                      textAlign: "left",
                      borderColor: isActive ? "rgba(169,255,47,0.28)" : undefined,
                      background: isActive
                        ? "linear-gradient(180deg, rgba(169,255,47,0.09), rgba(7,7,7,0.98))"
                        : undefined,
                    }}
                  >
                    <div className={styles.cardHeader}>
                      <div>
                        <div className={`${styles.cardEyebrow} ${toolsMono.className}`}>
                          {program.difficulty}
                        </div>
                        <h3 className={`${styles.cardTitle} ${toolsDisplay.className}`}>{program.name}</h3>
                      </div>
                      <span className={styles.ghostPill}>
                        {program.flows.length} flow{program.flows.length === 1 ? "" : "s"}
                      </span>
                    </div>
                    <p className={styles.cardDescription}>{program.focus}</p>
                    <p className={styles.cardDescription}>{program.description}</p>
                  </button>
                );
              })}
            </div>
          </section>

          <div className={styles.panel} style={{ marginTop: "1rem" }}>
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto_auto_auto] md:items-center">
              <div className={styles.searchShell}>
                <Search className="h-4 w-4 text-white/35" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search steps in this flow..."
                  className={styles.searchInput}
                />
              </div>
              <div className={styles.heroPanel}>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500">Program</p>
                <p className="mt-1 text-sm text-white">{activeProgram.name}</p>
              </div>
              <div className={styles.heroPanel}>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500">Flow</p>
                <p className="mt-1 text-sm text-white">{activeFlow.title}</p>
              </div>
              <div className={styles.heroPanel}>
                <p className="text-[10px] uppercase tracking-widest text-neutral-500">Duration</p>
                <p className="mt-1 text-sm text-white">{activeFlow.duration}</p>
              </div>
            </div>
          </div>

          <div className={`${styles.toolGrid} ${styles.toolGridSidebar}`} style={{ marginTop: "1rem" }}>
            <aside className={styles.stickyAside}>
              <div className={styles.stack}>
                <div className={styles.railCard}>
                  <div className={`${styles.sectionEyebrow} ${toolsMono.className}`}>
                    Flows in {activeProgram.name}
                  </div>
                  <div className={styles.compactStack}>
                    {activeProgram.flows.map((flow) => (
                      <button
                        key={flow.id}
                        type="button"
                        onClick={() => handleFlowChange(flow.id)}
                        className={styles.surfaceCard}
                        style={{
                          textAlign: "left",
                          borderColor: flow.id === activeFlow.id ? "rgba(169,255,47,0.28)" : undefined,
                          background:
                            flow.id === activeFlow.id
                              ? "linear-gradient(180deg, rgba(169,255,47,0.09), rgba(7,7,7,0.98))"
                              : undefined,
                        }}
                      >
                        <div className={styles.cardHeader}>
                          <span className={styles.cardEyebrow}>{flow.difficulty}</span>
                          <span className={styles.metaLabel}>{flow.duration}</span>
                        </div>
                        <h3 className={`${styles.cardTitle} ${toolsDisplay.className}`}>{flow.title}</h3>
                        <p className={styles.cardDescription}>{flow.tagline}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={styles.railCard}>
                  <div className={`${styles.sectionEyebrow} ${toolsMono.className}`}>Step rail</div>
                  <p className={styles.sectionBody}>{filteredSteps.length} visible steps</p>
                  <div className={styles.compactStack}>
                    {filteredSteps.map(({ step, index }) => (
                      <button
                        key={step.id}
                        type="button"
                        onClick={() => handleStepChange(index)}
                        className={styles.surfaceCard}
                        style={{
                          textAlign: "left",
                          borderColor:
                            index === safeActiveStepIndex ? "rgba(169,255,47,0.28)" : undefined,
                          background:
                            index === safeActiveStepIndex
                              ? "linear-gradient(180deg, rgba(169,255,47,0.09), rgba(7,7,7,0.98))"
                              : undefined,
                        }}
                      >
                        <div className={styles.cardHeader}>
                          <span className={styles.metaLabel}>Step {index + 1}</span>
                          <span className={styles.cardEyebrow}>{step.eyebrow}</span>
                        </div>
                        <h4 className={styles.listValue}>{step.title}</h4>
                        <p className={styles.cardDescription}>{step.concept}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            <div className={styles.stack}>
              <section className={styles.panel}>
                <div className={styles.cardHeader}>
                  <div className={styles.sectionIntro}>
                    <div className={`${styles.sectionEyebrow} ${toolsMono.className}`}>{activeStep.eyebrow}</div>
                    <h2 className={`${styles.sectionTitle} ${toolsDisplay.className}`}>{activeStep.title}</h2>
                    <p className={styles.sectionBody}>{activeStep.objective}</p>
                  </div>
                  <div className={styles.ghostPill}>
                    {safeActiveStepIndex + 1}/{activeFlow.steps.length}
                  </div>
                </div>

                <div className={styles.heroPanel}>
                  <div className={`${styles.sectionEyebrow} ${toolsMono.className}`}>Flow memory hook</div>
                  <div className={styles.listValue}>{activeFlow.memoryHook}</div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_260px]">
                  <div>
                    <p className="mb-3 text-xs uppercase tracking-widest text-[#14f195]">Predict first</p>
                    <h3 className="mb-4 text-base font-medium text-white">{activeStep.prompt}</h3>
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
                              "w-full rounded-[24px] border p-4 text-left transition-all",
                              isCorrectChoice
                                ? "border-emerald-400/40 bg-emerald-400/10"
                                : isWrongChoice
                                ? "border-red-400/40 bg-red-400/10"
                                : isChosen
                                ? "border-white/14 bg-white/[0.05]"
                                : "border-white/8 bg-[linear-gradient(180deg,rgba(17,17,17,0.92),rgba(7,7,7,0.98))] hover:border-white/14"
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
                        className={styles.primaryButton}
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
                          "mt-4 rounded-[24px] border p-4",
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

                  <div className={styles.surfaceCard}>
                    <div className={`${styles.cardEyebrow} ${toolsMono.className}`}>Coach note</div>
                    <p className={styles.cardDescription}>{activeStep.coachNote}</p>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => handleStepChange(Math.max(0, safeActiveStepIndex - 1))}
                    disabled={safeActiveStepIndex === 0}
                    className={styles.secondaryButton}
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
                    className={styles.primaryButton}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </section>

              <section className={styles.panel}>
                <div className={styles.cardHeader}>
                  <div className={styles.sectionIntro}>
                    <h3 className={`${styles.sectionTitle} ${toolsDisplay.className}`}>Evidence</h3>
                    <p className={styles.sectionBody}>
                      Runtime proof, account diffs, and failure analysis for this step.
                    </p>
                  </div>
                  <div className={styles.pillRow}>
                    {[
                      { id: "runtime", label: "Runtime" },
                      { id: "accounts", label: "Accounts" },
                      { id: "failures", label: "Failures" },
                    ].map((panel) => (
                      <button
                        key={panel.id}
                        type="button"
                        onClick={() => setActivePanel(panel.id as DetailPanel)}
                        className={activePanel === panel.id ? styles.accentPill : styles.pill}
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
                          <div key={check.label} className={styles.surfaceCard}>
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
                          <div key={`${log.label}-${index}`} className={styles.surfaceCard}>
                            <p className="text-xs uppercase tracking-widest text-neutral-500">
                              {log.label}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-neutral-400">{log.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activePanel === "accounts" && (
                  <div className="space-y-4">
                    {activeStep.accounts.map((account) => (
                      <div key={account.id} className={styles.surfaceCard}>
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
                            <span key={chip} className={styles.ghostPill}>
                              {chip}
                            </span>
                          ))}
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          {account.changes.map((change) => (
                            <div key={change.label} className={styles.heroPanel}>
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
                          className={selectedFailure?.id === failure.id ? styles.accentPill : styles.pill}
                        >
                          {failure.title}
                        </button>
                      ))}
                    </div>

                    {selectedFailure && (
                      <div className={styles.surfaceCard}>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <h4 className="text-base font-medium text-white">{selectedFailure.title}</h4>
                          <span className="text-xs text-red-300">{selectedFailure.error}</span>
                        </div>
                        <p className="mb-4 text-sm leading-6 text-neutral-400">{selectedFailure.why}</p>
                        <div className={styles.heroPanel}>
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

              <section className={styles.panel}>
                <h3 className={`mb-2 ${styles.sectionTitle} ${toolsDisplay.className}`}>
                  Continue after this lab
                </h3>
                <p className={styles.sectionBody}>
                  Once the runtime model clicks, move to Visual Builder to map the same accounts
                  and instructions visually.
                </p>
                <div className={styles.heroActions}>
                  <Link href="/tools/visual-builder" className={styles.primaryButton}>
                    Open Visual Builder
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    </ToolsPageFrame>
  );
}
