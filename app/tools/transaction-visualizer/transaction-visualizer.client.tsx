"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
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
    <div className="min-h-screen w-full bg-black text-white">
      <BreadcrumbSchema items={breadcrumbItems} />
      <Navbar />

      <div className="pt-28 pb-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-neutral-400 mb-8" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2 text-neutral-600">/</span>
            <Link href="/tools" className="hover:text-white transition-colors">Tools</Link>
            <span className="mx-2 text-neutral-600">/</span>
            <span className="text-white">Transaction Visualizer</span>
          </nav>

          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-[#14f195] mb-3">Transaction Flow</p>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">Transaction Visualizer</h1>
            <p className="text-lg text-neutral-400 max-w-2xl">
              Arrange instructions, inspect signers and fees, and understand atomic execution.
            </p>
          </div>

          {/* Transaction Rail */}
          <section className="mb-8 rounded-lg border border-neutral-800 bg-neutral-900/30 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-medium text-white">Transaction Rail</h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Visualize instruction order and see where a failure would roll back.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-neutral-400">
                <span className="rounded border border-neutral-700 bg-neutral-800 px-2 py-1">
                  Signers: {signerCount}
                </span>
                <span className="rounded border border-neutral-700 bg-neutral-800 px-2 py-1">
                  Compute: {computeTotal.toLocaleString()} CU
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-6 overflow-x-auto">
              <div className="flex items-center gap-8 min-w-[700px]">
                {instructions.map((ix, index) => {
                  const isFailurePoint = failureIndex === index;
                  return (
                    <div key={ix.id} className="flex flex-col items-center gap-3">
                      <div
                        className={`h-12 w-12 rounded-full border flex items-center justify-center text-sm font-medium ${
                          isFailurePoint
                            ? "border-red-500/60 bg-red-500/20 text-red-400"
                            : "border-[#14f195]/50 bg-[#14f195]/10 text-[#14f195]"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3 text-center">
                        <span className="text-xs text-neutral-500 uppercase tracking-wider">Instruction</span>
                        <h3 className="font-medium text-white mt-1">{ix.name}</h3>
                        <div className="mt-2 flex flex-wrap justify-center gap-2 text-xs text-neutral-500">
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

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Instruction Order */}
            <section className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-medium text-white">Instruction Order</h2>
                <label className="text-sm text-neutral-400 flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-[#14f195]"
                    checked={simulateFailure}
                    onChange={(event) => setSimulateFailure(event.target.checked)}
                  />
                  Simulate failure
                </label>
              </div>
              <p className="text-sm text-neutral-500 mb-6">
                Reorder instructions to see how signatures and compute budget change.
              </p>

              <div className="space-y-3">
                {instructions.map((ix, index) => (
                  <div key={ix.id} className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-xs text-neutral-500">Step {index + 1}</span>
                        <h3 className="font-medium text-white">{ix.name}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMove(index, "up")}
                          className="border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm text-neutral-400 rounded hover:bg-neutral-700 transition"
                        >
                          ↑
                        </button>
                        <button
                          onClick={() => handleMove(index, "down")}
                          className="border border-neutral-700 bg-neutral-800 px-2 py-1 text-sm text-neutral-400 rounded hover:bg-neutral-700 transition"
                        >
                          ↓
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-neutral-500">
                      <span>Compute: {ix.compute.toLocaleString()} CU</span>
                      <span>{ix.signer ? "Signer required" : "No signer"}</span>
                    </div>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-[#14f195] transition-all"
                        style={{ width: `${Math.min(100, Math.round((ix.compute / 20000) * 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Summary */}
            <section className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-6">
              <h2 className="font-medium text-white mb-1">Transaction Summary</h2>
              <p className="text-sm text-neutral-500 mb-6">
                Review fees, signers, and what happens if a step fails.
              </p>

              <div className="space-y-4">
                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Fee Payer</span>
                  <p className="text-sm text-white mt-1">Wallet A (payer + signer)</p>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Compute Budget</span>
                  <p className="text-sm text-white mt-1">{computeTotal.toLocaleString()} CU</p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                    <div
                      className="h-full bg-[#14f195] transition-all"
                      style={{ width: `${Math.min(100, Math.round((computeTotal / 40000) * 100))}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-neutral-500">
                    Approx. {Math.round((computeTotal / 40000) * 100)}% of a 40k CU demo budget.
                  </p>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Atomicity</span>
                  <p className="text-sm text-white mt-1">{failureMessage}</p>
                </div>

                <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">Signature Checklist</span>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {instructions.map((ix) => (
                      <span
                        key={ix.id}
                        className={`rounded border px-2 py-1 ${
                          ix.signer ? "border-[#14f195]/40 text-[#14f195]" : "border-neutral-700 text-neutral-500"
                        }`}
                      >
                        {ix.name}: {ix.signer ? "Signer" : "No signer"}
                      </span>
                    ))}
                  </div>
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

export default TransactionVisualizerClient;
