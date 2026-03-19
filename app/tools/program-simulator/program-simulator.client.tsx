"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { BlurFade } from "@/components/ui/blur-fade";
import { BreadcrumbSchema } from "@/components/seo";

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
  { name: "Program Simulator", url: "/tools/program-simulator" },
];

const simulationSteps = [
  {
    id: "signer",
    title: "Verify Signer",
    description: "Confirm the payer signed the transaction.",
    constraint: "#[account(signer)]",
    log: "Signer check passed for payer.",
    stateChange: "No state change (auth check).",
    failureReason: "Missing signature from payer. Add a Signer account.",
  },
  {
    id: "pda",
    title: "Derive PDA",
    description: "Derive the PDA used to store program state.",
    constraint: "#[account(seeds = ..., bump)]",
    log: "PDA derived with expected bump.",
    stateChange: "Located program state account.",
    failureReason: "Seeds or bump mismatch. Check PDA seeds.",
  },
  {
    id: "account-write",
    title: "Write Account Data",
    description: "Serialize and store the new state.",
    constraint: "#[account(mut)]",
    log: "Account data updated successfully.",
    stateChange: "State counter incremented to 1.",
    failureReason: "Account is not mutable or has wrong owner.",
  },
  {
    id: "emit",
    title: "Emit Event",
    description: "Publish an event for indexers and clients.",
    constraint: "emit!(...) (no constraint)",
    log: "Event emitted: ProgramUpdated.",
    stateChange: "No on-chain state change.",
    failureReason: "Event serialization failed (rare).",
  },
];

export function ProgramSimulatorClient() {
  const [stepIndex, setStepIndex] = useState(0);
  const [failedStep, setFailedStep] = useState<number | null>(null);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [autoRun, setAutoRun] = useState(false);

  const activeStep = simulationSteps[stepIndex];

  const lastCompletedStep = useMemo(() => {
    if (failedStep !== null) return simulationSteps[failedStep];
    if (stepIndex === 0) return null;
    return simulationSteps[stepIndex - 1];
  }, [failedStep, stepIndex]);

  const completedCount = failedStep !== null ? failedStep : stepIndex;
  const progressPercent = Math.min(
    100,
    Math.round((completedCount / simulationSteps.length) * 100)
  );

  const handleRunStep = useCallback(() => {
    if (failedStep !== null) return;
    if (stepIndex >= simulationSteps.length) return;
    const step = simulationSteps[stepIndex];
    if (simulateFailure && step.failureReason) {
      setFailedStep(stepIndex);
      return;
    }
    setStepIndex((prev) => prev + 1);
  }, [failedStep, simulateFailure, stepIndex]);

  const handleReset = useCallback(() => {
    setStepIndex(0);
    setFailedStep(null);
    setAutoRun(false);
  }, []);

  useEffect(() => {
    if (!autoRun) return;
    if (failedStep !== null || stepIndex >= simulationSteps.length) {
      setAutoRun(false);
      return;
    }
    const timer = setTimeout(() => {
      handleRunStep();
    }, 1200);
    return () => clearTimeout(timer);
  }, [autoRun, failedStep, handleRunStep, stepIndex]);

  return (
    <div className="min-h-screen w-full relative text-white">
      <BreadcrumbSchema items={breadcrumbItems} />
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(circle 500px at 40% 15%, rgba(20, 241, 149, 0.16), transparent),
            radial-gradient(circle 400px at 85% 35%, rgba(56, 189, 248, 0.12), transparent),
            radial-gradient(circle 500px at 20% 80%, rgba(153, 69, 255, 0.08), transparent),
            #000000
          `,
        }}
      />

      <Navbar />

      <div className="pt-28 pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          <BlurFade delay={0.05} inView>
            <nav className="text-sm text-zinc-400 mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#14f195] transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/tools" className="hover:text-[#14f195] transition-colors">
                Tools
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">Program Simulator</span>
            </nav>
          </BlurFade>

          <BlurFade delay={0.1} inView>
            <div className="mb-10">
              <div className="text-xs tracking-[0.25em] text-[#14f195] uppercase font-medium">[NO-CODE RUNNER]</div>
              <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                Program Simulator
              </h1>
              <p className="mt-4 text-lg text-zinc-300 max-w-3xl">
                Step through Anchor instruction execution and see account checks, state updates, and failure reasons.
              </p>
            </div>
          </BlurFade>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <BlurFade delay={0.15} inView>
              <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold text-white">Execution Timeline</h2>
                    <p className="text-xs text-white/60">
                      Watch each constraint check and see what the runtime validates.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-white/60 flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="accent-[#14f195]"
                        checked={simulateFailure}
                        onChange={(event) => setSimulateFailure(event.target.checked)}
                      />
                      Simulate failure
                    </label>
                    <button
                      onClick={() => setAutoRun((prev) => !prev)}
                      className="border border-[#14f195]/40 bg-[#14f195]/10 px-3 py-2 text-xs font-semibold text-[#14f195] transition hover:bg-[#14f195]/20"
                    >
                      {autoRun ? "Pause" : "Auto-run"}
                    </button>
                    <button
                      onClick={handleReset}
                      className="border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>Progress</span>
                    <span>{completedCount}/{simulationSteps.length} steps</span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#14f195] via-[#38bdf8] to-[#14f195] animate-flow"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="mt-3 text-xs text-white/60">
                    {failedStep !== null
                      ? "Resolve the failure and re-run the simulation."
                      : stepIndex >= simulationSteps.length
                      ? "Simulation complete. Export the Anchor code next."
                      : "Run the next step to continue."}
                  </p>
                </div>

                <div className="mt-6 space-y-4">
                  {simulationSteps.map((step, index) => {
                    const isFailed = failedStep === index;
                    const isDone = failedStep === null ? index < stepIndex : index < failedStep;
                    const isActive = failedStep === null && index === stepIndex;
                    return (
                      <div
                        key={step.id}
                        className={`rounded-2xl border px-4 py-4 transition ${
                          isFailed
                            ? "border-rose-500/40 bg-rose-500/10"
                            : isActive
                            ? "border-[#14f195]/50 bg-[#14f195]/10"
                            : "border-white/10 bg-black/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                              Step {index + 1}
                            </div>
                            <div className="text-base font-semibold text-white">{step.title}</div>
                          </div>
                          <span className="text-xs text-white/60">
                            {isFailed ? "Failed" : isDone ? "Complete" : isActive ? "Next" : "Pending"}
                          </span>
                        </div>
                        <p className="mt-2 text-xs text-white/70">{step.description}</p>
                        <div className="mt-3 text-xs text-[#14f195]">{step.constraint}</div>
                        {isFailed && step.failureReason && (
                          <div className="mt-3 text-xs text-rose-200">Why it failed: {step.failureReason}</div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6">
                  <button
                    onClick={handleRunStep}
                    disabled={autoRun || failedStep !== null || stepIndex >= simulationSteps.length}
                    className="rounded-xl border border-[#14f195]/50 bg-[#14f195]/10 px-5 py-3 text-sm font-semibold text-[#14f195] transition hover:bg-[#14f195]/20 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {failedStep !== null
                      ? "Fix failure to continue"
                      : stepIndex >= simulationSteps.length
                      ? "Simulation complete"
                      : autoRun
                      ? "Auto-running..."
                      : "Run next step"}
                  </button>
                </div>
              </section>
            </BlurFade>

            <BlurFade delay={0.2} inView>
              <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-white">Execution Stage</h2>
                  <p className="mt-2 text-xs text-zinc-400">
                    Visualize how the instruction touches signers, PDAs, and state accounts.
                  </p>
                </div>

                <div className="relative rounded-3xl border border-white/10 bg-black/60 px-6 py-8">
                  <div className="absolute left-6 right-6 top-1/2 h-px bg-gradient-to-r from-[#14f195]/20 via-[#38bdf8]/60 to-[#14f195]/20 animate-flow" />
                  <div className="relative grid grid-cols-4 gap-3 text-center">
                    {simulationSteps.map((step, index) => {
                      const isFailed = failedStep === index;
                      const isDone = failedStep === null ? index < stepIndex : index < failedStep;
                      const isActive = failedStep === null && index === stepIndex;
                      return (
                        <div key={step.id} className="flex flex-col items-center gap-3">
                          <div
                            className={`h-12 w-12 rounded-full border flex items-center justify-center text-xs font-semibold ${
                              isFailed
                                ? "border-rose-500/60 bg-rose-500/20 text-rose-200"
                                : isActive
                                ? "border-[#14f195]/70 bg-[#14f195]/20 text-[#14f195] animate-glow"
                                : isDone
                                ? "border-white/40 bg-white/10 text-white"
                                : "border-white/20 bg-black/40 text-white/40"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="text-[10px] uppercase tracking-[0.2em] text-white/60">
                            {step.title}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="absolute -top-3 right-6 rounded-full border border-white/10 bg-black/70 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/50">
                    {failedStep !== null ? "Failure" : stepIndex >= simulationSteps.length ? "Complete" : "Running"}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/50">Latest Log</div>
                    <p className="mt-2 text-sm text-white/80">
                      {lastCompletedStep?.log ?? "Run a step to see logs here."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/50">State Change</div>
                    <p className="mt-2 text-sm text-white/80">
                      {lastCompletedStep?.stateChange ?? "No state change yet."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/50">Next Up</div>
                    <p className="mt-2 text-sm text-white/80">
                      {activeStep ? activeStep.title : "All steps completed."}
                    </p>
                  </div>
                </div>
              </section>
            </BlurFade>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgramSimulatorClient;
