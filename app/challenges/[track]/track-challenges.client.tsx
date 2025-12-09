"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWeb3Auth } from "@web3auth/modal/react";
import { authFetch } from "@/lib/auth/authFetch";
import { Progress } from "@/components/ui/progress";
import type { ChallengeEntry } from "@/lib/challenges/registry";

type ProgressMap = Record<number, { completedAt: string; attempts: number }>;

const CACHE_KEY_PREFIX = "challenge_progress_";

interface Props {
  track: string;
  trackName: string;
  trackDescription: string;
  challenges: ChallengeEntry[];
}

export default function TrackChallengesClient({
  track,
  trackName,
  trackDescription,
  challenges,
}: Props) {
  const { provider, isConnected } = useWeb3Auth();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [progress, setProgress] = useState<ProgressMap>({});
  const [completedCount, setCompletedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate progress percentage
  const progressPercentage = challenges.length > 0 
    ? Math.round((completedCount / challenges.length) * 100 * 100) / 100
    : 0;

  // Load cached progress immediately on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${track}`);
      if (cached) {
        const { progress: cachedProgress, completedCount: cachedCount, wallet } = JSON.parse(cached);
        // Only use cache if wallet matches or no wallet yet
        if (cachedProgress) {
          setProgress(cachedProgress);
          setCompletedCount(cachedCount || Object.keys(cachedProgress).length);
        }
      }
    } catch {
      // Ignore cache errors
    }
  }, [track]);

  // Fetch wallet address from Web3Auth provider
  useEffect(() => {
    let cancelled = false;
    async function fetchAddress() {
      if (!provider || !isConnected) {
        setWalletAddress(null);
        setIsLoading(false);
        return;
      }
      try {
        const accounts = await provider.request({
          method: "getAccounts",
          params: {},
        });
        const addr = Array.isArray(accounts) ? accounts[0] : accounts;
        if (!cancelled && addr) setWalletAddress(addr);
      } catch (e) {
        console.error("Failed to get wallet address:", e);
      }
      if (!cancelled) setIsLoading(false);
    }
    fetchAddress();
    return () => { cancelled = true; };
  }, [provider, isConnected]);

  // Fetch progress when wallet is available
  useEffect(() => {
    if (!walletAddress) {
      // Clear progress if no wallet but keep loading state handled above
      if (!isConnected) {
        setProgress({});
        setCompletedCount(0);
      }
      return;
    }

    const fetchProgress = async () => {
      try {
        const res = await authFetch(`/api/challenges/progress?track=${track}&wallet=${walletAddress}`);
        if (res.ok) {
          const data = await res.json();
          const newProgress = data.progress || {};
          const newCount = data.completedCount || 0;
          setProgress(newProgress);
          setCompletedCount(newCount);
          
          // Cache the progress for instant display next time
          try {
            localStorage.setItem(`${CACHE_KEY_PREFIX}${track}`, JSON.stringify({
              progress: newProgress,
              completedCount: newCount,
              wallet: walletAddress,
              timestamp: Date.now(),
            }));
          } catch {
            // Ignore storage errors
          }
        }
      } catch (e) {
        console.error("Failed to fetch progress:", e);
      }
    };

    fetchProgress();
  }, [walletAddress, track, isConnected]);

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
              {trackName}
            </h1>
            <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
              {trackDescription}
            </p>

            {/* Progress Bar */}
            {isConnected && (
              <div className="max-w-md space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Your Progress</span>
                  <span className="font-mono text-emerald-400">
                    {completedCount}/{challenges.length} ({progressPercentage}%)
                  </span>
                </div>
                <Progress 
                  value={progressPercentage} 
                  className="h-2 bg-white/5"
                />
                {completedCount === challenges.length && challenges.length > 0 && (
                  <p className="text-xs text-emerald-400">
                    🎉 All challenges completed!
                  </p>
                )}
              </div>
            )}

            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span>{challenges.length} challenges</span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500/50" /> Easy
                <span className="ml-2 h-2 w-2 rounded-full bg-amber-500/50" /> Medium
                <span className="ml-2 h-2 w-2 rounded-full bg-red-500/50" /> Hard
              </span>
            </div>
          </header>

          {/* Challenge Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge) => {
              const isCompleted = Boolean(progress[challenge.id]);

              return (
                <Link
                  key={challenge.id}
                  href={`/challenges/${track}/${challenge.id}`}
                  className={`group relative overflow-hidden rounded-2xl border p-6 transition hover:border-white/10 hover:bg-white/[0.04] ${
                    isCompleted
                      ? "border-emerald-500/20 bg-emerald-500/[0.03]"
                      : "border-white/5 bg-white/[0.02]"
                  }`}
                >
                  {/* Completed checkmark overlay */}
                  {isCompleted && (
                    <div className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}

                  {/* Hover gradient */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                  <div className="relative space-y-4">
                    {/* Challenge number and difficulty */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-2xl font-bold transition ${
                          isCompleted
                            ? "text-emerald-500/60 group-hover:text-emerald-500/80"
                            : "text-zinc-600 group-hover:text-zinc-500"
                        }`}
                      >
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
                    <h3
                      className={`text-base font-medium transition line-clamp-2 ${
                        isCompleted
                          ? "text-emerald-200 group-hover:text-emerald-100"
                          : "text-white group-hover:text-cyan-200"
                      }`}
                    >
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

                    {/* Start/Review indicator */}
                    <div className="flex items-center justify-end pt-2">
                      <span
                        className={`flex items-center gap-1.5 text-xs transition ${
                          isCompleted
                            ? "text-emerald-400 group-hover:text-emerald-300"
                            : "text-zinc-500 group-hover:text-cyan-300"
                        }`}
                      >
                        {isCompleted ? "Review" : "Start"}
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
              );
            })}
          </div>

          {/* Footer */}
          <footer className="pb-8 pt-4 text-center text-xs text-zinc-500">
            Keep coding to unlock more achievements!
          </footer>
        </div>
      </div>
    </div>
  );
}
