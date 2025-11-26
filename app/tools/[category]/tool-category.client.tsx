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
          </header>

          {/* Featured Tool Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Featured Partner
              </h2>
              <span className="inline-flex items-center rounded-full border border-[#14F195]/30 bg-[#14F195]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#14F195]">
                Sponsored
              </span>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/2 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.5)] backdrop-blur-md md:p-10">
              <div className="absolute inset-0 bg-linear-to-br from-[#14F195]/5 via-transparent to-purple-500/5" />
              
              <div className="relative grid gap-8 lg:grid-cols-2">
                {/* Left: Tool Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center">
                      {featuredTool.logo?.startsWith('http') ? (
                        <img 
                          src={featuredTool.logo} 
                          alt={`${featuredTool.name} logo`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-4xl">{featuredTool.logo}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{featuredTool.name}</h3>
                      <a
                        href={featuredTool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#14F195] hover:underline"
                      >
                        {featuredTool.website}
                      </a>
                    </div>
                  </div>

                  <p className="text-zinc-300">{featuredTool.description}</p>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                      Key Features
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

                  <a
                    href={featuredTool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#14F195] bg-[#14F195]/10 px-6 py-3 font-medium text-[#14F195] transition hover:bg-[#14F195]/20"
                  >
                    Get Started with {featuredTool.name}
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>

                {/* Right: Stats */}
                <div className="flex flex-col justify-center space-y-4">
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
                    Performance Stats
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                    {featuredTool.stats.map((stat, idx) => (
                      <div
                        key={idx}
                        className="rounded-2xl border border-white/10 bg-white/2 p-6 text-center"
                      >
                        <div className="text-3xl font-bold text-white">{stat.value}</div>
                        <div className="mt-1 text-sm text-zinc-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Projects Built With Section */}
          {projectsBuiltWith.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Projects Built with {featuredTool.name}
              </h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projectsBuiltWith.map((project, idx) => (
                  <div
                    key={idx}
                    className="group rounded-2xl border border-white/5 bg-white/2 p-6 transition hover:-translate-y-1 hover:border-white/10"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                        <span className="rounded-full border border-white/10 bg-white/2 px-2.5 py-0.5 text-xs text-zinc-300">
                          {project.category}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-400">{project.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Other Tools Section */}
          {otherTools.length > 0 && (
            <section className="space-y-6">
              <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Other {category.name}
              </h2>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {otherTools.map((tool, idx) => (
                  <a
                    key={idx}
                    href={tool.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-white/5 bg-white/2 p-6 transition hover:-translate-y-1 hover:border-white/10"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
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
                ))}
              </div>
            </section>
          )}

          {/* CTA Section */}
          <section className="rounded-3xl border border-white/10 bg-linear-to-r from-[#14F195]/5 to-purple-500/5 p-8 text-center">
            <h3 className="text-xl font-semibold text-white">Want to be featured here?</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Reach out to showcase your tool to the Solana developer community.
            </p>
            <button className="mt-6 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-medium text-white transition hover:bg-white/10">
              Contact Us
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ToolCategoryClient;
