"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
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
    <div className="min-h-screen w-full bg-black text-white">
      <BreadcrumbSchema items={breadcrumbItems} />
      <Navbar />

      <div className="pt-28 pb-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-400 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2 text-neutral-600">/</span>
            <Link href="/tools" className="hover:text-white transition-colors">
              Tools
            </Link>
            <span className="mx-2 text-neutral-600">/</span>
            <span className="text-white">Program Simulator</span>
          </nav>

          {/* Header */}
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-[#14f195] mb-3">
              No-Code Runner
            </p>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
              Program Simulator
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl">
              Step through Anchor instruction execution and see account checks, state updates, and failure reasons.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            {/* Timeline Section */}
            <section className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="font-medium text-white">Execution Timeline</h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    Watch each constraint check and see what the runtime validates.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-neutral-400 flex items-center gap-2 cursor-pointer">
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
                    className="border border-[#14f195]/40 bg-[#14f195]/10 px-3 py-1.5 text-sm font-medium text-[#14f195] rounded transition hover:bg-[#14f195]/20"
                  >
                    {autoRun ? "Pause" : "Auto-run"}
                  </button>
                  <button
                    onClick={handleReset}
                    className="border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-sm font-medium text-white rounded transition hover:bg-neutral-700"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 mb-6">
                <div className="flex items-center justify-between text-sm text-neutral-400 mb-2">
                  <span>Progress</span>
                  <span>{completedCount}/{simulationSteps.length} steps</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-[#14f195] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="mt-2 text-sm text-neutral-500">
                  {failedStep !== null
                    ? "Resolve the failure and re-run the simulation."
                    : stepIndex >= simulationSteps.length
                    ? "Simulation complete."
                    : "Run the next step to continue."}
                </p>
              </div>

              {/* Steps */}
              <div className="space-y-3">
                {simulationSteps.map((step, index) => {
                  const isFailed = failedStep === index;
                  const isDone = failedStep === null ? index < stepIndex : index < failedStep;
                  const isActive = failedStep === null && index === stepIndex;
                  return (
                    <div
                      key={step.id}
                      className={`rounded-lg border p-4 transition ${
                        isFailed
                          ? "border-red-500/40 bg-red-500/10"
                          : isActive
                          ? "border-[#14f195]/50 bg-[#14f195]/5"
                          : isDone
                          ? "border-neutral-700 bg-neutral-800/50"
                          : "border-neutral-800 bg-neutral-900/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="text-xs text-neutral-500">Step {index + 1}</span>
                          <h3 className="font-medium text-white">{step.title}</h3>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          isFailed ? "bg-red-500/20 text-red-400" :
                          isDone ? "bg-neutral-700 text-neutral-300" :
                          isActive ? "bg-[#14f195]/20 text-[#14f195]" :
                          "bg-neutral-800 text-neutral-500"
                        }`}>
                          {isFailed ? "Failed" : isDone ? "Complete" : isActive ? "Next" : "Pending"}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-500 mb-2">{step.description}</p>
                      <code className="text-xs text-[#14f195]">{step.constraint}</code>
                      {isFailed && step.failureReason && (
                        <p className="mt-2 text-sm text-red-400">Why it failed: {step.failureReason}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleRunStep}
                disabled={autoRun || failedStep !== null || stepIndex >= simulationSteps.length}
                className="mt-6 w-full rounded-lg border border-[#14f195]/50 bg-[#14f195]/10 px-4 py-3 text-sm font-medium text-[#14f195] transition hover:bg-[#14f195]/20 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {failedStep !== null
                  ? "Fix failure to continue"
                  : stepIndex >= simulationSteps.length
                  ? "Simulation complete"
                  : autoRun
                  ? "Auto-running..."
                  : "Run next step"}
              </button>
            </section>

            {/* Details Section */}
            <section className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-6 space-y-4">
              <div>
                <h2 className="font-medium text-white">Execution Stage</h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Visualize how the instruction touches signers, PDAs, and state accounts.
                </p>
              </div>

              {/* Visual Steps */}
              <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-6">
                <div className="grid grid-cols-4 gap-3 text-center">
                  {simulationSteps.map((step, index) => {
                    const isFailed = failedStep === index;
                    const isDone = failedStep === null ? index < stepIndex : index < failedStep;
                    const isActive = failedStep === null && index === stepIndex;
                    return (
                      <div key={step.id} className="flex flex-col items-center gap-2">
                        <div
                          className={`h-10 w-10 rounded-full border flex items-center justify-center text-sm font-medium ${
                            isFailed
                              ? "border-red-500/60 bg-red-500/20 text-red-400"
                              : isActive
                              ? "border-[#14f195]/70 bg-[#14f195]/20 text-[#14f195]"
                              : isDone
                              ? "border-neutral-600 bg-neutral-700 text-white"
                              : "border-neutral-700 bg-neutral-800 text-neutral-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <span className="text-xs text-neutral-500">{step.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Info Cards */}
              <div className="space-y-3">
                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Latest Log</span>
                  <p className="mt-1 text-sm text-white">
                    {lastCompletedStep?.log ?? "Run a step to see logs here."}
                  </p>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">State Change</span>
                  <p className="mt-1 text-sm text-white">
                    {lastCompletedStep?.stateChange ?? "No state change yet."}
                  </p>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Next Up</span>
                  <p className="mt-1 text-sm text-white">
                    {activeStep ? activeStep.title : "All steps completed."}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProgramSimulatorClient;
