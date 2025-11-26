import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { challenges, type TrackId } from "@/lib/challenges/registry";

type Params = { track: string };

const trackMeta: Record<
  TrackId,
  {
    name: string;
    description: string;
  }
> = {
  rust: {
    name: "30 Days of Rust",
    description:
      "Progressive daily Rust coding series—foundations → ownership depth → algorithms & concurrency → Solana program primitives.",
  },
  anchor: {
    name: "Anchor Deep Dive",
    description:
      "Master the Anchor framework for building secure and efficient Solana programs.",
  },
};

export function generateMetadata({ params }: { params: Params }): Metadata {
  const track = params.track as TrackId;
  const meta = trackMeta[track];
  if (!meta) return { title: "Challenges" };
  return {
    title: `${meta.name} - All Challenges`,
    description: meta.description,
  };
}

export default function TrackChallengesPage({ params }: { params: Params }) {
  const track = params.track as TrackId;
  const meta = trackMeta[track];

  if (!meta) return notFound();

  const trackChallenges = challenges.filter((c) => c.track === track);

  if (trackChallenges.length === 0) return notFound();

  const backgroundStyle = `
    radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.12), transparent 50%),
    radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.10), transparent 60%),
    radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.14), transparent 65%),
    radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.06), transparent 40%),
    #000000
  `;

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Easy":
        return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
      case "Medium":
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
      case "Hard":
        return "border-red-500/30 bg-red-500/10 text-red-300";
      default:
        return "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0" style={{ background: backgroundStyle }} />
      <div className="relative z-10 flex min-h-screen w-full justify-center px-6 py-16 md:px-10">
        <div className="flex w-full max-w-5xl flex-col gap-10">
          {/* Back navigation */}
          <Link
            href="/challenges"
            className="group inline-flex w-fit items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="transition group-hover:-translate-x-1"
            >
              <path
                d="M10 6l-6 6 6 6M4 12h16"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Challenges
          </Link>

          {/* Header */}
          <header className="space-y-4">
            <div className="text-xs tracking-[0.25em] text-zinc-500">
              [{track.toUpperCase()} CHALLENGES]
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {meta.name}
            </h1>
            <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
              {meta.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span>{trackChallenges.length} challenges</span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500/50" /> Easy
                <span className="h-2 w-2 rounded-full bg-amber-500/50 ml-2" /> Medium
                <span className="h-2 w-2 rounded-full bg-red-500/50 ml-2" /> Hard
              </span>
            </div>
          </header>

          {/* Challenge Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trackChallenges.map((challenge) => (
              <Link
                key={challenge.id}
                href={`/challenges/${track}/${challenge.id}`}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition hover:border-white/10 hover:bg-white/[0.04]"
              >
                {/* Hover gradient */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                <div className="relative space-y-4">
                  {/* Challenge number and difficulty */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-zinc-600 group-hover:text-zinc-500 transition">
                      #{challenge.id}
                    </span>
                    {challenge.difficulty && (
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${getDifficultyColor(
                          challenge.difficulty
                        )}`}
                      >
                        {challenge.difficulty}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-medium text-white group-hover:text-cyan-200 transition line-clamp-2">
                    {challenge.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-zinc-500 line-clamp-2">
                    {challenge.description}
                  </p>

                  {/* Tags */}
                  {challenge.tags && challenge.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {challenge.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-white/5 bg-white/5 px-2 py-0.5 text-[10px] text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                      {challenge.tags.length > 3 && (
                        <span className="text-[10px] text-zinc-600">
                          +{challenge.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Start indicator */}
                  <div className="flex items-center justify-end pt-2">
                    <span className="flex items-center gap-1.5 text-xs text-zinc-500 group-hover:text-cyan-300 transition">
                      Start
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="transition group-hover:translate-x-0.5"
                      >
                        <path
                          d="M14 6l6 6-6 6M20 12H4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <footer className="pb-8 pt-4 text-center text-xs text-zinc-500">
            More challenges will be added as you progress. Keep coding!
          </footer>
        </div>
      </div>
    </div>
  );
}
