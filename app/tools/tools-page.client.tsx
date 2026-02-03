"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo";

// Breadcrumb items for structured data
const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
];

export function ToolsPageClient() {
  return (
    <div className="min-h-screen w-full relative text-white">
      {/* Structured Data for SEO */}
      <BreadcrumbSchema items={breadcrumbItems} />
      
      {/* Fixed gradient background - Technical/Utility theme */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(circle 500px at 50% 10%, rgba(99, 102, 241, 0.15), transparent),
            radial-gradient(circle 350px at 90% 50%, rgba(153, 69, 255, 0.12), transparent),
            radial-gradient(circle 400px at 10% 80%, rgba(34, 211, 238, 0.08), transparent),
            radial-gradient(ellipse 70% 30% at 40% 100%, rgba(153, 69, 255, 0.06), transparent),
            #000000
          `,
        }}
      />

      <Navbar />

      <div className="pt-28 pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <BlurFade delay={0.05} inView>
            <nav className="text-sm text-zinc-400 mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-[#14f195] transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">Tools</span>
            </nav>
          </BlurFade>

          {/* Header */}
          <BlurFade delay={0.1} inView>
            <div className="mb-10">
              <div className="text-xs tracking-[0.25em] text-[#14f195] uppercase font-medium">[DEVELOPER TOOLS]</div>
              <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                Essential Solana Developer Tools
              </h1>
              <p className="mt-4 text-lg text-zinc-400 max-w-2xl">
                Discover the best infrastructure, wallets, and development tools for building on Solana.
              </p>
            </div>
          </BlurFade>

          {/* Partner CTA */}
          <BlurFade delay={0.15} inView>
            <div className="mb-12 rounded-2xl border border-[#14f195]/20 bg-[#14f195]/5 px-6 py-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <p className="text-sm text-zinc-300">
                  🤝 <span className="text-white font-medium">Partner with LearnSol:</span> Featured Partner slots are open across all categories.
                </p>
                <Link
                  href="/partner"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#14f195] bg-[#14f195]/10 px-4 py-2 text-sm font-medium text-[#14f195] transition hover:bg-[#14f195]/20 whitespace-nowrap"
                >
                  Partnership Inquiry
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </BlurFade>

          {/* LearnSol Labs */}
          <BlurFade delay={0.18} inView>
            <section className="mb-12 rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="text-xs tracking-[0.25em] text-[#14f195] uppercase font-medium">
                    [LEARN.SOL LABS]
                  </div>
                  <h2 className="mt-3 text-2xl font-semibold text-white">
                    Visual Solana Builder (Beta)
                  </h2>
                  <p className="mt-3 text-sm text-zinc-400 max-w-2xl">
                    Drag-and-drop Solana blocks to understand programs, accounts, and instructions — then export a
                    beginner-friendly Anchor <span className="font-mono">lib.rs</span>.
                  </p>
                </div>
                <Link
                  href="/tools/visual-builder"
                  className="inline-flex items-center gap-2 rounded-xl border border-[#14f195] bg-[#14f195]/10 px-5 py-3 text-sm font-medium text-[#14f195] transition hover:bg-[#14f195]/20 whitespace-nowrap"
                >
                  Try Visual Builder
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </section>
          </BlurFade>

          {/* Partnership Footer */}
          <BlurFade delay={0.2} inView>
            <section className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-r from-[#14f195]/5 to-[#9945ff]/5 p-8 text-center">
              <h3 className="text-xl font-semibold text-white">Become a Featured Partner</h3>
              <p className="mt-2 text-sm text-zinc-400 max-w-xl mx-auto">
                Get premium placement, AI assistant recommendations, and tutorial mentions across LearnSol.
              </p>
              <Link
                href="/partner"
                className="mt-6 inline-block rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Learn More
              </Link>
            </section>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}

export default ToolsPageClient;
