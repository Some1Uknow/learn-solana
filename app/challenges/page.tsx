"use client";

import { useWeb3AuthUser } from "@web3auth/modal/react";

const backgroundStyle = `
  radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
  radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
  radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
  radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
  #000000
`;

const challengeTracks = [
  {
    id: "defi-vaults",
    title: "DeFi Liquidity Reactor",
    blurb:
      "Ship a composable lending vault with risk controls, metrics dashboards, and automated liquidations.",
    reward: "1,500 USDC + Solana Camp badge",
    sponsor: "Hubble Protocol",
    deadline: "Due Oct 12",
    difficulty: "Advanced",
    tags: ["Rust", "Anchor", "DeFi"],
  },
  {
    id: "dao-votes",
    title: "On-chain Governance Sprint",
    blurb:
      "Design a DAO voting flow with proposal execution on devnet. Include treasurer safeguards and analytics.",
    reward: "Mentorship + 800 USDC grant",
    sponsor: "Realms",
    deadline: "Due Oct 5",
    difficulty: "Intermediate",
    tags: ["Realms", "Anchor", "Governance"],
  },
  {
    id: "nft-adventures",
    title: "Dynamic NFT Questline",
    blurb:
      "Create a quest engine that mints dynamic NFTs using Metaplex. Track progression and rarity unlocks.",
    reward: "Metaplex swag + 600 USDC",
    sponsor: "Metaplex",
    deadline: "Due Sep 28",
    difficulty: "Beginner",
    tags: ["Metaplex", "TypeScript", "Next.js"],
  },
];

const supportTracks = [
  {
    id: "office-hours",
    title: "Builder office hours",
    summary: "Weekly AMAs with core teams. Get feedback on architecture and deployment plans.",
    schedule: "Tuesdays · 17:00 UTC",
  },
  {
    id: "code-review",
    title: "Async code reviews",
    summary: "Submit PRs for structured feedback from maintainers and mentors.",
    schedule: "48h turnaround",
  },
  {
    id: "ecosystem-drops",
    title: "Ecosystem drops",
    summary: "Collect challenge-specific NFTs and gear to showcase your Solana chops.",
    schedule: "Rolling",
  },
];

export default function ChallengesPage() {
  const { userInfo } = useWeb3AuthUser();

  const handleAction = (label: string, challengeTitle: string) => {
    console.log(`${label} for ${challengeTitle}`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0" style={{ background: backgroundStyle }} />

      <div className="relative z-10 flex min-h-screen w-full justify-center px-6 py-16 md:px-10">
        <div className="flex w-full max-w-7xl flex-col gap-14">
          <header className="space-y-10">
            <div className="space-y-4">
              <div className="text-xs tracking-[0.25em] text-zinc-500">[CHALLENGES]</div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Ship production-ready Solana challenges and earn ecosystem rewards
              </h1>
              <p className="max-w-3xl text-sm text-zinc-400 sm:text-base">
                Weekly sprints from ecosystem teams to help you build in public. Complete quests, collect badges,
                and unlock exclusive mentorship.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-5 text-sm text-zinc-300">
                {userInfo ? (
                  <>
                    Hey {userInfo.name || "builder"}, your progress log is synced. Jump into a sprint and keep shipping.
                  </>
                ) : (
                  <>Connect with Web3Auth to save progress, claim rewards, and join private mentor sessions.</>
                )}
              </div>
              <button
                onClick={() => handleAction("Join waitlist", "challenge-updates")}
                className="inline-flex items-center gap-2 rounded-xl border border-[#14F195]/40 bg-[#14F195]/10 px-5 py-3 text-sm font-medium text-[#14F195] transition hover:bg-[#14F195]/20"
              >
                <span aria-hidden>★</span> Get challenge alerts
              </button>
            </div>
          </header>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr,1fr]">
            <article className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 shadow-[0_45px_120px_rgba(0,0,0,0.55)] backdrop-blur-md transition">
              <div className="absolute inset-0 bg-gradient-to-br from-[#14F195]/10 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="relative flex flex-col gap-6">
                <span className="inline-flex items-center gap-2 self-start rounded-full border border-[#14F195]/30 bg-[#14F195]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.3em] text-[#14F195]">
                  Live sprint
                </span>
                <div className="space-y-3">
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    Solana Global Builder League · Season 2
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Pair up with ecosystem mentors, receive weekly quests, and demo your build in the finale showcase.
                    Submit by October 24 to qualify for devnet funding.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
                  <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">Up to 5k USDC</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">Mentor office hours</span>
                  <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">NFT badge</span>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-sm text-zinc-400">
                    <span className="text-zinc-200">Registrations close:</span> Oct 10 · 18:00 UTC
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAction("View brief", "Solana Global Builder League")}
                      className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/[0.05]"
                    >
                      View brief
                    </button>
                    <button
                      onClick={() => handleAction("Apply", "Solana Global Builder League")}
                      className="rounded-xl bg-[#14F195] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#12da86]"
                    >
                      Apply now →
                    </button>
                  </div>
                </div>
              </div>
            </article>

            <aside className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-white/[0.02] p-6 shadow-[0_35px_90px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <h3 className="text-lg font-semibold tracking-tight text-white">Support stack</h3>
              <div className="space-y-4 text-sm text-zinc-400">
                {supportTracks.map((track) => (
                  <div key={track.id} className="rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3">
                    <div className="text-xs uppercase tracking-[0.25em] text-zinc-500">{track.schedule}</div>
                    <div className="mt-1 text-base font-medium text-white">{track.title}</div>
                    <p className="mt-1 text-xs text-zinc-400">{track.summary}</p>
                  </div>
                ))}
              </div>
            </aside>
          </section>

          <section className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  Featured quests
                </h2>
                <p className="text-sm text-zinc-400">
                  Pick a brief, read the success rubric, and deploy to devnet with confidence.
                </p>
              </div>
              <button
                onClick={() => handleAction("Download", "challenge-starter-kit")}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/[0.06]"
              >
                Starter kit PDF
                <span aria-hidden>↓</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {challengeTracks.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onAction={handleAction}
                />
              ))}
            </div>
          </section>

          <footer className="rounded-3xl border border-white/5 bg-white/[0.02] p-8 text-center text-sm text-zinc-300">
            <h3 className="text-2xl font-semibold tracking-tight text-white">
              Have a challenge idea for learn.sol?
            </h3>
            <p className="mt-3 max-w-2xl mx-auto">
              Partner with us to launch quests for your protocol. We handle curriculum, vetting, and delivery so
              you can focus on supporting winners.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => handleAction("Partner", "challenge-sponsor")}
                className="rounded-xl bg-[#14F195] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#12da86]"
              >
                Sponsor a quest
              </button>
              <button
                onClick={() => handleAction("Contact", "challenge-team")}
                className="rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 text-sm text-white transition hover:border-white/30 hover:bg-white/[0.06]"
              >
                Talk to the team →
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

type Challenge = (typeof challengeTracks)[number];

function ChallengeCard({
  challenge,
  onAction,
}: {
  challenge: Challenge;
  onAction: (label: string, title: string) => void;
}) {
  const difficultyTone = {
    Beginner: "from-[#14F195]/25 to-[#14F195]/5 text-[#14F195]",
    Intermediate: "from-cyan-400/25 to-cyan-400/5 text-cyan-200",
    Advanced: "from-purple-400/25 to-purple-400/5 text-purple-200",
  } as const;

  const badgeClass =
    difficultyTone[challenge.difficulty as keyof typeof difficultyTone] ??
    "from-white/20 to-white/5 text-white";

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-6 shadow-[0_35px_90px_rgba(0,0,0,0.5)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/10">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition group-hover:opacity-100" />

      <div className="relative flex h-full flex-col gap-5">
        <header className="flex items-start justify-between">
          <span className={`inline-flex items-center rounded-full bg-gradient-to-r px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${badgeClass}`}>
            {challenge.difficulty}
          </span>
          <span className="text-xs text-zinc-500">{challenge.deadline}</span>
        </header>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold tracking-tight text-white">
            {challenge.title}
          </h3>
          <p className="text-sm text-zinc-400">{challenge.blurb}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-zinc-300">
          <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">{challenge.reward}</span>
          <span className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1">{challenge.sponsor}</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {challenge.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 text-xs text-zinc-300"
            >
              {tag}
            </span>
          ))}
        </div>

        <footer className="mt-auto flex items-center justify-between pt-3 text-sm">
          <button
            onClick={() => onAction("View rubric", challenge.title)}
            className="rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2 text-zinc-300 transition hover:border-white/30 hover:text-white"
          >
            Rubric
          </button>
          <button
            onClick={() => onAction("Start", challenge.title)}
            className="rounded-xl bg-[#14F195] px-4 py-2 font-semibold text-black transition hover:bg-[#12da86]"
          >
            Start quest →
          </button>
        </footer>
      </div>
    </article>
  );
}
