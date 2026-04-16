"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  TriangleAlert,
} from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo";
import { Navbar } from "@/components/layout/navbar";
import { useAuth } from "@/hooks/use-auth";
import {
  useRuntimeLabProgramProgress,
  type RuntimeLabProgress,
} from "@/hooks/use-runtime-lab-progress";
import type { RuntimeLabProgram } from "@/lib/runtime-lab/flows";
import { cn } from "@/lib/utils";
import styles from "../../tools.module.css";
import { toolsBody, toolsDisplay, toolsMono } from "../../tools-theme";

export function RuntimeLabProgramClient({ program }: { program: RuntimeLabProgram }) {
  const { authenticated, login, ready } = useAuth();
  const didLoadProgressRef = useRef(false);
  const skipNextSaveRef = useRef(true);
  const saveSequenceRef = useRef(0);
  const activeProgram = program;
  const {
    progress: savedProgress,
    isLoading: isProgressLoading,
    error: progressError,
    saveProgress,
    deleteProgress,
  } = useRuntimeLabProgramProgress(activeProgram.id);
  const [activeFlowId, setActiveFlowId] = useState(program.flows[0]?.id ?? "");
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [revealedSteps, setRevealedSteps] = useState<Record<string, boolean>>({});
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const breadcrumbItems = [
    { name: "Home", url: "/" },
    { name: "Tools", url: "/tools" },
    { name: "Runtime Lab", url: "/tools/runtime-lab" },
    { name: activeProgram.name, url: `/tools/runtime-lab/${activeProgram.id}` },
  ];

  const activeFlow =
    activeProgram.flows.find((flow) => flow.id === activeFlowId) ?? activeProgram.flows[0];
  if (!activeFlow) return null;

  const safeActiveStepIndex = Math.min(
    Math.max(activeStepIndex, 0),
    Math.max(0, activeFlow.steps.length - 1)
  );

  const activeStep = activeFlow.steps[safeActiveStepIndex];
  if (!activeStep) return null;

  const selectedAnswer = selectedAnswers[activeStep.id];
  const isRevealed = revealedSteps[activeStep.id] ?? false;
  const isCorrect = selectedAnswer === activeStep.correctOptionId;

  useEffect(() => {
    if (!ready || !authenticated || isProgressLoading || didLoadProgressRef.current) return;

    if (progressError) {
      setSaveError("Could not load account progress. Try refreshing the page.");
      didLoadProgressRef.current = true;
      return;
    }

    if (!savedProgress) {
      didLoadProgressRef.current = true;
      return;
    }

    const savedFlow = activeProgram.flows.find((flow) => flow.id === savedProgress.flowId);
    const nextStepIndex = Math.min(
      Math.max(savedProgress.activeStepIndex, 0),
      Math.max(0, (savedFlow?.steps.length ?? 1) - 1)
    );

    startTransition(() => {
      setActiveFlowId(savedFlow?.id ?? activeProgram.flows[0]?.id ?? "");
      setActiveStepIndex(nextStepIndex);
      setSelectedAnswers(savedProgress.selectedAnswers ?? {});
      setRevealedSteps(savedProgress.revealedSteps ?? {});
      setLastSavedAt(savedProgress.updatedAt ?? null);
    });
    didLoadProgressRef.current = true;
  }, [
    activeProgram.flows,
    authenticated,
    isProgressLoading,
    progressError,
    ready,
    savedProgress,
  ]);

  useEffect(() => {
    if (!didLoadProgressRef.current || !activeFlow) return;
    if (!authenticated) return;
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false;
      return;
    }

    const progress = {
      version: 1,
      programId: activeProgram.id,
      flowId: activeFlow.id,
      activeStepIndex,
      selectedAnswers,
      revealedSteps,
      updatedAt: new Date().toISOString(),
    } satisfies RuntimeLabProgress;
    const saveId = ++saveSequenceRef.current;

    const timeoutId = window.setTimeout(async () => {
      try {
        const payload = await saveProgress(progress);
        if (saveId === saveSequenceRef.current) {
          setLastSavedAt(payload?.progress?.updatedAt ?? progress.updatedAt);
          setSaveError(null);
        }
      } catch (error) {
        console.error("Failed to save runtime lab DB progress", error);
        if (saveId === saveSequenceRef.current) {
          setSaveError("Could not save to your account. Check your connection and try again.");
        }
      }
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    activeFlow,
    activeProgram.id,
    activeStepIndex,
    authenticated,
    revealedSteps,
    saveProgress,
    selectedAnswers,
  ]);

  async function clearSavedProgress() {
    skipNextSaveRef.current = true;

    try {
      await deleteProgress();
    } catch (error) {
      console.error("Failed to clear runtime lab DB progress", error);
      setSaveError("Could not clear account progress. Local state was reset.");
    }

    startTransition(() => {
      setActiveFlowId(activeProgram.flows[0]?.id ?? "");
      setActiveStepIndex(0);
      setSelectedAnswers({});
      setRevealedSteps({});
      setLastSavedAt(null);
    });
  }

  function handleFlowChange(flowId: string) {
    startTransition(() => {
      setActiveFlowId(flowId);
      setActiveStepIndex(0);
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

  if (!ready || !authenticated) {
    return (
      <div className={`${styles.page} ${toolsBody.className}`}>
        <BreadcrumbSchema items={breadcrumbItems} />
        <Navbar />
        <main className={styles.labAppMain}>
          <section className={styles.labAppHeader}>
            <div className={styles.shell}>
              <div className={styles.labTitleRow}>
                <div>
                  <div className={`${styles.sectionEyebrow} ${toolsMono.className}`}>Runtime Lab</div>
                  <h1 className={`${styles.labAppTitle} ${toolsDisplay.className}`}>
                    Sign in to open this lab
                  </h1>
                  <p className={styles.labAppSubtitle}>
                    {activeProgram.name} stores progress in your account, so the page is gated.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void login()}
                  disabled={!ready}
                  className={`${styles.primaryButton} ${styles.compactButton}`}
                >
                  {ready ? "Sign in to continue" : "Checking session"}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className={`${styles.page} ${toolsBody.className}`}>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Navbar />

      <main className={styles.labAppMain}>
        <section className={styles.labAppHeader}>
          <div className={styles.shell}>
            <div className={styles.labHeaderTop}>
              <div className={`${styles.labCrumbs} ${toolsMono.className}`}>
                <Link href="/tools/runtime-lab">Runtime Lab</Link>
                <span>/</span>
                <span>{activeProgram.name}</span>
              </div>
              <div className={styles.pillRow}>
                <span className={styles.ghostPill}>
                  {lastSavedAt ? "Autosaved" : "Saving after first action"}
                </span>
                <button
                  type="button"
                  onClick={() => void clearSavedProgress()}
                  className={`${styles.secondaryButton} ${styles.compactButton}`}
                >
                  Reset
                </button>
              </div>
            </div>

            <div className={styles.labTitleRow}>
              <div>
                <h1 className={`${styles.labAppTitle} ${toolsDisplay.className}`}>
                  {activeProgram.name}
                </h1>
                <p className={styles.labAppSubtitle}>
                  {activeFlow.title} · Step {safeActiveStepIndex + 1} of {activeFlow.steps.length} ·{" "}
                  {activeFlow.memoryHook}
                </p>
              </div>
              <Link href="/tools/runtime-lab" className={`${styles.secondaryButton} ${styles.compactButton}`}>
                Back to library
              </Link>
            </div>

            {saveError ? <div className={styles.labInlineError}>{saveError}</div> : null}

            <div className={styles.labProgressStrip} aria-label="Runtime lab progress">
              {activeFlow.steps.map((step, index) => {
                const isActive = index === safeActiveStepIndex;
                const isAnswered = Boolean(selectedAnswers[step.id]);
                const isChecked = Boolean(revealedSteps[step.id]);

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleStepChange(index)}
                    className={cn(
                      styles.labProgressSegment,
                      isActive && styles.labProgressSegmentActive,
                      isChecked && styles.labProgressSegmentDone,
                      isAnswered && !isChecked && styles.labProgressSegmentAnswered
                    )}
                  >
                    <span>{index + 1}</span>
                    <span>{step.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className={styles.labAppWorkspaceSection}>
          <div className={styles.shell}>
            <div className={styles.labDebuggerGrid}>
              <section className={styles.labPredictionPanel}>
                {activeProgram.flows.length > 1 ? (
                  <div className={styles.labFlowSwitchRow}>
                    <div className={`${styles.labSidebarLabel} ${toolsMono.className}`}>Flow</div>
                    <div className={styles.labFlowSwitchStack}>
                      {activeProgram.flows.map((flow) => (
                        <button
                          key={flow.id}
                          type="button"
                          onClick={() => handleFlowChange(flow.id)}
                          className={cn(
                            styles.labFlowSwitchButton,
                            flow.id === activeFlow.id && styles.labFlowSwitchButtonActive
                          )}
                        >
                          <span>{flow.title}</span>
                          <span>{flow.duration}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className={styles.labPanelHeader}>
                  <div>
                    <div className={`${styles.sectionEyebrow} ${toolsMono.className}`}>
                      {activeStep.eyebrow}
                    </div>
                    <h2 className={`${styles.labPanelTitle} ${toolsDisplay.className}`}>
                      {activeStep.title}
                    </h2>
                    <p className={styles.labPanelBody}>{activeStep.objective}</p>
                  </div>
                  <span className={styles.ghostPill}>
                    {safeActiveStepIndex + 1}/{activeFlow.steps.length}
                  </span>
                </div>

                <div className={styles.labQuestionBlock}>
                  <div className={`${styles.labSidebarLabel} ${toolsMono.className}`}>
                    Predict first
                  </div>
                  <h3>{activeStep.prompt}</h3>
                  <div className={styles.labOptionStack}>
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
                            styles.labOptionButton,
                            isChosen && styles.labOptionButtonChosen,
                            isCorrectChoice && styles.labOptionButtonCorrect,
                            isWrongChoice && styles.labOptionButtonWrong
                          )}
                        >
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className={styles.labActionRow}>
                  <button
                    type="button"
                    onClick={handleReveal}
                    disabled={!selectedAnswer}
                    className={`${styles.primaryButton} ${styles.compactButton}`}
                  >
                    Check prediction
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStepChange(Math.max(0, safeActiveStepIndex - 1))}
                    disabled={safeActiveStepIndex === 0}
                    className={`${styles.secondaryButton} ${styles.compactButton}`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleStepChange(Math.min(activeFlow.steps.length - 1, safeActiveStepIndex + 1))
                    }
                    disabled={safeActiveStepIndex >= activeFlow.steps.length - 1}
                    className={`${styles.secondaryButton} ${styles.compactButton}`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {isRevealed ? (
                  <div
                    className={cn(
                      styles.labResultCard,
                      isCorrect ? styles.labResultCardCorrect : styles.labResultCardWrong
                    )}
                  >
                    <div>
                      {isCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      ) : (
                        <TriangleAlert className="h-4 w-4 text-red-300" />
                      )}
                      <span>{isCorrect ? "Correct" : "Not quite"}</span>
                    </div>
                    <p>
                      {activeStep.options.find((option) => option.id === selectedAnswer)?.rationale}
                    </p>
                  </div>
                ) : null}

              </section>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default RuntimeLabProgramClient;
