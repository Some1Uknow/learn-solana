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
        "group relative isolate rounded-2xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-transparent p-5 text-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:border-[#14f195]/30 hover:shadow-[0_0_30px_rgba(20,241,149,0.1)]",
        large ? "min-h-[220px]" : "min-h-[220px]"
      )}
    >
      <div className="absolute inset-0 rounded-2xl bg-black/40 backdrop-blur-sm" />
      <div className="relative z-10 flex h-full flex-col">
        {/* Top Row: badge */}
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em]",
              game.difficulty === "BEGINNER" && "bg-[#14f195]/10 text-[#14f195]",
              game.difficulty === "INTERMEDIATE" && "bg-yellow-500/10 text-yellow-400",
              game.difficulty === "ADVANCED" && "bg-[#9945ff]/10 text-[#9945ff]"
            )}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {game.difficulty}
          </span>
        </div>

        {/* Middle */}
        <div className="mt-4 flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0">
            <Image src={img} alt={`${game.title} - ${game.category} game thumbnail`} fill sizes="80px" className="rounded-xl object-contain" />
          </div>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">{category}</div>
            <h4 className="mt-1 text-xl font-semibold tracking-tight text-white">{game.title}</h4>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-auto flex items-center justify-between pt-6">
          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>{game.icon}</span>
            <span>Play Now</span>
          </div>
          <div className="flex gap-2">
            <button
              className="rounded-xl bg-[#14f195] px-4 py-2 text-sm font-medium text-black transition hover:bg-[#14f195]/90 hover:shadow-[0_0_20px_rgba(20,241,149,0.3)]"
              type="button"
              onClick={onPlay}
            >
              {completed ? "PLAY" : "PLAY →"}
            </button>
            {showClaimButton && (
              <button
                className="rounded-xl bg-[#9945ff] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#9945ff]/90 hover:shadow-[0_0_20px_rgba(153,69,255,0.3)]"
                type="button"
                onClick={onClaim}
              >
                CLAIM NFT
              </button>
            )}
            {showMintedBadge && (
              <span className="rounded-xl bg-[#14f195]/10 px-3 py-2 text-xs font-medium text-[#14f195] border border-[#14f195]/30">
                ✓ MINTED
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
