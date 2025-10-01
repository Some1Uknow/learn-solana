"use client";

import { useWeb3AuthUser } from "@web3auth/modal/react";


const backgroundStyle = `
  radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
  radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
  radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
  radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
  #000000
`;

// Basic placeholder project ideas (initial curriculum seed)
const basicProjects = [
  {
    id: 1,
    name: "SPL Token Creator",
    description: "Mint your own fungible token and display supply + holder balances.",
    difficulty: "Beginner",
    technologies: ["Solana Web3.js", "Next.js"],
  },
  {
    id: 2,
    name: "Airdrop Faucet",
    description: "Request devnet SOL & custom token drops with simple rate limiting.",
    difficulty: "Beginner",
    technologies: ["Web3.js", "Tailwind"],
  },
  {
    id: 3,
    name: "NFT Mint Station",
    description: "Upload art + metadata and mint a limited collection via Metaplex.",
    difficulty: "Intermediate",
    technologies: ["Metaplex", "React"],
  },
  {
    id: 4,
    name: "On‑Chain Voting DApp",
    description: "Submit proposals & cast token‑weighted votes using PDA accounts.",
    difficulty: "Intermediate",
    technologies: ["Rust", "Anchor"],
  },
  {
    id: 5,
    name: "Portfolio Dashboard",
    description: "Aggregate token balances & recent transactions for a wallet.",
    difficulty: "Intermediate",
    technologies: ["Web3.js", "Charting"],
  },
  {
    id: 6,
    name: "Micro Escrow Service",
    description: "Lock tokens until a condition is met, then release to the counterparty.",
    difficulty: "Advanced",
    technologies: ["Rust", "Anchor"],
  },
];

export default function ProjectsPage() {
  const { userInfo } = useWeb3AuthUser();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0" style={{ background: backgroundStyle }} />

      <div className="relative z-10 flex min-h-screen w-full justify-center px-6 py-16 md:px-10">
        <div className="flex w-full max-w-7xl flex-col gap-12">
          <header className="space-y-8">
            <div className="space-y-4">
              <div className="text-xs tracking-[0.25em] text-zinc-500">[PROJECTS]</div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Build your Solana portfolio with focused, practical projects
              </h1>
              <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
                A starter set of core builds every Solana developer should complete. Full guided
                walkthroughs, code annotations, and deployment steps are coming soon.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-5 text-sm text-zinc-300">
                {userInfo ? (
                  <>Welcome back, <span className="text-white">{userInfo.name || "Developer"}</span>. Trackable progress + templates are on the way.</>
                ) : (
                  <>Sign in with Web3Auth to save progress once project tracking launches.</>
                )}
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-sm text-zinc-400">
                Project creation tools <span className="text-white">Coming Soon</span>
              </div>
            </div>
          </header>
          <section className="space-y-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  Core project blueprints
                </h2>
                <p className="text-sm text-zinc-400">
                  These foundational builds will ship with full lessons, diagrams & code reviews soon.
                </p>
              </div>
              <span className="rounded-full border border-[#14F195]/30 bg-[#14F195]/10 px-4 py-1 text-xs font-medium tracking-[0.25em] text-[#14F195]">
                ROADMAP
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {basicProjects.map((project) => (
                <BasicProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
type BasicProject = (typeof basicProjects)[number];

function BasicProjectCard({ project }: { project: BasicProject }) {
  const toneMap = {
    Beginner: "from-[#14F195]/30 to-[#14F195]/5 text-[#14F195]",
    Intermediate: "from-cyan-400/30 to-cyan-400/5 text-cyan-200",
    Advanced: "from-purple-400/30 to-purple-400/5 text-purple-200",
  } as const;

  const badgeClass = toneMap[project.difficulty as keyof typeof toneMap] ?? "from-white/20 to-white/5 text-white";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition group-hover:opacity-100" />
      <div className="relative flex h-full flex-col gap-6">
        <header className="flex items-start justify-between">
          <span className={`inline-flex items-center rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${badgeClass}`}>
            {project.difficulty}
          </span>
        </header>
        <div>
          <h3 className="text-lg font-semibold tracking-tight text-white">{project.name}</h3>
          <p className="mt-2 text-sm text-zinc-400">{project.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span key={tech} className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-zinc-300">
              {tech}
            </span>
          ))}
        </div>
        <footer className="mt-auto flex items-center justify-end pt-2 text-sm">
          <button disabled className="rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2 font-medium text-zinc-300 transition">
            Coming Soon
          </button>
        </footer>
      </div>
    </article>
  );
}
