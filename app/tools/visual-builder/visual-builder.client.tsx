"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
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
    <div className="min-h-screen w-full bg-black text-white">
      {!fullscreen && <BreadcrumbSchema items={breadcrumbItems} />}

      {!fullscreen && <Navbar />}

      <div className={fullscreen ? "pt-4 pb-6 px-0" : "pt-28 pb-24 px-4 sm:px-6 md:px-8"}>
        <div className={fullscreen ? "w-full" : "w-full max-w-none mx-auto"}>
          {fullscreen ? (
            <div className="flex items-center justify-between mb-4 px-4">
              <Link
                href="/tools/visual-builder"
                className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
              >
                <span aria-hidden="true">←</span>
                Back to Visual Builder
              </Link>
              <span className="text-xs uppercase tracking-widest text-[#14f195]">
                Fullscreen
              </span>
            </div>
          ) : (
            <>
              {/* Breadcrumb */}
              <nav className="text-sm text-neutral-400 mb-8" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <span className="mx-2 text-neutral-600">/</span>
                <Link href="/tools" className="hover:text-white transition-colors">
                  Tools
                </Link>
                <span className="mx-2 text-neutral-600">/</span>
                <span className="text-white">Visual Builder</span>
              </nav>

              {/* Header */}
              <div className="mb-10 max-w-4xl">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-xs uppercase tracking-widest text-[#14f195]">
                    learn.sol Labs
                  </span>
                  <span className="rounded-full border border-[#14f195]/30 bg-[#14f195]/10 px-3 py-1 text-xs font-medium text-[#14f195]">
                    Beta
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
                  Visual Solana Builder
                </h1>
                <p className="text-lg text-neutral-400 max-w-2xl">
                  Drag, connect, and export Anchor programs without writing code. Perfect for beginners who learn best by
                  seeing how Solana pieces click together.
                </p>
              </div>

              {/* Feature cards */}
              <div className="grid gap-4 md:grid-cols-3 mb-10 max-w-4xl">
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
                    className="rounded-lg border border-neutral-800 bg-neutral-900/30 p-5"
                  >
                    <h3 className="font-medium text-white mb-2">{card.title}</h3>
                    <p className="text-sm text-neutral-500">{card.description}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <VisualBuilderEditor fullscreen={fullscreen} />
        </div>
      </div>

      {!fullscreen && <Footer />}
    </div>
  );
}

export default VisualBuilderClient;
