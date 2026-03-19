"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { BlurFade } from "@/components/ui/blur-fade";
import { BreadcrumbSchema } from "@/components/seo";

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
  { name: "Transaction Visualizer", url: "/tools/transaction-visualizer" },
];

const baseInstructions = [
  { id: "ix-1", name: "Initialize Vault", compute: 8000, signer: true },
  { id: "ix-2", name: "Create Token Account", compute: 12000, signer: true },
  { id: "ix-3", name: "Mint Tokens", compute: 15000, signer: true },
  { id: "ix-4", name: "Emit Event", compute: 2000, signer: false },
];

export function TransactionVisualizerClient() {
  const [instructions, setInstructions] = useState(baseInstructions);
  const [simulateFailure, setSimulateFailure] = useState(false);

  const computeTotal = useMemo(
    () => instructions.reduce((total, ix) => total + ix.compute, 0),
    [instructions]
  );
  const signerCount = useMemo(
    () => instructions.filter((ix) => ix.signer).length,
    [instructions]
  );
  const failureIndex = simulateFailure ? 1 : null;

  const handleMove = (index: number, direction: "up" | "down") => {
    const next = [...instructions];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setInstructions(next);
  };

  const failureMessage = simulateFailure
    ? "If instruction #2 fails, all prior changes are rolled back because transactions are atomic."
    : "Transactions execute in order. If any instruction fails, nothing is committed.";

  return (
    <div className="min-h-screen w-full relative text-white">
      <BreadcrumbSchema items={breadcrumbItems} />
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(circle 500px at 40% 10%, rgba(56, 189, 248, 0.14), transparent),
            radial-gradient(circle 500px at 85% 30%, rgba(20, 241, 149, 0.12), transparent),
            radial-gradient(circle 400px at 15% 80%, rgba(153, 69, 255, 0.08), transparent),
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
              <span className="text-white">Transaction Visualizer</span>
            </nav>
          </BlurFade>

          <BlurFade delay={0.1} inView>
            <div className="mb-10">
              <div className="text-xs tracking-[0.25em] text-[#14f195] uppercase font-medium">[TRANSACTION FLOW]</div>
              <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                Transaction Visualizer
              </h1>
              <p className="mt-4 text-lg text-zinc-300 max-w-3xl">
                Arrange instructions, inspect signers and fees, and understand atomic execution.
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.12} inView>
            <section className="mb-10 rounded-3xl border border-white/10 bg-white/[0.02] p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-white">Transaction Rail</h2>
                  <p className="mt-2 text-xs text-zinc-400">
                    Visualize instruction order and see where a failure would roll back the entire transaction.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <span className="rounded-full border border-white/10 bg-black/40 px-2 py-1">
                    Signers: {signerCount}
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/40 px-2 py-1">
                    Compute: {computeTotal.toLocaleString()} CU
                  </span>
                </div>
              </div>

              <div className="mt-6 relative rounded-2xl border border-white/10 bg-black/60 px-8 py-12 overflow-x-auto">
                <div className="absolute left-6 right-6 top-[36%] h-px bg-gradient-to-r from-[#14f195]/30 via-[#38bdf8]/60 to-[#14f195]/30 animate-flow" />
                <div className="relative flex items-center gap-10 min-w-[760px]">
                  {instructions.map((ix, index) => {
                    const isFailurePoint = failureIndex === index;
                    return (
                      <div key={ix.id} className="flex flex-col items-center gap-4">
                        <div
                          className={`h-14 w-14 rounded-full border flex items-center justify-center text-xs font-semibold ${
                            isFailurePoint
                              ? "border-rose-500/60 bg-rose-500/20 text-rose-200"
                              : "border-[#14f195]/50 bg-[#14f195]/15 text-[#14f195]"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-black/40 px-5 py-4 text-center">
                          <div className="text-xs uppercase tracking-[0.2em] text-white/50">Instruction</div>
                          <div className="mt-1 text-base font-semibold text-white">{ix.name}</div>
                          <div className="mt-2 flex flex-wrap justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50">
                            <span>{ix.compute.toLocaleString()} CU</span>
                            <span>{ix.signer ? "Signer" : "No signer"}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </BlurFade>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <BlurFade delay={0.15} inView>
              <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Instruction Order</h2>
                  <label className="text-xs text-white/60 flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="accent-[#14f195]"
                      checked={simulateFailure}
                      onChange={(event) => setSimulateFailure(event.target.checked)}
                    />
                    Simulate failure
                  </label>
                </div>
                <p className="mt-2 text-xs text-zinc-400">
                  Reorder instructions to see how signatures and compute budget change.
                </p>

                <div className="mt-6 space-y-3">
                  {instructions.map((ix, index) => (
                    <div
                      key={ix.id}
                      className="rounded-2xl border border-white/10 bg-black/40 px-4 py-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs uppercase tracking-[0.2em] text-white/50">
                            Step {index + 1}
                          </div>
                          <div className="text-base font-semibold text-white">{ix.name}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleMove(index, "up")}
                            className="border border-white/15 bg-white/5 px-2 py-1 text-xs text-white/70 transition hover:bg-white/10"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => handleMove(index, "down")}
                            className="border border-white/15 bg-white/5 px-2 py-1 text-xs text-white/70 transition hover:bg-white/10"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/60">
                        <span>Compute: {ix.compute.toLocaleString()} CU</span>
                        <span>{ix.signer ? "Signer required" : "No signer"}</span>
                      </div>
                      <div className="mt-3 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#14f195] via-[#38bdf8] to-[#14f195] animate-flow"
                          style={{ width: `${Math.min(100, Math.round((ix.compute / 20000) * 100))}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </BlurFade>

            <BlurFade delay={0.2} inView>
              <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-6">
                <h2 className="text-lg font-semibold text-white">Transaction Summary</h2>
                <p className="mt-2 text-xs text-zinc-400">
                  Review fees, signers, and what happens if a step fails.
                </p>

                <div className="mt-6 space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/50">Fee Payer</div>
                    <div className="mt-2 text-sm text-white/80">Wallet A (payer + signer)</div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/50">Compute Budget</div>
                    <div className="mt-2 text-sm text-white/80">{computeTotal.toLocaleString()} CU</div>
                    <div className="mt-3 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#14f195] via-[#38bdf8] to-[#14f195] animate-flow"
                        style={{ width: `${Math.min(100, Math.round((computeTotal / 40000) * 100))}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-white/50">
                      Approx. {Math.round((computeTotal / 40000) * 100)}% of a 40k CU demo budget.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/50">Atomicity</div>
                    <p className="mt-2 text-sm text-white/80">{failureMessage}</p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-black/50 px-4 py-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-white/50">Signature Checklist</div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/70">
                      {instructions.map((ix) => (
                        <span
                          key={ix.id}
                          className={`rounded-full border px-2 py-1 ${
                            ix.signer ? "border-[#14f195]/40 text-[#14f195]" : "border-white/10 text-white/50"
                          }`}
                        >
                          {ix.name}: {ix.signer ? "Signer" : "No signer"}
                        </span>
                      ))}
                    </div>
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

export default TransactionVisualizerClient;
