"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { BlurFade } from "@/components/ui/blur-fade";
import { toolCategories } from "@/data/tools-data";
import { ArrowRight } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo";

const categoryCards = toolCategories.map((cat) => ({
  id: cat.id,
  name: cat.name,
  description: cat.description,
  featured: cat.featured,
  icon: cat.icon,
  href: `/tools/${cat.id}`,
}));

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

          {/* Categories Grid */}
          <BlurFade delay={0.2} inView>
            <div className="mb-8">
              <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Tool Categories
              </h2>
              <p className="text-sm text-zinc-400 mt-2">
                Browse by category to find the right tools for your stack.
              </p>
            </div>
          </BlurFade>

          <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[18rem] gap-5">
            {categoryCards.map((category, index) => {
              const isAvailable = category.featured === "Available";
              return (
                <BlurFade key={category.id} delay={0.15 + index * 0.05} inView>
                  <Link href={category.href} className="block h-full group">
                    <BentoCard
                      name={category.name}
                      className="h-full col-span-1 bg-white/[0.02] border-white/[0.06] hover:border-[#14f195]/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(20,241,149,0.1)]"
                      background={
                        <div className="absolute inset-0 bg-gradient-to-br from-[#9945ff]/5 via-transparent to-[#14f195]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      }
                      Icon={() => (
                        <div className="flex items-center gap-3">
                          <span className="text-4xl">{category.icon}</span>
                          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                            isAvailable 
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                              : "border-[#14f195]/30 bg-[#14f195]/10 text-[#14f195]"
                          }`}>
                            {isAvailable ? "Open" : "Featured"}
                          </span>
                        </div>
                      )}
                      description={category.description}
                      href={category.href}
                      cta={isAvailable ? "Claim slot" : `View ${category.name.toLowerCase()}`}
                    />
                  </Link>
                </BlurFade>
              );
            })}
          </BentoGrid>

          {/* Partnership Footer */}
          <BlurFade delay={0.3} inView>
            <section className="mt-16 rounded-3xl border border-white/10 bg-gradient-to-r from-[#14f195]/5 to-[#9945ff]/5 p-8 text-center">
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
