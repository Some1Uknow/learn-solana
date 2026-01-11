"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { BlurFade } from "@/components/ui/blur-fade"
import Image from "next/image";
import { ToolCategory } from "@/data/tools-data";
import { ArrowLeft, ArrowRight, ExternalLink, CheckCircle } from "lucide-react";

interface ToolCategoryClientProps {
  category: ToolCategory;
}

export function ToolCategoryClient({ category }: ToolCategoryClientProps) {
  const { featuredTool, projectsBuiltWith, otherTools } = category;
  const isSlotAvailable = featuredTool.name === "Available Slot";

  return (
    <div className="min-h-screen w-full relative text-white">
      {/* Fixed gradient background - Deep Dive theme */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(circle 400px at 70% 20%, rgba(56, 189, 248, 0.14), transparent),
            radial-gradient(circle 500px at 20% 40%, rgba(153, 69, 255, 0.12), transparent),
            radial-gradient(circle 300px at 85% 75%, rgba(99, 102, 241, 0.1), transparent),
            radial-gradient(ellipse 60% 40% at 30% 90%, rgba(34, 211, 238, 0.06), transparent),
            #000000
          `,
        }}
      />

      <Navbar />

      <div className="pt-28 pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <BlurFade delay={0.05} inView>
            <div className="flex items-center justify-between mb-8">
              <nav className="text-sm text-zinc-400">
                <Link href="/" className="hover:text-[#14f195] transition-colors">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link href="/tools" className="hover:text-[#14f195] transition-colors">
                  Tools
                </Link>
                <span className="mx-2">/</span>
                <span className="text-white">{category.name}</span>
              </nav>
              <Link
                href="/tools"
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Link>
            </div>
          </BlurFade>

          {/* Header */}
          <BlurFade delay={0.1} inView>
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{category.icon}</span>
                <div className="text-xs tracking-[0.25em] text-[#14f195] uppercase font-medium">[{category.name}]</div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                {category.name}
              </h1>
              <p className="mt-4 text-lg text-zinc-400 max-w-2xl">
                {category.description}
              </p>
            </div>
          </BlurFade>

          {/* Featured Tool Section */}
          <BlurFade delay={0.15} inView>
            <section className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <h2 className="text-xl font-semibold tracking-tight">Recommended Provider</h2>
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                  isSlotAvailable 
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-400"
                    : "border-[#14f195]/30 bg-[#14f195]/10 text-[#14f195]"
                }`}>
                  {isSlotAvailable ? "Available" : "Featured"}
                </span>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 md:p-10">
                <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
                  {/* Left: Tool Info */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      {isSlotAvailable ? (
                        <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center border-2 border-dashed border-white/20">
                          <span className="text-3xl text-zinc-500">?</span>
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-xl overflow-hidden border-0">
                          {featuredTool.logo ? (
                            <Image height={1000} width={1000} src={featuredTool.logo} alt={featuredTool.name} className="w-full h-full" />
                          ) : (
                            <span className="text-2xl font-bold text-white flex items-center justify-center h-full">{featuredTool.name[0]}</span>
                          )}
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold">{featuredTool.name}</h3>
                        <span className="text-sm text-zinc-400">
                          {isSlotAvailable ? "Partner with LearnSol" : "Featured Partner"}
                        </span>
                      </div>
                    </div>

                    <p className="text-zinc-300">{featuredTool.description}</p>

                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400 mb-3">
                        {isSlotAvailable ? "Partnership Benefits" : "Key Features"}
                      </h4>
                      <ul className="space-y-2">
                        {featuredTool.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-zinc-300">
                            <CheckCircle className="w-4 h-4 text-[#14f195] mt-0.5 shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {isSlotAvailable ? (
                      <Link
                        href="/partner"
                        className="inline-flex items-center gap-2 rounded-xl border border-[#14f195] bg-[#14f195]/10 px-6 py-3 font-medium text-[#14f195] transition hover:bg-[#14f195]/20"
                      >
                        Become a Partner
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <a
                        href={featuredTool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
                      >
                        Learn More
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Right: Stats */}
                  <div className="flex flex-col justify-center space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                      Status
                    </h4>
                    <div className="grid gap-3">
                      {featuredTool.stats.map((stat, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-[#14f195]/20 bg-[#14f195]/5 p-4 text-center"
                        >
                          <div className="text-2xl font-bold text-[#14f195]">{stat.value}</div>
                          <div className="mt-1 text-xs text-zinc-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </BlurFade>

          {/* Tutorials Section */}
          <BlurFade delay={0.2} inView>
            <section className="mb-12">
              <h3 className="text-lg font-semibold mb-4">Integration Tutorials</h3>
              {featuredTool.tutorials && featuredTool.tutorials.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-3">
                  {featuredTool.tutorials.map((tutorial, idx) => (
                    <Link
                      key={idx}
                      href={tutorial.slug}
                      className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition hover:border-[#14f195]/30 hover:bg-white/[0.04]"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#14f195]/10 flex items-center justify-center text-[#14f195] text-sm font-bold">
                          {idx + 1}
                        </div>
                        <span className="text-xs text-zinc-500 uppercase tracking-wider">Tutorial</span>
                      </div>
                      <h5 className="text-white font-medium mb-2 group-hover:text-[#14f195] transition">{tutorial.title}</h5>
                      <p className="text-xs text-zinc-400 leading-relaxed">{tutorial.description}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-3">
                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className="rounded-2xl border border-dashed border-white/10 bg-white/[0.01] p-5"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 text-sm font-bold">
                          {num}
                        </div>
                        <span className="text-xs text-zinc-600 uppercase tracking-wider">Available</span>
                      </div>
                      <h5 className="text-zinc-500 font-medium mb-1">Tutorial Slot {num}</h5>
                      <p className="text-xs text-zinc-600">Reserved for Featured Partner</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </BlurFade>

          {/* CTA Section */}
          <BlurFade delay={0.25} inView>
            <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-[#14f195]/5 to-[#9945ff]/5 p-8 text-center">
              <h3 className="text-xl font-semibold">Interested in a Featured Partner slot?</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Showcase your tool to the Solana developer community.
              </p>
              <Link
                href="/partner"
                className="mt-6 inline-block rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
              >
                Learn About Partnership
              </Link>
            </section>
          </BlurFade>
        </div>
      </div>
    </div>
  );
}

export default ToolCategoryClient;
