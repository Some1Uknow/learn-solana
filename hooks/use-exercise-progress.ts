"use client";

import { useCallback, useEffect } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { authFetch } from "@/lib/auth/authFetch";
import { useAuth } from "@/hooks/use-auth";

export type ExerciseProgressItem = {
  completedAt: string | null;
  attemptCount: number;
  status: string;
};

export type ExerciseProgressResponse = {
  track: string;
  userId: string;
  progress: Record<string, ExerciseProgressItem>;
  completedCount: number;
};

type ExerciseProgressKey = readonly ["exercise-progress", string];

const EMPTY_PROGRESS: Record<string, ExerciseProgressItem> = {};

function getExerciseProgressKey(track?: string): ExerciseProgressKey | null {
  return track ? (["exercise-progress", track] as const) : null;
}

async function fetchExerciseProgress(track: string): Promise<ExerciseProgressResponse> {
  const response = await authFetch(`/api/challenges/progress?track=${track}`);

  if (!response.ok) {
    throw new Error(`progress fetch failed with status ${response.status}`);
  }

  return response.json();
}

function buildCompletedProgressItem(
  existing?: ExerciseProgressItem | null
): ExerciseProgressItem {
  return {
    completedAt: existing?.completedAt ?? new Date().toISOString(),
    attemptCount: (existing?.attemptCount ?? 0) + 1,
    status: "completed",
  };
}

export function useExerciseProgress(track?: string) {
  const { authenticated, ready } = useAuth();
  const cacheKey = ready && authenticated ? getExerciseProgressKey(track) : null;

  const swr = useSWR<ExerciseProgressResponse, Error, ExerciseProgressKey | null>(
    cacheKey,
    (key) => fetchExerciseProgress(key[1]),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
      keepPreviousData: true,
      dedupingInterval: 15_000,
    }
  );

  useEffect(() => {
    if (!track || !ready || authenticated) return;
    void globalMutate(getExerciseProgressKey(track), undefined, { revalidate: false });
  }, [authenticated, ready, track]);

  const progress = swr.data?.progress ?? EMPTY_PROGRESS;
  const completedCount = swr.data?.completedCount ?? 0;

  const markCompleted = useCallback(
    async (exerciseSlug: string, code: string) => {
      if (!track) {
        throw new Error("track is required");
      }

      const targetKey = getExerciseProgressKey(track);
      if (!targetKey) {
        throw new Error("track is required");
      }

      const optimisticMutator = async (
        current?: ExerciseProgressResponse
      ): Promise<ExerciseProgressResponse> => {
        const response = await authFetch("/api/challenges/complete", {
          method: "POST",
          body: JSON.stringify({
            track,
            exerciseSlug,
            code,
          }),
        });

        if (!response.ok) {
          throw new Error(`save failed with status ${response.status}`);
        }

        const payload = (await response.json()) as {
          progress?: {
            exerciseSlug: string;
            completedAt: string | null;
            attemptCount: number;
            status: string;
          };
          userId?: string;
        };

        const saved = payload.progress ?? {
          exerciseSlug,
          ...buildCompletedProgressItem(current?.progress?.[exerciseSlug]),
        };

        const nextProgress = {
          ...(current?.progress ?? {}),
          [saved.exerciseSlug]: {
            completedAt: saved.completedAt,
            attemptCount: saved.attemptCount,
            status: saved.status,
          },
        };

        return {
          track,
          userId: current?.userId ?? payload.userId ?? "",
          progress: nextProgress,
          completedCount: Object.keys(nextProgress).length,
        };
      };

      const current = swr.data;
      const optimisticProgress = {
        ...(current?.progress ?? {}),
        [exerciseSlug]: buildCompletedProgressItem(current?.progress?.[exerciseSlug]),
      };

      return globalMutate(targetKey, optimisticMutator(current), {
        optimisticData: {
          track,
          userId: current?.userId ?? "",
          progress: optimisticProgress,
          completedCount: Object.keys(optimisticProgress).length,
        },
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      });
    },
    [swr.data, track]
  );

  return {
    progress,
    completedCount,
    isLoading: Boolean(cacheKey) && !swr.data && !swr.error,
    isValidating: swr.isValidating,
    error: swr.error,
    mutate: swr.mutate,
    markCompleted,
  };
}
