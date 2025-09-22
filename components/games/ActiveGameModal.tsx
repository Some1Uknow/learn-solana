"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/cn";
import { GameItem } from "./GameCard";

const SolanaClickerGame = dynamic(() => import("@/components/games/SolanaClickerGame"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center text-zinc-400">Loading game...</div>
  ),
});

export interface ActiveGameModalProps {
  active: GameItem;
  onClose: () => void;
  gameStarted: boolean;
  setGameStarted: (v: boolean) => void;
  completed: boolean;
  mintAddress?: string;
  onClaimClick: () => void;
  onMarkCompleted: (gameId: string) => void;
}

export default function ActiveGameModal({
  active,
  onClose,
  gameStarted,
  setGameStarted,
  completed,
  mintAddress,
  onClaimClick,
  onMarkCompleted,
}: ActiveGameModalProps) {
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
      <button
        aria-label="Close"
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
      />
      <div className="fixed inset-0 mx-auto w-full max-w-4xl translate-y-0 p-4 sm:translate-y-4">
        <div className="relative overflow-hidden rounded-2xl bg-[#0f0f12] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
          {gameStarted ? (
            <div className="h-[600px]">
              <SolanaClickerGame
                onGameComplete={() => {
                  setGameStarted(false);
                  onMarkCompleted(active.id);
                }}
              />
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">{active.category}</div>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100">{active.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{active.description}</p>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-xl bg-white/5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10"
                  aria-label="Close"
                >
                  Close
                </button>
              </div>

              <div className="mt-5 rounded-xl bg-white/[0.02] p-4">
                <h4 className="text-sm font-medium text-zinc-200">Game Goal</h4>
                <p className="mt-1 text-sm text-zinc-400">{active.goal}</p>
              </div>

              <div className="mt-6 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">Difficulty:</span>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em]",
                      active.difficulty === "BEGINNER" && "bg-green-500/10 text-green-300",
                      active.difficulty === "INTERMEDIATE" && "bg-yellow-500/10 text-yellow-300",
                      active.difficulty === "ADVANCED" && "bg-red-500/10 text-red-300"
                    )}
                  >
                    ● {active.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-500">Category:</span>
                  <span className="text-xs text-zinc-300">{active.category}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  className="w-full rounded-xl bg-cyan-500 px-6 py-3 text-sm font-medium text-black transition hover:bg-cyan-400"
                  type="button"
                  onClick={() => setGameStarted(true)}
                >
                  {completed ? "PLAY AGAIN" : "START GAME →"}
                </button>
                {completed && !mintAddress && (
                  <button
                    className="w-full rounded-xl bg-purple-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-purple-400"
                    type="button"
                    onClick={onClaimClick}
                  >
                    CLAIM NFT REWARD
                  </button>
                )}
                {mintAddress && (
                  <a
                    href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full rounded-xl bg-green-600 px-6 py-3 text-sm font-medium text-white text-center hover:bg-green-500"
                  >
                    VIEW NFT →
                  </a>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
