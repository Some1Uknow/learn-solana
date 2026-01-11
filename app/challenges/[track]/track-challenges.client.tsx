"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useWeb3Auth } from "@web3auth/modal/react";
import { authFetch } from "@/lib/auth/authFetch";
import { Progress } from "@/components/ui/progress";
import { BlurFade } from "@/components/ui/blur-fade";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { LoginRequiredModal } from "@/components/ui/login-required-modal";
import { useLoginGate } from "@/hooks/use-login-gate";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { requireLogin, showModal, setShowModal } = useLoginGate();
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

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Easy":
        return "border-[#14f195]/30 bg-[#14f195]/10 text-[#14f195]";
      case "Medium":
        return "border-amber-500/30 bg-amber-500/10 text-amber-300";
      case "Hard":
        return "border-[#9945ff]/30 bg-[#9945ff]/10 text-[#9945ff]";
      default:
        return "border-zinc-500/30 bg-zinc-500/10 text-zinc-300";
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fixed gradient background - Progress/Journey theme */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(circle 450px at 10% 20%, rgba(20, 241, 149, 0.14), transparent),
            radial-gradient(circle 400px at 90% 15%, rgba(153, 69, 255, 0.16), transparent),
            radial-gradient(circle 350px at 75% 70%, rgba(20, 241, 149, 0.1), transparent),
            radial-gradient(circle 300px at 25% 85%, rgba(153, 69, 255, 0.08), transparent),
            radial-gradient(ellipse 80% 40% at 50% 50%, rgba(99, 102, 241, 0.04), transparent),
            #000000
          `,
        }}
      />
      <div className="relative z-10 flex min-h-screen w-full justify-center px-6 py-16 md:px-10 text-white">
        <div className="flex w-full max-w-5xl flex-col gap-10">
          {/* Back navigation */}
          <BlurFade delay={0} duration={0.4}>
            <Link
              href="/challenges"
              className="group inline-flex w-fit items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
            >
              <motion.svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="transition"
                whileHover={{ x: -4 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <path
                  d="M10 6l-6 6 6 6M4 12h16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
              Back to Challenges
            </Link>
          </BlurFade>

          {/* Header */}
          <header className="space-y-4">
            <BlurFade delay={0.1} duration={0.5}>
              <div className="text-xs tracking-[0.25em] text-[#14f195]/70 font-medium">
                [{track.toUpperCase()} CHALLENGES]
              </div>
            </BlurFade>
            <BlurFade delay={0.2} duration={0.5}>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                <AnimatedShinyText className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {trackName}
                </AnimatedShinyText>
              </h1>
            </BlurFade>
            <BlurFade delay={0.3} duration={0.5}>
              <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
                {trackDescription}
              </p>
            </BlurFade>

            {/* Progress Bar */}
            <AnimatePresence mode="wait">
              {isConnected && (
                <BlurFade delay={0.4} duration={0.5}>
                  <motion.div
                    className="max-w-md space-y-2 pt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-zinc-400">Your Progress</span>
                      <span className="font-mono text-[#14f195]">
                        {completedCount}/{challenges.length} (<NumberTicker value={progressPercentage} decimalPlaces={2} />%)
                      </span>
                    </div>
                    <Progress
                      value={progressPercentage}
                      className="h-2 bg-white/5"
                    />
                    {completedCount === challenges.length && challenges.length > 0 && (
                      <motion.p
                        className="text-xs text-[#14f195]"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      >
                        🎉 All challenges completed!
                      </motion.p>
                    )}
                  </motion.div>
                </BlurFade>
              )}
            </AnimatePresence>

            <BlurFade delay={0.5} duration={0.5}>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span>{challenges.length} challenges</span>
                <span>•</span>
                <span className="flex items-center gap-2">
                  <motion.span
                    className="h-2 w-2 rounded-full bg-[#14f195]/50"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  /> Easy
                  <motion.span
                    className="ml-2 h-2 w-2 rounded-full bg-amber-500/50"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 0.3 }}
                  /> Medium
                  <motion.span
                    className="ml-2 h-2 w-2 rounded-full bg-[#9945ff]/50"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 0.6 }}
                  /> Hard
                </span>
              </div>
            </BlurFade>
          </header>

          {/* Challenge Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {challenges.map((challenge, index) => {
              const isCompleted = Boolean(progress[challenge.id]);

              return (
                <BlurFade key={challenge.id} delay={0.6 + index * 0.05} duration={0.4} inView inViewMargin="-100px">
                  <motion.div
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >

                    <div
                      onClick={() => requireLogin(() => router.push(`/challenges/${track}/${challenge.id}`))}
                      className={`group relative overflow-hidden rounded-2xl border p-6 transition block hover:border-[#14f195]/30 hover:bg-white/[0.04] cursor-pointer ${isCompleted
                        ? "border-[#14f195]/20 bg-[#14f195]/[0.03]"
                        : "border-white/5 bg-white/[0.02]"
                        }`}
                    >
                      {/* Completed checkmark overlay */}
                      <AnimatePresence>
                        {isCompleted && (
                          <motion.div
                            className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#14f195]/20 text-[#14f195]"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                          >
                            <motion.svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              initial={{ pathLength: 0 }}
                              animate={{ pathLength: 1 }}
                              transition={{ duration: 0.3, delay: 0.2 }}
                            >
                              <motion.polyline points="20 6 9 17 4 12" />
                            </motion.svg>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Hover gradient */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                      <div className="relative space-y-4">
                        {/* Challenge number and difficulty */}
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-2xl font-bold transition ${isCompleted
                              ? "text-[#14f195]/60 group-hover:text-[#14f195]/80"
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
                          className={`text-base font-medium transition line-clamp-2 ${isCompleted
                            ? "text-[#14f195]/90 group-hover:text-[#14f195]"
                            : "text-white group-hover:text-[#14f195]/80"
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
                            className={`flex items-center gap-1.5 text-xs transition ${isCompleted
                              ? "text-[#14f195] group-hover:text-[#14f195]/80"
                              : "text-zinc-500 group-hover:text-[#14f195]"
                              }`}
                          >
                            {isCompleted ? "Review" : "Start"}
                            <motion.svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="transition"
                              animate={{ x: [0, 4, 0] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                repeatDelay: 0.5,
                                ease: "easeInOut"
                              }}
                            >
                              <path
                                d="M14 6l6 6-6 6M20 12H4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </motion.svg>
                          </span>
                        </div>
                      </div>

                    </div>

                  </motion.div>
                </BlurFade>
              );
            })}
          </div>

          {/* Footer */}
          <BlurFade delay={0.8} duration={0.5}>
            <footer className="pb-8 pt-4 text-center text-xs text-zinc-500">
              Keep coding to unlock more achievements!
            </footer>
          </BlurFade>
        </div >
      </div >


      <LoginRequiredModal
        open={showModal}
        onOpenChange={setShowModal}
        title="Challenge Locked"
        description="Connect your wallet to access this challenge and track your learning progress."
      />
    </div >
  );
}
