import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { notFound } from "next/navigation";

import { BuildCourseActions } from "@/components/build-challenges/BuildCourseActions";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getBuildChallengeCourse } from "@/lib/build-challenges/source";
import { createCanonical } from "@/lib/seo";

type Params = Promise<{ courseSlug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { courseSlug } = await params;
  const challenge = getBuildChallengeCourse(courseSlug);
  if (!challenge) return { title: "Build challenge" };
  return { title: `${challenge.title} | learn.sol`, description: challenge.description, alternates: { canonical: createCanonical(`/build/${challenge.slug}`) } };
}

export default async function BuildCoursePage({ params }: { params: Params }) {
  const { courseSlug } = await params;
  const challenge = getBuildChallengeCourse(courseSlug);
  if (!challenge) notFound();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Navbar />
      <main className="pt-20">
        <section className="border-b border-white/10 px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-6xl">
            <Link href="/build" className="inline-flex min-h-10 items-center gap-2 text-sm text-zinc-400 transition-colors duration-100 hover:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solana-green"><ArrowLeft className="h-4 w-4" aria-hidden="true" />All builds</Link>
            <div className="mt-9 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19rem] lg:items-end">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-solana-green">{challenge.framework} · {challenge.difficulty} · ~{challenge.estimatedMinutes} min</p>
                <h1 className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">{challenge.title}</h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">{challenge.description}</p>
              </div>
              <BuildCourseActions courseSlug={challenge.slug} firstStageSlug={challenge.stages[0].slug} stageCount={challenge.stages.length} starterUrl={challenge.starter.downloadUrl} />
            </div>
          </div>
        </section>

        <section className="px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_19rem]">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">The path</h2>
              <ol className="mt-4 divide-y divide-white/10 border-y border-white/10">
                {challenge.stages.map((stage) => <li key={stage.slug}><Link href={`/build/${challenge.slug}/${stage.slug}`} className="group grid min-h-24 grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 py-5 transition-colors duration-100 hover:bg-white/[0.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solana-green sm:px-3"><span className="font-mono text-sm tabular-nums text-zinc-600">{String(stage.order).padStart(2, "0")}</span><div><h3 className="font-medium transition-colors duration-100 group-hover:text-solana-green">{stage.title}</h3><p className="mt-1 text-sm text-zinc-500">{stage.promise}</p></div><ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-solana-green" aria-hidden="true" /></Link></li>)}
              </ol>
            </div>
            <aside>
              <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-zinc-500">Before you start</h2>
              <p className="mt-4 text-sm leading-6 text-zinc-400">You should be comfortable with Anchor accounts, PDAs, and system-program CPIs.</p>
              <ul className="mt-5 space-y-3 text-sm">
                {challenge.prerequisites.map((item) => <li key={item.href}><Link href={item.href} className="inline-flex items-center gap-2 text-zinc-300 hover:text-solana-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solana-green"><Check className="h-3.5 w-3.5 text-solana-green" aria-hidden="true" />{item.label}</Link></li>)}
              </ul>
              <p className="mt-8 border-l border-white/15 pl-4 font-mono text-xs leading-6 text-zinc-600">Anchor {challenge.toolchain.anchor}<br />Solana {challenge.toolchain.solana}</p>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
