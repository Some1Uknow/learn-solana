"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { BlurFade } from "@/components/ui/blur-fade";
import { VisualBuilderEditor } from "@/components/visual-builder/editor";
import { BreadcrumbSchema } from "@/components/seo";

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
  { name: "Visual Builder", url: "/tools/visual-builder" },
];

interface VisualBuilderClientProps {
  fullscreen?: boolean;
}

export function VisualBuilderClient({ fullscreen = false }: VisualBuilderClientProps) {
  return (
    <div className="min-h-screen w-full relative text-white">
      {!fullscreen && <BreadcrumbSchema items={breadcrumbItems} />}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(circle 600px at 40% 10%, rgba(20, 241, 149, 0.18), transparent),
            radial-gradient(circle 500px at 90% 30%, rgba(56, 189, 248, 0.14), transparent),
            radial-gradient(circle 500px at 15% 80%, rgba(153, 69, 255, 0.12), transparent),
            radial-gradient(ellipse 70% 25% at 50% 100%, rgba(20, 241, 149, 0.08), transparent),
            #000000
          `,
        }}
      />

      {!fullscreen && <Navbar />}

      <div className={fullscreen ? "pt-4 pb-6 px-0" : "pt-28 pb-20 px-4 sm:px-6 md:px-8"}>
        <div className={fullscreen ? "w-full" : "w-full max-w-none mx-auto"}>
          <BlurFade delay={0.05} inView>
            {fullscreen ? (
              <div className="flex items-center justify-between mb-4 px-4">
                <Link
                  href="/tools/visual-builder"
                  className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-[#14f195] transition-colors"
                >
                  <span aria-hidden="true">←</span>
                  Back to Visual Builder
                </Link>
                <span className="text-xs tracking-[0.25em] text-[#14f195] uppercase font-medium">
                  [FULLSCREEN]
                </span>
              </div>
            ) : (
              <nav className="text-sm text-zinc-400 mb-8" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-[#14f195] transition-colors">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link href="/tools" className="hover:text-[#14f195] transition-colors">
                  Tools
                </Link>
                <span className="mx-2">/</span>
                <span className="text-white">Visual Builder</span>
              </nav>
            )}
          </BlurFade>

          <BlurFade delay={0.1} inView>
            <div className={`mb-10 ${fullscreen ? "hidden" : ""}`}>
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-xs tracking-[0.25em] text-[#14f195] uppercase font-medium">
                  [LEARN.SOL LABS]
                </span>
                <span className="rounded-full border border-[#14f195]/30 bg-[#14f195]/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#14f195]">
                  Beta
                </span>
              </div>
              <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                Visual Solana Builder
              </h1>
              <p className="mt-4 text-lg text-zinc-300 max-w-3xl">
                Drag, connect, and export Anchor programs without writing code. Perfect for beginners who learn best by
                seeing how Solana pieces click together.
              </p>
            </div>
          </BlurFade>

          <BlurFade delay={0.15} inView>
            <div className={`grid gap-4 md:grid-cols-3 mb-10 ${fullscreen ? "hidden" : ""}`}>
              {[
                {
                  title: "Build with Blocks",
                  description: "Drag-and-drop Program, Instruction, and Account blocks to map your dApp flow.",
                },
                {
                  title: "Learn As You Go",
                  description: "Inspector explains the role of every block in plain language.",
                },
                {
                  title: "Export Anchor",
                  description: "Generate a beginner-friendly Anchor lib.rs to keep building in code.",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-3xl border border-white/10 bg-white/[0.02] px-5 py-6"
                >
                  <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{card.description}</p>
                </div>
              ))}
            </div>
          </BlurFade>

          <BlurFade delay={0.2} inView>
            <VisualBuilderEditor fullscreen={fullscreen} />
          </BlurFade>
        </div>
      </div>
    </div>
  );
}

export default VisualBuilderClient;
