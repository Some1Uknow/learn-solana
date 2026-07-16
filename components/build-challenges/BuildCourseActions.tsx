"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Download } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";
import { authFetch } from "@/lib/auth/authFetch";

type Progress = {
  currentStageSlug: string;
  completedStageCount: number;
};

type Props = {
  courseSlug: string;
  firstStageSlug: string;
  stageCount: number;
  starterUrl: string;
};

export function BuildCourseActions({
  courseSlug,
  firstStageSlug,
  stageCount,
  starterUrl,
}: Props) {
  const { authenticated, ready } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);

  const loadProgress = useCallback(async () => {
    if (!ready || !authenticated) {
      setProgress(null);
      return;
    }
    const response = await authFetch(`/api/build/progress/${courseSlug}`);
    if (!response.ok) return;
    const payload = (await response.json()) as { progress: Progress };
    setProgress(payload.progress);
  }, [authenticated, courseSlug, ready]);

  useEffect(() => {
    void loadProgress();
  }, [loadProgress]);

  const stageSlug = progress?.currentStageSlug ?? firstStageSlug;
  const label = progress && progress.completedStageCount > 0 ? "Continue building" : "Begin stage 1";

  return (
    <div className="border-t border-white/10 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
      {progress ? (
        <p className="font-mono text-xs tabular-nums text-zinc-500">
          {progress.completedStageCount} / {stageCount} stages complete
        </p>
      ) : (
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-500">Your local workspace</p>
      )}
      <a
        href={starterUrl}
        download
        className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 border border-white/15 px-4 text-sm font-medium text-zinc-100 transition-colors duration-100 hover:border-solana-green hover:text-solana-green focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solana-green"
      >
        <Download className="h-4 w-4" aria-hidden="true" />
        Download starter
      </a>
      <Link
        href={`/build/${courseSlug}/${stageSlug}`}
        className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 bg-solana-green px-4 text-sm font-semibold text-zinc-950 transition-[background-color,transform] duration-100 hover:bg-lime-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-solana-green focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 active:translate-y-px"
      >
        {label}
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </Link>
      <p className="mt-4 text-xs leading-5 text-zinc-500">
        Build locally, then upload only <code className="font-mono text-zinc-300">target/deploy/sol_vault.so</code>.
      </p>
    </div>
  );
}
