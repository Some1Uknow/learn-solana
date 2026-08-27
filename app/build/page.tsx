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
    <div className="min-h-screen bg-[#f5f5f5] text-[#181818]">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="pt-20">
        <section className="border-b border-[#dedede] px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-[1182px]">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#557b11]">Build on Solana</p>
            <div className="mt-6 grid gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] lg:items-end">
              <div>
                <h1 className="max-w-4xl text-4xl font-medium leading-none tracking-[-0.03em] sm:text-5xl">Build programs that pass real tests.</h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-[#636363]">Start with an Anchor workspace. Build locally, upload the compiled program and pass each stage.</p>
              </div>
              <p className="border-l border-[#dedede] pl-4 font-mono text-xs leading-6 text-[#636363]">No browser IDE.<br />No Git setup.<br />Build locally and run the tests.</p>
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 sm:py-14" aria-labelledby="build-challenges">
          <div className="mx-auto max-w-[1182px]">
            <div className="flex items-end justify-between border-b border-[#dedede] pb-4">
              <h2 id="build-challenges" className="text-sm font-medium uppercase tracking-[0.12em] text-[#636363]">Open build</h2>
              <span className="font-mono text-xs text-[#636363]">{String(challenges.length).padStart(2, "0")}</span>
            </div>
            {challenges.length ? (
              <div className="divide-y divide-[#dedede]">
                {challenges.map((challenge) => (
                  <Link key={challenge.slug} href={`/build/${challenge.slug}`} className="group grid min-h-36 gap-5 py-7 transition-colors duration-100 hover:bg-[#efefef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6b8f27] sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:items-center sm:px-4">
                    <span className="font-mono text-sm tabular-nums text-[#636363]">01</span>
                    <div>
                      <h3 className="text-2xl font-medium tracking-tight transition-colors duration-100">{challenge.title}</h3>
                      <p className="mt-2 max-w-2xl text-sm leading-6 text-[#636363]">{challenge.description}</p>
                      <p className="mt-3 font-mono text-xs text-[#636363]">{challenge.framework} · {challenge.stages.length} stages · ~{challenge.estimatedMinutes} min</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-[#636363] transition-transform duration-100 group-hover:translate-x-1" aria-hidden="true" />
                  </Link>
                ))}
              </div>
            ) : <p className="py-12 text-sm text-[#636363]">The first build is being prepared.</p>}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
