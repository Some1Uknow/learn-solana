"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowRight } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo";

const toolSuite = [
  {
    name: "Visual Solana Builder",
    description: "Drag-and-drop program blocks to map how instructions and accounts connect. Export Anchor starter code.",
    href: "/tools/visual-builder",
    badge: "Beta",
  },
  {
    name: "Program Simulator",
    description: "Step through Anchor instruction execution with account checks, PDAs, logs, and failure reasons.",
    href: "/tools/program-simulator",
    badge: "New",
  },
  {
    name: "Transaction Visualizer",
    description: "Reorder instructions, inspect signers and compute cost, and learn transaction atomicity.",
    href: "/tools/transaction-visualizer",
    badge: "New",
  },
  {
    name: "Account Explorer",
    description: "Beginner-friendly account inspector with plain-language explanations for every field.",
    href: "/tools/account-explorer",
    badge: "New",
  },
];

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
];

export function ToolsPageClient() {
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
            <span className="text-white">Tools</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-[#14f195] mb-3">Developer Tools</p>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
              Essential Solana Developer Tools
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl">
              Interactive tooling built to make Solana concepts visual, guided, and hands-on.
            </p>
          </div>

          {/* Partner CTA */}
          <div className="mb-10 rounded-lg border border-[#14f195]/20 bg-[#14f195]/5 px-5 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-neutral-300">
                🤝 <span className="text-white font-medium">Partner with LearnSol:</span> Featured Partner slots are open.
              </p>
              <Link
                href="/partner"
                className="inline-flex items-center gap-2 rounded-lg border border-[#14f195] bg-[#14f195]/10 px-4 py-2 text-sm font-medium text-[#14f195] transition hover:bg-[#14f195]/20 whitespace-nowrap"
              >
                Partnership Inquiry
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Visual Builder Featured */}
          <div className="mb-10 rounded-lg border border-neutral-800 bg-neutral-900/30 p-6 md:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-[#14f195] mb-2">learn.sol Labs</p>
                <h2 className="text-xl font-medium text-white mb-2">Visual Solana Builder (Beta)</h2>
                <p className="text-sm text-neutral-400 max-w-lg">
                  Drag-and-drop Solana blocks to understand programs, accounts, and instructions — then export a beginner-friendly Anchor <code className="text-neutral-300">lib.rs</code>.
                </p>
              </div>
              <Link
                href="/tools/visual-builder"
                className="inline-flex items-center gap-2 rounded-lg border border-[#14f195] bg-[#14f195]/10 px-5 py-2.5 text-sm font-medium text-[#14f195] transition hover:bg-[#14f195]/20 whitespace-nowrap"
              >
                Try Visual Builder
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="mb-6">
            <h3 className="text-lg font-medium mb-2">Interactive Learning Tools</h3>
            <p className="text-sm text-neutral-500">Purpose-built tools for Solana beginners.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {toolSuite.map((tool) => (
              <Link
                key={tool.name}
                href={tool.href}
                className="group rounded-lg border border-neutral-800 bg-neutral-900/30 p-5 transition-colors hover:border-neutral-700"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-medium text-white">{tool.name}</h3>
                  <span className="rounded-full border border-[#14f195]/30 bg-[#14f195]/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#14f195]">
                    {tool.badge}
                  </span>
                </div>
                <p className="text-sm text-neutral-400 mb-4">{tool.description}</p>
                <div className="flex items-center text-sm text-[#14f195]">
                  <span>Open tool</span>
                  <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          {/* Partnership Footer */}
          <div className="mt-12 rounded-lg border border-neutral-800 bg-gradient-to-r from-[#14f195]/5 to-[#9945ff]/5 p-8 text-center">
            <h3 className="text-lg font-medium text-white mb-2">Become a Featured Partner</h3>
            <p className="text-sm text-neutral-400 max-w-md mx-auto mb-6">
              Get premium placement, AI assistant recommendations, and tutorial mentions across LearnSol.
            </p>
            <Link
              href="/partner"
              className="inline-block rounded-lg border border-neutral-700 bg-neutral-900/50 px-5 py-2.5 text-sm font-medium text-white transition hover:border-neutral-600 hover:bg-neutral-800"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ToolsPageClient;
