"use client";

import Link from "next/link";
import { ToolCategory } from "@/data/tools-data";

const backgroundStyle = `
  radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
  radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
  radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
  radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
  #000000
`;

interface ToolCategoryClientProps {
  category: ToolCategory;
}

export function ToolCategoryClient({ category }: ToolCategoryClientProps) {
  const { featuredTool, projectsBuiltWith, otherTools } = category;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0" style={{ background: backgroundStyle }} />

      <div className="relative z-10 flex min-h-screen w-full justify-center px-6 py-16 md:px-10">
        <div className="flex w-full max-w-7xl flex-col gap-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Link href="/tools" className="hover:text-white transition">
              Tools
            </Link>
            <span>/</span>
            <span className="text-white">{category.name}</span>
          </div>

          {/* Header */}
          <header className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{category.icon}</span>
              <div className="text-xs tracking-[0.25em] text-zinc-500 uppercase">
                [{category.name}]
              </div>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {category.name}
            </h1>
            <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
              {category.description}
            </p>
            
            {/* Syndica Recommendation - Only show for RPC category */}
            {category.id === "rpc" && featuredTool.name === "Syndica" && (
              <div className="mt-6 rounded-xl bg-zinc-900/40 border border-zinc-800 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={featuredTool.logo} 
                      alt="Syndica" 
                      className="w-10 h-10 rounded-lg"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white mb-2">Why We Use Syndica</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      For this course, we've chosen Syndica as our RPC infrastructure. They build robust, enterprise-grade systems 
                      that power some of Solana's most demanding protocols. All code examples in our tutorials connect through Syndica's infrastructure, 
                      so you're learning with the same tools used in production environments.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </header>

          {/* Featured Tool Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Recommended Provider
              </h2>
              {featuredTool.name === "Available Slot" ? (
                <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-amber-400">
                  Available
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-800/50 px-3 py-1 text-xs font-medium text-zinc-400">
                  Featured in Tutorials
                </span>
              )}
            </div>

            {/* Partner Slot Notice */}
            {featuredTool.name === "Available Slot" && (
              <div className="rounded-2xl border border-[#14F195]/30 bg-[#14F195]/5 px-6 py-4">
                <p className="text-sm text-[#14F195]">
                  ✨ <span className="font-semibold">This Featured Partner slot is currently open.</span>
                  <br />
                  <span className="text-zinc-300">To claim exclusivity for {category.name}, contact </span>
                  <a href="mailto:raghav@learnsol.site" className="font-medium text-[#14F195] hover:underline">raghav@learnsol.site</a>
                </p>
              </div>
            )}

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/2 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-md md:p-10">
              <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 via-transparent to-purple-500/5" />
              
              <div className="relative grid gap-8 lg:grid-cols-2">
                {/* Left: Tool Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    {featuredTool.name === "Available Slot" ? (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center border-2 border-dashed border-white/20">
                        <span className="text-3xl text-zinc-500">?</span>
                      </div>
                    ) : (
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center border border-white/10">
                        {featuredTool.logo ? (
                          <img src={featuredTool.logo} alt={featuredTool.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-2xl font-bold text-white">{featuredTool.name[0]}</span>
                        )}
                      </div>
                    )}
                    <div>
                      <h3 className="text-2xl font-bold text-white">{featuredTool.name}</h3>
                      <span className="text-sm text-zinc-400">
                        {featuredTool.name === "Available Slot" ? "Partner with LearnSol" : "Featured Partner"}
                      </span>
                    </div>
                  </div>

                  <p className="text-zinc-300">{featuredTool.description}</p>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                      {featuredTool.name === "Available Slot" ? "Partnership Benefits" : "Key Features"}
                    </h4>
                    <ul className="space-y-2">
                      {featuredTool.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-zinc-300">
                          <span className="text-[#14F195] mt-0.5">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {featuredTool.name === "Available Slot" ? (
                    <Link
                      href="/partner"
                      className="inline-flex items-center gap-2 rounded-xl border border-[#14F195] bg-[#14F195]/10 px-6 py-3 font-medium text-[#14F195] transition hover:bg-[#14F195]/20"
                    >
                      Become a Partner
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  ) : (
                    <a
                      href={featuredTool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-6 py-3 font-medium text-white transition hover:bg-zinc-800 hover:border-zinc-600"
                    >
                      Learn More
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>

                {/* Right: Stats */}
                <div className="flex flex-col justify-center space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                    Slot Status
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                    {featuredTool.stats.map((stat, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-center"
                      >
                        <div className="text-3xl font-bold text-amber-400">{stat.value}</div>
                        <div className="mt-1 text-sm text-zinc-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dedicated Tutorials for Featured Partner */}
            {featuredTool.tutorials && featuredTool.tutorials.length > 0 ? (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                  Integration Tutorials
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  {featuredTool.tutorials.map((tutorial, idx) => (
                    <Link
                      key={idx}
                      href={tutorial.slug}
                      className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 transition hover:border-zinc-700 hover:bg-zinc-900/60"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 text-sm font-bold group-hover:bg-zinc-700 group-hover:text-white transition">
                          {idx + 1}
                        </div>
                        <span className="text-xs text-zinc-500 uppercase tracking-wider">Tutorial {idx + 1}</span>
                      </div>
                      <h5 className="text-white font-medium mb-2 group-hover:text-[#14F195] transition">{tutorial.title}</h5>
                      <p className="text-xs text-zinc-400 leading-relaxed">{tutorial.description}</p>
                      <div className="mt-3 flex items-center gap-1 text-xs text-zinc-500 group-hover:text-[#14F195] transition">
                        <span>Read tutorial</span>
                        <svg className="w-3 h-3 group-hover:translate-x-1 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Link>
                  ))}
                </div>
                <p className="text-xs text-zinc-500 text-center">
                  Step-by-step guides for integrating {featuredTool.name} into your Solana projects.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                  Dedicated Tutorials (Featured Partner Benefit)
                </h4>
                <div className="grid gap-4 md:grid-cols-3">
                  {[1, 2, 3].map((num) => (
                    <div
                      key={num}
                      className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/30 p-5 transition hover:border-zinc-600"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-[#14F195]/10 flex items-center justify-center text-[#14F195] text-sm font-bold">
                          {num}
                        </div>
                        <span className="text-xs text-zinc-500 uppercase tracking-wider">Tutorial {num}</span>
                      </div>
                      <h5 className="text-white font-medium mb-1">Tutorial Slot {num}</h5>
                      <p className="text-xs text-zinc-500">A dedicated tutorial created for the Featured Partner&apos;s product.</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-zinc-500 text-center">
                  Featured Partners get dedicated tutorials on this page and inside the main tutorials as well showcasing their product integration with Solana development.
                </p>
              </div>
            )}
          </section>

          {/* Other Tools Section */}
          {otherTools.length > 0 && (
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  Other {category.name}
                </h2>
                <Link href="/partner" className="text-xs text-[#14F195] hover:underline uppercase tracking-wider">
                  Add your tool →
                </Link>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {otherTools.map((tool, idx) => {
                  const isPlaceholder = tool.website === "#" || tool.name.startsWith("Partner Slot");
                  
                  if (isPlaceholder) {
                    return (
                      <div
                        key={idx}
                        className="group rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/30 p-6 transition hover:border-zinc-600"
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-600 text-lg font-bold">
                                {tool.name.split(" ").pop()}
                              </div>
                              <h3 className="text-lg font-semibold text-zinc-500">{tool.name}</h3>
                            </div>
                          </div>
                          <p className="text-sm text-zinc-600">{tool.description}</p>
                          <Link
                            href="/partner"
                            className="inline-flex items-center gap-1 text-xs text-[#14F195] hover:underline"
                          >
                            Claim this slot
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    );
                  }
                  
                  return (
                    <a
                      key={idx}
                      href={tool.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group rounded-2xl border border-white/10 bg-white/2 p-6 transition hover:-translate-y-1 hover:border-white/20"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            {tool.logo ? (
                              <img 
                                src={tool.logo} 
                                alt={`${tool.name} logo`}
                                className="w-10 h-10 rounded-lg object-contain bg-white/5"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-[#14F195]/10 flex items-center justify-center text-[#14F195] text-lg font-bold">
                                {tool.name.charAt(0)}
                              </div>
                            )}
                            <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                          </div>
                          <svg
                            className="w-5 h-5 text-zinc-400 transition group-hover:translate-x-1 group-hover:text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </div>
                        <p className="text-sm text-zinc-400">{tool.description}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="rounded-3xl border border-white/10 bg-linear-to-r from-[#14F195]/5 to-purple-500/5 p-8 text-center">
            <h3 className="text-xl font-semibold text-white">Interested in a Featured Partner slot?</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Reach out to showcase your tool to the Solana developer community.
            </p>
            <Link
              href="/partner"
              className="mt-6 inline-block rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10"
            >
              Learn About Partnership
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ToolCategoryClient;
