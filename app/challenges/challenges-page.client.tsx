"use client";

import Image from "next/image";
import { useWeb3AuthUser } from "@web3auth/modal/react";
import Link from "next/link";

const backgroundStyle = `
  radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
  radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
  radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
  radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
  #000000
`;

export function ChallengesPageClient() {
  const { userInfo } = useWeb3AuthUser();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0" style={{ background: backgroundStyle }} />
      <div className="relative z-10 flex min-h-screen w-full justify-center px-6 py-16 md:px-10">
        <div className="flex w-full max-w-5xl flex-col gap-14">
          <header className="space-y-8">
            <div className="space-y-4">
              <div className="text-xs tracking-[0.25em] text-zinc-500">[CHALLENGES]</div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                30 Days of Rust Coding Challenge
              </h1>
              <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
                Progressive daily Rust coding series—foundations → ownership depth → algorithms & concurrency → Solana program primitives. Full interactive version coming soon.
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-4 text-xs text-zinc-400">
              Coming Soon: Interactive coding prompts, hidden tests, streak tracking & mini Solana program checkpoints.
            </div>
          </header>

          <article className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-10 shadow-[0_55px_140px_rgba(0,0,0,0.6)] backdrop-blur-md transition">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="relative grid gap-10 md:grid-cols-[220px_1fr]">
              <div className="flex flex-col items-center gap-6 text-center md:text-left">
                <div className="relative h-40 w-40 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 ring-1 ring-white/5">
                  <Image
                    src="/rust-2.png"
                    alt="Rust Logo"
                    fill
                    sizes="160px"
                    className="object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.08)]"
                    priority
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <span className="inline-flex items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200">
                    Daily Track
                  </span>
                  <Link
                    href="/challenges/rust"
                    className="inline-flex items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-[11px] font-semibold tracking-[0.25em] text-cyan-200 transition hover:border-cyan-400/50 hover:bg-cyan-400/15"
                  >
                    START
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <div className="space-y-5">
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    From basics to Solana-grade problem solving
                  </h2>
                  <p className="text-sm leading-relaxed text-zinc-400">
                    Difficulty ramp (high level):
                  </p>
                  <ul className="space-y-2 text-xs text-zinc-400">
                    <li><span className="text-zinc-300">Days 1–8:</span> Core syntax, ownership, borrowing, enums, error patterns.</li>
                    <li><span className="text-zinc-300">Days 9–16:</span> Generics, traits, lifetimes intuition, collections & iterator transforms.</li>
                    <li><span className="text-zinc-300">Days 17–23:</span> Algorithms, complexity awareness, concurrency primitives, benchmarking.</li>
                    <li><span className="text-zinc-300">Days 24–28:</span> Solana account model, PDAs, serialization layouts, cross-program basics.</li>
                    <li><span className="text-zinc-300">Days 29–30:</span> Consolidation, audit mindset, mini on-chain refactor.</li>
                  </ul>
                </div>
                <div className="flex items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-6 py-8 text-center text-xs text-zinc-500">
                  Full interactive challenge (daily prompts, tests, progress sync) is coming soon.
                </div>
              </div>
            </div>
          </article>

          <footer className="pb-8 pt-4 text-center text-xs text-zinc-500">
            More multi-week mastery tracks (Anchor Deep Dive, Security Lab, Advanced CPI Patterns) will follow.
          </footer>
        </div>
      </div>
      {/* workspace handled in /challenges/[track]/[id] route */}
    </div>
  );
}

export default ChallengesPageClient;
