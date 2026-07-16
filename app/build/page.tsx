import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { listBuildChallengeCourses } from "@/lib/build-challenges/source";
import { createCanonical } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Build Solana programs | learn.sol",
  description: "Build real Anchor programs locally, upload the compiled .so, and learn from staged tests.",
  alternates: { canonical: createCanonical("/build") },
};

export default function BuildChallengesPage() {
  const challenges = listBuildChallengeCourses();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="pt-20">
        <section className="border-b border-white/10 px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-6xl">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-solana-green">Build on Solana</p>
            <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end">
              <div>
                <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">Build programs that survive real tests.</h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">Start with a real Anchor workspace. Build locally. Upload the compiled program. Each stage gives you one clear thing to make true.</p>
              </div>
              <p className="border-l border-white/15 pl-4 font-mono text-xs leading-6 text-zinc-500">No browser IDE.<br />No Git setup.<br />Just your program and the proof that it works.</p>
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 sm:py-14" aria-labelledby="build-challenges">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between border-b border-white/10 pb-4">
              <h2 id="build-challenges" className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">Open build</h2>
              <span className="font-mono text-xs text-zinc-600">{String(challenges.length).padStart(2, "0")}</span>
            </div>
            {challenges.length ? (
              <div className="divide-y divide-white/10">
                {challenges.map((challenge) => (
                  <Link key={challenge.slug} href={`/build/${challenge.slug}`} className="group grid min-h-36 gap-5 py-7 transition-colors duration-100 hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solana-green sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:items-center sm:px-4">
                    <span className="font-mono text-sm tabular-nums text-zinc-600">01</span>
                    <div>
                      <h3 className="text-2xl font-semibold tracking-tight transition-colors duration-100 group-hover:text-solana-green">{challenge.title}</h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{challenge.description}</p>
                      <p className="mt-3 font-mono text-xs text-zinc-600">{challenge.framework} · {challenge.stages.length} stages · ~{challenge.estimatedMinutes} min</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-zinc-600 transition-[color,transform] duration-100 group-hover:translate-x-1 group-hover:text-solana-green" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            ) : <p className="py-12 text-sm text-zinc-500">The first build is being prepared.</p>}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
