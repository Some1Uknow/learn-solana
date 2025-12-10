"use client";

import Image from "next/image";
import { cn } from "@/lib/cn";

export interface GameItem {
  id: string;
  title: string;
  description: string;
  goal: string;
  image?: string;
  icon: string;
  category: string;
  difficulty: string;
  preGame?: {
    warning?: string;
    controls?: string;
    objective?: string;
    totalLevels?: number;
    notes?: string[];
  };
}

export interface GameCardProps {
  game: GameItem;
  index: number;
  large?: boolean;
  onPlay: () => void;
  completed?: boolean;
  minted?: boolean;
  canClaim?: boolean;
  onClaim?: () => void;
}

export default function GameCard({
  game,
  index,
  large,
  onPlay,
  completed,
  minted,
  canClaim,
  onClaim,
}: GameCardProps) {
  const img = game.image || "/placeholder.jpg";
  const category = game.category;

  // Show proper button state without flickering
  const showClaimButton = completed && canClaim && !minted;
  const showMintedBadge = minted;

  return (
    <article
      className={cn(
        "relative isolate rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0))] p-5 text-zinc-100 shadow-[0_8px_40px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.02)] transition-transform duration-300 hover:-translate-y-1",
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
              game.difficulty === "BEGINNER" && "bg-green-500/10 text-green-300",
              game.difficulty === "INTERMEDIATE" && "bg-yellow-500/10 text-yellow-300",
              game.difficulty === "ADVANCED" && "bg-red-500/10 text-red-300"
            )}
          >
            ● {game.difficulty}
          </span>
        </div>

        {/* Middle */}
        <div className="mt-4 flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0">
            <Image src={img} alt="game" fill sizes="80px" className="rounded-xl object-contain" />
          </div>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">{category}</div>
            <h4 className="mt-1 text-xl font-semibold tracking-tight">{game.title}</h4>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-auto flex items-center justify-between pt-6">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>{game.icon}</span>
            <span>Play Now</span>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-400"
              type="button"
              onClick={onPlay}
            >
              {completed ? "PLAY" : "PLAY →"}
            </button>
            {showClaimButton && (
              <button
                className="rounded-xl bg-purple-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-purple-400"
                type="button"
                onClick={onClaim}
              >
                CLAIM NFT
              </button>
            )}
            {showMintedBadge && (
              <span className="rounded-xl bg-green-600/20 px-3 py-2 text-xs font-medium text-green-400 border border-green-600/30">
                ✓ MINTED
              </span>
            )}
          </div>
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
