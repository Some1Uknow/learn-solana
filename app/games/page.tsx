"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { useWeb3AuthUser } from "@web3auth/modal/react";

interface GameItem {
  id: string;
  title: string;
  description: string;
  goal: string;
  image?: string;
  icon: string;
  category: string;
  difficulty: string;
}

const games: GameItem[] = [
  {
    id: "solana-clicker",
    title: "Solana Clicker",
    description: "Click to mine SOL and upgrade your mining power",
    goal: "Learn about Solana tokenomics while having fun clicking and upgrading",
    icon: "⚡",
    image: "/solanaLogo.png",
    category: "ARCADE",
    difficulty: "BEGINNER",
  },
];

export default function GamesPage() {
  const { userInfo } = useWeb3AuthUser();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<GameItem | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const filteredGames = useMemo(() => {
    const q = query.toLowerCase().trim();
    return games.filter(
      (game) =>
        game.title.toLowerCase().includes(q) ||
        game.description.toLowerCase().includes(q) ||
        game.category.toLowerCase().includes(q)
    );
  }, [query]);

  const handleGameAction = (game: GameItem) => {
    setActive(game);
  };

  const continueGames = filteredGames.slice(0, 2);
  const restGames = filteredGames.slice(2);

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div ref={containerRef}>
          {/* Hero */}
          <div className="mb-10">
            <div className="text-xs tracking-[0.25em] text-zinc-400">
              [GAMES]
            </div>
            <div className="mt-3 space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {userInfo ? (
                  <>
                    Hi {userInfo?.name || "Player"}, choose a game to start
                    playing
                  </>
                ) : (
                  "Choose a game to start playing"
                )}
              </h2>
            </div>
            {/* Controls row */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="relative block w-full sm:max-w-xl">
                <span className="sr-only">Search</span>
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                  🔎
                </div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search by name, category, or difficulty..."
                  className="w-full rounded-xl bg-zinc-900/60 pl-9 pr-3 py-3 text-sm text-zinc-100 outline-none transition focus:bg-zinc-900"
                />
              </label>
              <div className="flex items-center gap-3">
                <button
                  className="rounded-xl bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-900"
                  type="button"
                >
                  All Categories
                </button>
                <div className="flex overflow-hidden rounded-xl bg-zinc-900/60">
                  <button
                    className="px-3 py-3 text-zinc-300 hover:bg-zinc-900"
                    aria-label="Grid view"
                  >
                    ▦
                  </button>
                  <button
                    className="px-3 py-3 text-zinc-300 hover:bg-zinc-900"
                    aria-label="List view"
                  >
                    ≡
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Featured Games */}
          <section aria-labelledby="featured" className="mt-8">
            <h3 id="featured" className="text-lg font-medium text-zinc-200">
              Featured Games
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
              {continueGames.map((game, idx) => (
                <GameCard
                  key={game.id}
                  game={game}
                  index={idx}
                  onPlay={() => handleGameAction(game)}
                  large
                />
              ))}
            </div>
          </section>

          {/* All Games */}
          <section aria-labelledby="all" className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {restGames.map((game, idx) => (
                <GameCard
                  key={game.id}
                  game={game}
                  index={idx + 2}
                  onPlay={() => handleGameAction(game)}
                />
              ))}
            </div>
          </section>

          {/* Immersive Modal */}
          {active && (
            <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
              <button
                aria-label="Close"
                onClick={() => setActive(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
              />
              <div className="fixed inset-0 mx-auto w-full max-w-3xl translate-y-0 p-4 sm:translate-y-4">
                <div className="relative overflow-hidden rounded-2xl bg-[#0f0f12] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                        {active.category}
                      </div>
                      <h3 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100">
                        {active.title}
                      </h3>
                      <p className="mt-1 text-sm text-zinc-400">
                        {active.description}
                      </p>
                    </div>
                    <button
                      onClick={() => setActive(null)}
                      className="rounded-xl bg-white/5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10"
                      aria-label="Close"
                    >
                      Close
                    </button>
                  </div>

                  <div className="mt-5 rounded-xl bg-white/[0.02] p-4">
                    <h4 className="text-sm font-medium text-zinc-200">
                      Game Goal
                    </h4>
                    <p className="mt-1 text-sm text-zinc-400">{active.goal}</p>
                  </div>

                  <div className="mt-6 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">Difficulty:</span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em]",
                          active.difficulty === "BEGINNER" &&
                            "bg-green-500/10 text-green-300",
                          active.difficulty === "INTERMEDIATE" &&
                            "bg-yellow-500/10 text-yellow-300",
                          active.difficulty === "ADVANCED" &&
                            "bg-red-500/10 text-red-300"
                        )}
                      >
                        ● {active.difficulty}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500">Category:</span>
                      <span className="text-xs text-zinc-300">
                        {active.category}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      className="w-full rounded-xl bg-cyan-500 px-6 py-3 text-sm font-medium text-black transition hover:bg-cyan-400"
                      type="button"
                      onClick={() => {
                        console.log(`Starting ${active.title}...`);
                        // Add actual game logic here
                      }}
                    >
                      START GAME →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function GameCard({
  game,
  index,
  large,
  onPlay,
}: {
  game: GameItem;
  index: number;
  large?: boolean;
  onPlay: () => void;
}) {
  const img = game.image || "/placeholder.jpg";
  const category = game.category;

  return (
    <article
      className={cn(
        "relative isolate rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0))] p-5 text-zinc-100 shadow-[0_8px_40px_rgba(0,0,0,0.15),_0_0_0_1px_rgba(255,255,255,0.02)] transition-transform duration-300 hover:-translate-y-1",
        large ? "min-h-[220px]" : "min-h-[220px]"
      )}
    >
      <div className="absolute inset-0 rounded-2xl bg-zinc-950/60" />
      <div className="relative z-10 flex h-full flex-col">
        {/* Top Row: badge */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em]",
              game.difficulty === "BEGINNER" &&
                "bg-green-500/10 text-green-300",
              game.difficulty === "INTERMEDIATE" &&
                "bg-yellow-500/10 text-yellow-300",
              game.difficulty === "ADVANCED" && "bg-red-500/10 text-red-300"
            )}
          >
            ● {game.difficulty}
          </span>
        </div>

        {/* Middle */}
        <div className="mt-4 flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0">
            <Image
              src={img}
              alt="game"
              fill
              sizes="80px"
              className="rounded-xl object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              {category}
            </div>
            <h4 className="mt-1 text-xl font-semibold tracking-tight">
              {game.title}
            </h4>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-auto flex items-center justify-between pt-6">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>{game.icon}</span>
            <span>Play Now</span>
          </div>
          <button
            className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-400"
            type="button"
            onClick={onPlay}
          >
            PLAY →
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </article>
  );
}
