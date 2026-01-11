"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Navbar } from "@/components/layout/navbar";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Code, Trophy, Zap, Target, ArrowRight } from "lucide-react";

export function ChallengesPageClient() {
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
    {
      title: "Foundations",
      days: "Days 1-8",
      description: "Core syntax, ownership, borrowing, enums, error patterns.",
      icon: Code,
    },
    {
      title: "Deep Dive",
      days: "Days 9-16",
      description: "Generics, traits, lifetimes, collections & iterators.",
      icon: Target,
    },
    {
      title: "Advanced",
      days: "Days 17-23",
      description: "Algorithms, concurrency primitives, benchmarking.",
      icon: Zap,
    },
    {
      title: "Solana Ready",
      days: "Days 24-30",
      description: "PDAs, serialization, cross-program invocations, security.",
      icon: Trophy,
    },
  ];

  return (
    <div className="min-h-screen w-full relative text-white">
      {/* Fixed gradient background - Competition/Achievement theme */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(circle 500px at 60% 5%, rgba(251, 146, 60, 0.14), transparent),
            radial-gradient(circle 400px at 15% 25%, rgba(153, 69, 255, 0.15), transparent),
            radial-gradient(circle 350px at 85% 60%, rgba(245, 158, 11, 0.1), transparent),
            radial-gradient(ellipse 70% 40% at 40% 95%, rgba(153, 69, 255, 0.08), transparent),
            #000000
          `,
        }}
      />

      <Navbar />

      <div className="pt-28 pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <BlurFade delay={0.05} inView>
            <nav className="text-sm text-zinc-400 mb-8">
              <Link href="/" className="hover:text-[#14f195] transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">Challenges</span>
            </nav>
          </BlurFade>

          {/* Header */}
          <BlurFade delay={0.1} inView>
            <div className="mb-12">
              <div className="text-xs tracking-[0.25em] text-[#14f195] uppercase font-medium">[DAILY CHALLENGES]</div>
              <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                30 Days of Rust Coding
              </h1>
              <p className="mt-4 text-lg text-zinc-400 max-w-2xl">
                Progressive daily Rust coding series—from foundations to Solana program primitives. 
                Build muscle memory for blockchain development.
              </p>
              
              {/* Stats */}
              {challengeStats && challengeStats.participants > 0 && (
                <div className="mt-6 flex flex-wrap gap-6">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#14f195]">
                      <NumberTicker value={challengeStats.participants} />
                    </span>
                    <span className="text-sm text-zinc-400">developers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-[#9945ff]">
                      <NumberTicker value={challengeStats.totalAttempted} />
                    </span>
                    <span className="text-sm text-zinc-400">challenges completed</span>
                  </div>
                </div>
              )}
            </div>
          </BlurFade>

          {/* Main Challenge Card */}
          <BlurFade delay={0.15} inView>
            <div className="mb-12 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
              <div className="grid md:grid-cols-[240px_1fr] gap-0">
                {/* Left: Image */}
                <div className="relative h-48 md:h-auto bg-gradient-to-br from-[#9945ff]/20 to-[#14f195]/20 flex items-center justify-center p-8">
                  <div className="relative w-32 h-32 md:w-40 md:h-40">
                    <Image
                      src="/rust-2.png"
                      alt="Rust Logo"
                      fill
                      className="object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                      priority
                    />
                  </div>
                </div>
                
                {/* Right: Content */}
                <div className="p-8 md:p-10">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-400">
                      30 Days
                    </span>
                    <span className="inline-flex items-center rounded-full border border-[#14f195]/30 bg-[#14f195]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#14f195]">
                      Active
                    </span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    From Basics to Solana-Grade Problem Solving
                  </h2>
                  
                  <p className="text-zinc-400 mb-6">
                    Master Rust programming through daily challenges designed specifically for 
                    aspiring Solana developers. Each day builds on the last, preparing you for 
                    real blockchain development.
                  </p>
                  
                  <Link
                    href="/challenges/rust"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#14f195] px-6 py-3 font-semibold text-black transition hover:bg-[#14f195]/90"
                  >
                    Start Challenge
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </BlurFade>

          {/* Phases Grid */}
          <BlurFade delay={0.2} inView>
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-2">Challenge Roadmap</h3>
              <p className="text-sm text-zinc-400">Progressive difficulty across 4 phases</p>
            </div>
          </BlurFade>

          <BentoGrid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[14rem] gap-4">
            {phases.map((phase, index) => {
              const IconComponent = phase.icon;
              return (
                <BlurFade key={phase.title} delay={0.2 + index * 0.05} inView>
                  <div className="h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 transition hover:border-[#14f195]/30 hover:bg-white/[0.04]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#14f195]/10 flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-[#14f195]" />
                      </div>
                      <span className="text-xs text-zinc-500 uppercase tracking-wider">{phase.days}</span>
                    </div>
                    <h4 className="text-lg font-semibold mb-2">{phase.title}</h4>
                    <p className="text-sm text-zinc-400">{phase.description}</p>
                  </div>
                </BlurFade>
              );
            })}
          </BentoGrid>

          {/* Coming Soon */}
          <BlurFade delay={0.3} inView>
            <div className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-6 py-4 text-center">
              <p className="text-sm text-zinc-400">
                <span className="text-[#14f195]">Coming Soon:</span> Interactive coding prompts, hidden tests, streak tracking & mini Solana program checkpoints.
              </p>
            </div>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}

export default ChallengesPageClient;
