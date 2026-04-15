"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Progress } from "@/components/ui/progress";
import type { ExerciseEntry } from "@/lib/challenges/exercises";
import { buildChallengeSections } from "@/lib/challenges/track-groups";
import { useAuth } from "@/hooks/use-auth";
import { useExerciseProgress } from "@/hooks/use-exercise-progress";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";

interface Props {
  track: string;
  trackName: string;
  trackDescription: string;
  challenges: ExerciseEntry[];
}

export default function TrackChallengesClient({
  track,
  trackName,
  trackDescription,
  challenges,
}: Props) {
  const router = useRouter();
  const { ready, authenticated } = useAuth();
  const { progress, completedCount } = useExerciseProgress(track);

  const progressPercentage =
    challenges.length > 0
      ? Math.round((completedCount / challenges.length) * 100)
      : 0;
  const challengeSections = buildChallengeSections(track, challenges);

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

      <div className="px-4 pb-24 pt-28 sm:px-6 md:px-8">
        <div className="mx-auto max-w-4xl">
          <nav className="mb-8 text-sm text-neutral-400">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="mx-2 text-neutral-600">/</span>
            <Link href="/challenges" className="transition-colors hover:text-white">
              Challenges
            </Link>
            <span className="mx-2 text-neutral-600">/</span>
            <span className="text-white">{trackName}</span>
          </nav>

          <Link
            href="/challenges"
            className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-400 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Challenges
          </Link>

          <header className="mb-12">
            <p className="mb-3 text-xs uppercase tracking-widest text-[#14f195]">
              {track.toUpperCase()} Track
            </p>
            <h1 className="mb-4 text-3xl font-medium tracking-tight md:text-4xl">
              {trackName}
            </h1>
            <p className="max-w-2xl text-lg text-neutral-400">{trackDescription}</p>

            {authenticated && (
              <div className="mt-8 max-w-md">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-neutral-400">Your Progress</span>
                  <span className="font-mono text-white">
                    {completedCount}/{challenges.length} ({progressPercentage}%)
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-1.5 bg-neutral-800" />
                {completedCount === challenges.length && challenges.length > 0 && (
                  <p className="mt-2 text-sm text-[#14f195]">
                    All challenges completed.
                  </p>
                )}
              </div>
            )}

            {!authenticated && ready && (
              <p className="mt-6 text-sm text-neutral-500">
                Sign in to save progress across devices.
              </p>
            )}

            <div className="mt-6 flex items-center gap-6 text-sm text-neutral-500">
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

          <div className="mt-2 space-y-10">
            {challengeSections.map((section) => (
              <section key={section.id} className="space-y-4">
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-medium tracking-tight text-white md:text-2xl">
                      {section.title}
                    </h2>
                    {section.days && (
                      <span className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-900/60 px-2.5 py-0.5 text-xs font-medium text-neutral-400">
                        {section.days}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-neutral-500">{section.description}</p>
                </div>

                <div className="h-px w-full bg-neutral-800" />

                <div className="space-y-1.5">
                  {section.challenges.map((challenge) => {
                    const isCompleted = Boolean(progress[challenge.slug]);

                    return (
                      <div
                        key={challenge.slug}
                        onClick={() => router.push(`/challenges/${track}/${challenge.slug}`)}
                        className={`group flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 transition-all ${
                          isCompleted
                            ? "border-[#14f195]/20 bg-[#14f195]/5 hover:border-[#14f195]/30"
                            : "border-neutral-800 bg-neutral-900/30 hover:border-neutral-700 hover:bg-neutral-900/50"
                        }`}
                      >
                        <div
                          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md ${
                            isCompleted
                              ? "bg-[#14f195]/20 text-[#14f195]"
                              : "bg-neutral-800 text-neutral-500"
                          }`}
                        >
                          {isCompleted ? <Check className="h-4 w-4" /> : <span className="text-xs font-mono">{challenge.order}</span>}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="mb-0.5 flex items-center gap-2">
                            <h3
                              className={`truncate text-sm font-medium transition-colors ${
                                isCompleted
                                  ? "text-[#14f195]"
                                  : "text-white group-hover:text-[#14f195]"
                              }`}
                            >
                              {challenge.title}
                            </h3>
                            {challenge.difficulty && (
                              <span
                                className={`text-[11px] font-medium ${getDifficultyStyle(challenge.difficulty)}`}
                              >
                                {challenge.difficulty}
                              </span>
                            )}
                          </div>
                          <p className="truncate text-xs text-neutral-500">
                            {challenge.description}
                          </p>
                        </div>

                        <div className="hidden items-center gap-1.5 md:flex">
                          {challenge.tags?.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-neutral-800 px-1.5 py-0.5 text-[11px] text-neutral-500"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <ChevronRight className="h-4 w-4 flex-shrink-0 text-neutral-600 transition-all group-hover:translate-x-1 group-hover:text-[#14f195]" />
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
