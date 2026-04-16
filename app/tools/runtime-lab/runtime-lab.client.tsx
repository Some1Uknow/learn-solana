"use client";

import Link from "next/link";
import { ArrowRight, RotateCcw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRuntimeLabProgressList } from "@/hooks/use-runtime-lab-progress";
import { runtimeLabPrograms } from "@/lib/runtime-lab/flows";
import { ToolsPageFrame } from "../tools-shell";
import styles from "../tools.module.css";
import { toolsDisplay } from "../tools-theme";

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
  { name: "Runtime Lab", url: "/tools/runtime-lab" },
];

function getProgramStepCount(programId: string) {
  const program = runtimeLabPrograms.find((item) => item.id === programId);
  return program?.flows.reduce((count, flow) => count + flow.steps.length, 0) ?? 0;
}

function getProgramStepIds(programId: string) {
  const program = runtimeLabPrograms.find((item) => item.id === programId);
  return program?.flows.flatMap((flow) => flow.steps.map((step) => step.id)) ?? [];
}

export function RuntimeLabClient() {
  const { authenticated, login } = useAuth();
  const { progressByProgram, deleteProgress } = useRuntimeLabProgressList();

  async function handleClearProgress(programId: string) {
    if (!authenticated) return;

    try {
      await deleteProgress(programId);
    } catch (error) {
      console.error("Failed to clear runtime lab DB progress", error);
    }
  }

  return (
    <ToolsPageFrame
      breadcrumbItems={breadcrumbItems}
      heroKicker="Runtime Lab"
      title="Runtime Lab"
      description="Choose a program. Progress saves to your account."
      compactHero
    >
      <section className={styles.sectionTight}>
        <div className={styles.shell}>
          <div className={styles.minimalProgramGrid}>
            {runtimeLabPrograms.map((program) => {
              const progress = progressByProgram[program.id];
              const stepIds = getProgramStepIds(program.id);
              const totalSteps = stepIds.length || getProgramStepCount(program.id);
              const revealedCount = stepIds.filter((stepId) => progress?.revealedSteps?.[stepId])
                .length;
              const answeredCount = stepIds.filter((stepId) => progress?.selectedAnswers?.[stepId])
                .length;
              const progressPercent = Math.round((revealedCount / Math.max(1, totalSteps)) * 100);
              const hasProgress = Boolean(progress);
              const isComplete = hasProgress && totalSteps > 0 && revealedCount === totalSteps;

              return (
                <article
                  key={program.id}
                  className={styles.minimalProgramCard}
                >
                  <div className={styles.minimalProgramMain}>
                    <div>
                      <div className={styles.minimalProgramMeta}>
                        <span>{program.difficulty}</span>
                        <span>{totalSteps} steps</span>
                        <span>
                          {isComplete
                            ? "Complete"
                            : hasProgress
                              ? `${progressPercent}% done`
                              : "Not started"}
                        </span>
                      </div>
                      <h2 className={`${styles.minimalProgramTitle} ${toolsDisplay.className}`}>
                        {program.name}
                      </h2>
                      <p>{program.focus}</p>
                    </div>
                    {hasProgress ? (
                      <p className={styles.minimalProgramProgress}>
                        {isComplete
                          ? `${answeredCount} answered · all stages checked`
                          : `${answeredCount} answered · resume step ${
                              (progress?.activeStepIndex ?? 0) + 1
                            }`}
                      </p>
                    ) : null}
                  </div>

                  <div className={styles.minimalProgramActions}>
                    {authenticated ? (
                      <Link
                        href={`/tools/runtime-lab/${program.id}`}
                        className={`${styles.primaryButton} ${styles.compactButton}`}
                      >
                        {isComplete ? "Review" : hasProgress ? "Resume" : "Open"}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={() => void login()}
                        className={`${styles.primaryButton} ${styles.compactButton}`}
                      >
                        Sign in
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                    {hasProgress ? (
                      <button
                        type="button"
                        onClick={() => void handleClearProgress(program.id)}
                        className={`${styles.secondaryButton} ${styles.compactIconButton}`}
                        aria-label={`Reset ${program.name} progress`}
                      >
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </ToolsPageFrame>
  );
}

export default RuntimeLabClient;
