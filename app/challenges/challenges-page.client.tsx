"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Code, Trophy, Zap, Target, ArrowRight } from "lucide-react";
import { LoginRequiredModal } from "@/components/ui/login-required-modal";
import { useLoginGate } from "@/hooks/use-login-gate";
import { useRouter } from "next/navigation";
import { BreadcrumbSchema } from "@/components/seo";

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Challenges", url: "/challenges" },
];

export function ChallengesPageClient() {
  const router = useRouter();
  const { requireLogin, showModal, setShowModal } = useLoginGate();
  const [challengeStats, setChallengeStats] = React.useState<{
    participants: number;
    totalAttempted: number;
  } | null>(null);

  React.useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setChallengeStats({
          participants: data.rustChallengeParticipants || 0,
          totalAttempted: data.totalRustChallengesAttempted || 0,
        });
      })
      .catch((err) => console.error("Failed to fetch stats:", err));
  }, []);

  const phases = [
    { title: "Foundations", days: "Days 1-8", description: "Core syntax, ownership, borrowing, enums, error patterns.", icon: Code },
    { title: "Deep Dive", days: "Days 9-16", description: "Generics, traits, lifetimes, collections & iterators.", icon: Target },
    { title: "Advanced", days: "Days 17-23", description: "Algorithms, concurrency primitives, benchmarking.", icon: Zap },
    { title: "Solana Ready", days: "Days 24-30", description: "PDAs, serialization, cross-program invocations, security.", icon: Trophy },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <BreadcrumbSchema items={breadcrumbItems} />
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-500 mb-8">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Challenges</span>
          </nav>

          {/* Header */}
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest text-[#14f195] mb-3">Daily Challenges</p>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
              30 Days of Rust Coding
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl">
              Progressive daily Rust coding series—from foundations to Solana program primitives.
            </p>

            {challengeStats && challengeStats.participants > 0 && (
              <div className="mt-6 flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-semibold text-[#14f195]">
                    <NumberTicker value={challengeStats.participants} />
                  </span>
                  <span className="text-sm text-neutral-500">developers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-semibold text-[#9945ff]">
                    <NumberTicker value={challengeStats.totalAttempted} />
                  </span>
                  <span className="text-sm text-neutral-500">challenges completed</span>
                </div>
              </div>
            )}
          </div>

          {/* Main Challenge Card */}
          <div className="mb-12 rounded-lg border border-neutral-800 bg-neutral-900/30 overflow-hidden">
            <div className="grid md:grid-cols-[200px_1fr] gap-0">
              <div className="relative h-40 md:h-auto bg-gradient-to-br from-[#9945ff]/10 to-[#14f195]/10 flex items-center justify-center p-6">
                <div className="relative w-24 h-24 md:w-32 md:h-32">
                  <Image
                    src="/rust-2.png"
                    alt="Rust Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-400">
                    30 Days
                  </span>
                  <span className="inline-flex items-center rounded-full border border-[#14f195]/30 bg-[#14f195]/10 px-2.5 py-0.5 text-xs font-medium text-[#14f195]">
                    Active
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-medium mb-3">
                  From Basics to Solana-Grade Problem Solving
                </h2>

                <p className="text-neutral-400 text-sm mb-6">
                  Master Rust programming through daily challenges designed specifically for
                  aspiring Solana developers. Each day builds on the last.
                </p>

                <button
                  onClick={() => requireLogin(() => router.push("/challenges/rust"))}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#14f195] px-5 py-2.5 text-sm font-medium text-black transition-all hover:bg-[#12d182]"
                >
                  Start Challenge
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Phases */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Challenge Roadmap</h3>
            <p className="text-sm text-neutral-500">Progressive difficulty across 4 phases</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {phases.map((phase) => {
              const IconComponent = phase.icon;
              return (
                <div
                  key={phase.title}
                  className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-5 transition-colors hover:border-neutral-700"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#14f195]/10 flex items-center justify-center">
                      <IconComponent className="w-4 h-4 text-[#14f195]" />
                    </div>
                    <span className="text-xs text-neutral-500 uppercase tracking-wider">{phase.days}</span>
                  </div>
                  <h4 className="text-base font-medium mb-2">{phase.title}</h4>
                  <p className="text-sm text-neutral-400">{phase.description}</p>
                </div>
              );
            })}
          </div>

          {/* Coming Soon */}
          <div className="mt-10 rounded-lg border border-neutral-800 bg-neutral-900/30 px-5 py-4 text-center">
            <p className="text-sm text-neutral-400">
              <span className="text-[#14f195]">Coming Soon:</span> Interactive coding prompts, hidden tests, streak tracking & mini Solana program checkpoints.
            </p>
          </div>
        </div>
      </div>

      <Footer />

      <LoginRequiredModal
        open={showModal}
        onOpenChange={setShowModal}
        title="Start Your Journey"
        description="Connect your wallet to track your progress and earn achievements in the 30 Days of Rust challenge."
      />
    </div>
  );
}

export default ChallengesPageClient;
