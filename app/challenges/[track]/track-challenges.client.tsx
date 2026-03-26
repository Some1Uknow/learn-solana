"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useWeb3Auth } from "@/hooks/use-web3-auth";
import { authFetch } from "@/lib/auth/authFetch";
import { Progress } from "@/components/ui/progress";
import { LoginRequiredModal } from "@/components/ui/login-required-modal";
import { useLoginGate } from "@/hooks/use-login-gate";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";
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
  const { isConnected, walletAddress, sessionReady } = useWeb3Auth();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [completedCount, setCompletedCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Calculate progress percentage
  const progressPercentage = challenges.length > 0
    ? Math.round((completedCount / challenges.length) * 100)
    : 0;

  // Load cached progress immediately on mount
  useEffect(() => {
    try {
      const cached = localStorage.getItem(`${CACHE_KEY_PREFIX}${track}`);
      if (cached) {
        const { progress: cachedProgress, completedCount: cachedCount } = JSON.parse(cached);
        if (cachedProgress) {
          setProgress(cachedProgress);
          setCompletedCount(cachedCount || Object.keys(cachedProgress).length);
        }
      }
    } catch {
      // Ignore cache errors
    }
  }, [track]);

  useEffect(() => {
    if (!sessionReady) return;
    setIsLoading(false);
  }, [sessionReady]);

  // Fetch progress when wallet is available
  useEffect(() => {
    if (!walletAddress) {
      if (!isConnected) {
        setProgress({});
        setCompletedCount(0);
      }
      return;
    }

    const fetchProgress = async () => {
      try {
        const res = await authFetch(`/api/challenges/progress?track=${track}`, {
          walletAddress,
        });
        if (res.ok) {
          const data = await res.json();
          const newProgress = data.progress || {};
          const newCount = data.completedCount || 0;
          setProgress(newProgress);
          setCompletedCount(newCount);

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

  const getDifficultyStyle = (difficulty?: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-[#14f195]";
      case "Medium":
        return "text-amber-400";
      case "Hard":
        return "text-[#9945ff]";
      default:
        return "text-neutral-400";
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <Navbar />

      <div className="pt-28 pb-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2 text-neutral-600">/</span>
            <Link href="/challenges" className="hover:text-white transition-colors">
              Challenges
            </Link>
            <span className="mx-2 text-neutral-600">/</span>
            <span className="text-white">{trackName}</span>
          </nav>

          {/* Back Link */}
          <Link
            href="/challenges"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Challenges
          </Link>

          {/* Header */}
          <header className="mb-12">
            <p className="text-xs uppercase tracking-widest text-[#14f195] mb-3">
              {track.toUpperCase()} Track
            </p>
            <h1 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">
              {trackName}
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl">
              {trackDescription}
            </p>

            {/* Progress Bar */}
            {isConnected && (
              <div className="mt-8 max-w-md">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-neutral-400">Your Progress</span>
                  <span className="text-white font-mono">
                    {completedCount}/{challenges.length} ({progressPercentage}%)
                  </span>
                </div>
                <Progress
                  value={progressPercentage}
                  className="h-1.5 bg-neutral-800"
                />
                {completedCount === challenges.length && challenges.length > 0 && (
                  <p className="text-sm text-[#14f195] mt-2">
                    🎉 All challenges completed!
                  </p>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-6 mt-6 text-sm text-neutral-500">
              <span>{challenges.length} challenges</span>
              <span className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#14f195]" />
                  Easy
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  Medium
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-[#9945ff]" />
                  Hard
                </span>
              </span>
            </div>
          </header>

          {/* Challenge List */}
          <div className="space-y-2">
            {challenges.map((challenge) => {
              const isCompleted = Boolean(progress[challenge.id]);

              return (
                <div
                  key={challenge.id}
                  onClick={() => requireLogin(() => router.push(`/challenges/${track}/${challenge.id}`))}
                  className={`group flex items-center gap-4 rounded-lg border p-4 cursor-pointer transition-all ${
                    isCompleted
                      ? "border-[#14f195]/20 bg-[#14f195]/5 hover:border-[#14f195]/30"
                      : "border-neutral-800 bg-neutral-900/30 hover:border-neutral-700 hover:bg-neutral-900/50"
                  }`}
                >
                  {/* Number / Checkmark */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? "bg-[#14f195]/20 text-[#14f195]"
                      : "bg-neutral-800 text-neutral-500"
                  }`}>
                    {isCompleted ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-mono">{challenge.id}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className={`font-medium truncate ${
                        isCompleted ? "text-[#14f195]" : "text-white group-hover:text-[#14f195]"
                      } transition-colors`}>
                        {challenge.title}
                      </h3>
                      {challenge.difficulty && (
                        <span className={`text-xs font-medium ${getDifficultyStyle(challenge.difficulty)}`}>
                          {challenge.difficulty}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-neutral-500 truncate">
                      {challenge.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="hidden md:flex items-center gap-2">
                    {challenge.tags?.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-neutral-600 group-hover:text-[#14f195] group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />

      <LoginRequiredModal
        open={showModal}
        onOpenChange={setShowModal}
        title="Challenge Locked"
        description="Connect your wallet to access this challenge and track your learning progress."
      />
    </div>
  );
}
