"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { BlurFade } from "@/components/ui/blur-fade";
import { ArrowRight } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo";

const toolSuite = [
  {
    name: "Visual Solana Builder",
    description:
      "Drag-and-drop program blocks to map how instructions and accounts connect. Export Anchor starter code.",
    href: "/tools/visual-builder",
    badge: "Beta",
    tags: ["No-code", "Anchor", "Visual"],
  },
  {
    name: "Program Simulator",
    description:
      "Step through Anchor instruction execution with account checks, PDAs, logs, and failure reasons.",
    href: "/tools/program-simulator",
    badge: "New",
    tags: ["Runner", "Constraints", "Debug"],
  },
  {
    name: "Transaction Visualizer",
    description:
      "Reorder instructions, inspect signers and compute cost, and learn transaction atomicity.",
    href: "/tools/transaction-visualizer",
    badge: "New",
    tags: ["Transactions", "Fees", "Ordering"],
  },
  {
    name: "Account Explorer",
    description:
      "Beginner-friendly account inspector with plain-language explanations for every field.",
    href: "/tools/account-explorer",
    badge: "New",
    tags: ["Accounts", "Owners", "Data"],
  },
];

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
                Explore LearnSol’s interactive tooling built to make Solana concepts visual, guided, and hands-on.
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

          {/* Tooling Suite */}
          <BlurFade delay={0.22} inView>
            <section className="mb-12">
              <div className="mb-6">
                <div className="text-xs tracking-[0.25em] text-[#14f195] uppercase font-medium">
                  [LEARN.SOL TOOLING]
                </div>
                <h2 className="mt-3 text-2xl font-semibold text-white">Interactive Learning Tools</h2>
                <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
                  Purpose-built tools that make Solana concepts visual, guided, and hands-on for beginners.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {toolSuite.map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    className="group rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-[#14f195]/40 hover:shadow-[0_0_40px_rgba(20,241,149,0.12)]"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                      <span className="rounded-full border border-[#14f195]/30 bg-[#14f195]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#14f195]">
                        {tool.badge}
                      </span>
                    </div>
                    <p className="mt-3 text-sm text-zinc-300">{tool.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-white/50">
                      {tool.tags.map((tag) => (
                        <span key={tag} className="rounded-full border border-white/10 px-2 py-1">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#14f195]">
                      Open tool
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
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
