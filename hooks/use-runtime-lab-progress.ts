"use client";

import { useCallback } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { authFetch } from "@/lib/auth/authFetch";
import { useAuth } from "@/hooks/use-auth";

export type RuntimeLabProgress = {
  version: 1;
  programId: string;
  flowId: string;
  activeStepIndex: number;
  selectedAnswers: Record<string, string>;
  revealedSteps: Record<string, boolean>;
  selectedFailures?: Record<string, string>;
  activePanel?: "runtime" | "accounts" | "failures";
  updatedAt?: string;
};

type RuntimeLabProgressListResponse = {
  userId: string;
  progress: Record<string, RuntimeLabProgress>;
};

type RuntimeLabProgressDetailResponse = {
  userId: string;
  progress: RuntimeLabProgress | null;
};

type RuntimeLabProgressListKey = readonly ["runtime-lab-progress"];
type RuntimeLabProgressDetailKey = readonly ["runtime-lab-progress", string];

const EMPTY_PROGRESS: Record<string, RuntimeLabProgress> = {};

function listKey(enabled: boolean): RuntimeLabProgressListKey | null {
  return enabled ? (["runtime-lab-progress"] as const) : null;
}

function detailKey(enabled: boolean, programId?: string): RuntimeLabProgressDetailKey | null {
  return enabled && programId ? (["runtime-lab-progress", programId] as const) : null;
}

function isAuthError(error: Error & { status?: number }) {
  return error.status === 401 || error.status === 403;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await authFetch(url);

  if (!response.ok) {
    const error = new Error(`runtime lab progress fetch failed with status ${response.status}`) as
      Error & { status?: number };
    error.status = response.status;
    throw error;
  }

  return response.json() as Promise<T>;
}

const swrOptions = {
  dedupingInterval: 15_000,
  errorRetryCount: 2,
  focusThrottleInterval: 30_000,
  keepPreviousData: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: (error: Error & { status?: number }) => !isAuthError(error),
};

export function useRuntimeLabProgressList() {
  const { authenticated, ready } = useAuth();
  const enabled = ready && authenticated;

  const swr = useSWR<
    RuntimeLabProgressListResponse,
    Error & { status?: number },
    RuntimeLabProgressListKey | null
  >(
    listKey(enabled),
    () => fetchJson<RuntimeLabProgressListResponse>("/api/tools/runtime-lab/progress"),
    swrOptions
  );

  const deleteProgress = useCallback(
    async (programId: string) => {
      const response = await authFetch(
        `/api/tools/runtime-lab/progress?${new URLSearchParams({ programId })}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`runtime lab progress delete failed with status ${response.status}`);
      }

      await globalMutate(
        listKey(true),
        (current?: RuntimeLabProgressListResponse) => {
          const nextProgress = { ...(current?.progress ?? {}) };
          delete nextProgress[programId];
          return {
            userId: current?.userId ?? "",
            progress: nextProgress,
          };
        },
        { revalidate: false }
      );

      await globalMutate(
        detailKey(true, programId),
        (current?: RuntimeLabProgressDetailResponse) => ({
          userId: current?.userId ?? "",
          progress: null,
        }),
        { revalidate: false }
      );
    },
    []
  );

  return {
    progressByProgram: swr.data?.progress ?? EMPTY_PROGRESS,
    isLoading: enabled && !swr.data && !swr.error,
    isValidating: swr.isValidating,
    error: swr.error,
    mutate: swr.mutate,
    deleteProgress,
  };
}

export function useRuntimeLabProgramProgress(programId: string) {
  const { authenticated, ready } = useAuth();
  const enabled = ready && authenticated;
  const key = detailKey(enabled, programId);

  const swr = useSWR<
    RuntimeLabProgressDetailResponse,
    Error & { status?: number },
    RuntimeLabProgressDetailKey | null
  >(
    key,
    ([, id]) =>
      fetchJson<RuntimeLabProgressDetailResponse>(
        `/api/tools/runtime-lab/progress?${new URLSearchParams({ programId: id })}`
      ),
    swrOptions
  );

  const saveProgress = useCallback(
    async (progress: RuntimeLabProgress) => {
      const detailCacheKey = detailKey(true, progress.programId);

      const saveRequest = authFetch("/api/tools/runtime-lab/progress", {
        method: "PUT",
        body: JSON.stringify(progress),
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`runtime lab progress save failed with status ${response.status}`);
        }
        return response.json() as Promise<RuntimeLabProgressDetailResponse>;
      });

      const nextDetail = await globalMutate(detailCacheKey, saveRequest, {
        optimisticData: (current?: RuntimeLabProgressDetailResponse) => ({
          userId: current?.userId ?? "",
          progress,
        }),
        rollbackOnError: true,
        populateCache: true,
        revalidate: false,
      });

      if (nextDetail?.progress) {
        await globalMutate(
          listKey(true),
          (current?: RuntimeLabProgressListResponse) => ({
            userId: current?.userId ?? nextDetail.userId,
            progress: {
              ...(current?.progress ?? {}),
              [nextDetail.progress!.programId]: nextDetail.progress!,
            },
          }),
          { revalidate: false }
        );
      }

      return nextDetail;
    },
    []
  );

  const deleteProgress = useCallback(async () => {
    const detailCacheKey = detailKey(true, programId);
    const response = await authFetch(
      `/api/tools/runtime-lab/progress?${new URLSearchParams({ programId })}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`runtime lab progress delete failed with status ${response.status}`);
    }

    await globalMutate(
      detailCacheKey,
      (current?: RuntimeLabProgressDetailResponse) => ({
        userId: current?.userId ?? "",
        progress: null,
      }),
      { revalidate: false }
    );

    await globalMutate(
      listKey(true),
      (current?: RuntimeLabProgressListResponse) => {
        const nextProgress = { ...(current?.progress ?? {}) };
        delete nextProgress[programId];
        return {
          userId: current?.userId ?? "",
          progress: nextProgress,
        };
      },
      { revalidate: false }
    );
  }, [programId]);

  return {
    progress: swr.data?.progress ?? null,
    isLoading: enabled && !swr.data && !swr.error,
    isValidating: swr.isValidating,
    error: swr.error,
    mutate: swr.mutate,
    saveProgress,
    deleteProgress,
  };
}
