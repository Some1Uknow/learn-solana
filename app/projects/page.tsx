"use client";

import { useWeb3AuthUser } from "@web3auth/modal/react";
import { useState } from "react";
import { cn } from "@/lib/cn";

const backgroundStyle = `
  radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
  radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
  radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
  radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
  #000000
`;

const myProjects = [
  {
    id: 1,
    name: "DeFi Lending Platform",
    description: "A decentralized lending platform built on Solana",
    status: "In Progress",
    lastUpdated: "2 days ago",
    technologies: ["Rust", "Anchor", "React"],
    progress: 65,
  },
  {
    id: 2,
    name: "NFT Marketplace",
    description: "Buy and sell NFTs with low transaction fees",
    status: "Completed",
    lastUpdated: "1 week ago",
    technologies: ["Solana Web3.js", "Next.js", "Tailwind"],
    progress: 100,
  },
];

const exploreProjects = [
  {
    id: 1,
    name: "Solana Token Swap",
    description: "Learn to build a token swap interface",
    difficulty: "Beginner",
    duration: "2-3 hours",
    technologies: ["Web3.js", "React"],
    students: 1234,
  },
  {
    id: 2,
    name: "DAO Voting System",
    description: "Create a decentralized voting system",
    difficulty: "Intermediate",
    duration: "4-6 hours",
    technologies: ["Rust", "Anchor"],
    students: 856,
  },
];

export default function ProjectsPage() {
  const { userInfo } = useWeb3AuthUser();
  const [activeTab, setActiveTab] = useState<"my-projects" | "explore">(
    "my-projects"
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0" style={{ background: backgroundStyle }} />

      <div className="relative z-10 flex min-h-screen w-full justify-center px-6 py-16 md:px-10">
        <div className="flex w-full max-w-7xl flex-col gap-12">
          <header className="space-y-8">
            <div className="space-y-4">
              <div className="text-xs tracking-[0.25em] text-zinc-500">[PROJECTS]</div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Build your Solana portfolio with production-ready projects
              </h1>
              <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
                Curated blueprints to help you move from tutorials to shipped experiences.
                Choose from guided builds or launch your own idea with structured support.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              {userInfo ? (
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-5 text-sm text-zinc-300">
                  Welcome back, <span className="text-white">{userInfo.name || "Developer"}</span>. Let&apos;s continue growing your Solana craft.
                </div>
              ) : (
                <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-5 text-sm text-zinc-300">
                  Sign in with Web3Auth to sync your progress and unlock personalized project tracks.
                </div>
              )}

              <button
                onClick={() => setActiveTab("my-projects")}
                className="inline-flex items-center gap-2 rounded-xl border border-[#14F195]/40 bg-[#14F195]/10 px-5 py-3 text-sm font-medium text-[#14F195] transition hover:bg-[#14F195]/20"
              >
                <span aria-hidden>➕</span> New Project Brief
              </button>
            </div>
          </header>

          <nav className="inline-flex w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-1 text-sm">
            {[
              { id: "my-projects", label: "My Playbook" },
              { id: "explore", label: "Explore Blueprints" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "flex-1 rounded-xl px-5 py-2.5 font-medium transition",
                  activeTab === tab.id
                    ? "bg-[#14F195] text-black shadow-[0_12px_45px_rgba(20,241,149,0.35)]"
                    : "text-zinc-400 hover:text-white"
                )}
                type="button"
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {activeTab === "my-projects" ? (
            <section className="space-y-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    Ongoing builds
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Keep momentum with progress dashboards and bite-sized next steps.
                  </p>
                </div>
                <span className="text-xs uppercase tracking-[0.3em] text-[#14F195]/80">
                  ACTIVE {myProjects.length}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {myProjects.map((project) => (
                  <MyProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          ) : (
            <section className="space-y-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                    Blueprint library
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Guided builds with annotated code, devnet deployments, and Solana best practices.
                  </p>
                </div>
                <select
                  className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-zinc-200 hover:border-white/20"
                  title="Filter by difficulty level"
                  aria-label="Filter projects by difficulty level"
                  defaultValue="All Levels"
                >
                  <option>All Levels</option>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {exploreProjects.map((project) => (
                  <ExploreProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

type MyProject = (typeof myProjects)[number];
type ExploreProject = (typeof exploreProjects)[number];

function MyProjectCard({ project }: { project: MyProject }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="relative flex h-full flex-col gap-6">
        <header className="flex items-start justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-zinc-500">{project.status}</div>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
              {project.name}
            </h3>
          </div>
          <span className="rounded-full border border-[#14F195]/20 bg-[#14F195]/10 px-3 py-1 text-xs font-medium text-[#14F195]">
            {project.progress}%
          </span>
        </header>

        <p className="text-sm text-zinc-400">{project.description}</p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Progress</span>
            <span className="text-zinc-300">Updated {project.lastUpdated}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#14F195] via-cyan-400 to-[#14F195] transition-all duration-500"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <footer className="mt-auto flex items-center justify-between pt-2 text-sm">
          <button className="rounded-xl border border-white/10 px-3 py-2 text-zinc-300 transition hover:border-white/30 hover:text-white">
            Review notes
          </button>
          <button className="rounded-xl bg-[#14F195] px-4 py-2 font-medium text-black transition hover:bg-[#12da86]">
            Continue →
          </button>
        </footer>
      </div>
    </article>
  );
}

function ExploreProjectCard({ project }: { project: ExploreProject }) {
  const difficultyTone = {
    Beginner: "from-[#14F195]/30 to-[#14F195]/5 text-[#14F195]",
    Intermediate: "from-cyan-400/30 to-cyan-400/5 text-cyan-200",
    Advanced: "from-purple-400/30 to-purple-400/5 text-purple-200",
  } as const;

  const badgeClass = difficultyTone[project.difficulty as keyof typeof difficultyTone] ??
    "from-white/20 to-white/5 text-white";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="relative flex h-full flex-col gap-6">
        <header className="flex items-start justify-between">
          <span
            className={cn(
              "inline-flex items-center rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]",
              badgeClass
            )}
          >
            {project.difficulty}
          </span>
          <span className="text-xs text-zinc-500">{project.duration}</span>
        </header>

        <div>
          <h3 className="text-lg font-semibold tracking-tight text-white">
            {project.name}
          </h3>
          <p className="mt-2 text-sm text-zinc-400">{project.description}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>

        <footer className="mt-auto flex items-center justify-between pt-2 text-sm text-zinc-400">
          <span>{project.students.toLocaleString()} builders</span>
          <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 font-medium text-white transition hover:border-white/30 hover:bg-white/[0.06]">
            Start build
            <span aria-hidden>→</span>
          </button>
        </footer>
      </div>
    </article>
  );
}
