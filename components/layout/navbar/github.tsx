"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Star } from "lucide-react";

const githubConfig = {
  repoName: "learn-solana",
  owner: "Some1Uknow",
  fullRepoName: "learn-solana",
  url: "https://github.com/Some1Uknow/learn-solana",
};

interface NavbarGithubProps {
  isMobile?: boolean;
}

const CACHE_KEY = "github-stars-cache";
const CACHE_DURATION = 60 * 60 * 1000;

interface CacheData {
  stars: number;
  timestamp: number;
}

function useGithubStars() {
  const [stars, setStars] = useState<number | null>(null);

  const fetchStars = useCallback(async () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const cacheData: CacheData = JSON.parse(cached);
        if (Date.now() - cacheData.timestamp < CACHE_DURATION) {
          setStars(cacheData.stars);
          return;
        }
      } catch {
        localStorage.removeItem(CACHE_KEY);
      }
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(
        `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repoName}`,
        {
          signal: controller.signal,
          headers: { Accept: "application/vnd.github.v3+json" },
        },
      );
      clearTimeout(timeoutId);

      if (!response.ok) return;
      const data = await response.json();
      if (typeof data.stargazers_count !== "number") return;

      const cacheData: CacheData = {
        stars: data.stargazers_count,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      setStars(data.stargazers_count);
    } catch {
      // Star count is optional chrome; keep the GitHub link useful when the API is unavailable.
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchStars();
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [fetchStars]);

  return stars;
}

export function NavbarGithub({ isMobile = false }: NavbarGithubProps) {
  const githubStars = useGithubStars();

  return (
    <Link
      href={githubConfig.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${githubConfig.fullRepoName} on GitHub${githubStars !== null ? ` (${githubStars} stars)` : ""}`}
      title={`Open ${githubConfig.fullRepoName} on GitHub`}
      className={`ds-focus-ring inline-flex h-10 min-w-[86px] shrink-0 items-center justify-center rounded-[6px] border border-[#dedede] bg-white px-3 text-[#636363] transition-colors duration-150 hover:bg-[#efefef] hover:text-[#181818] ${
        isMobile ? "w-full" : ""
      }`}
    >
      <span className="inline-flex items-center gap-1.5 font-mono text-xs tabular-nums">
        <Image
          src="/github.svg"
          alt=""
          aria-hidden="true"
          width={18}
          height={18}
          className="opacity-75"
        />
        <Star size={13} aria-hidden="true" className="fill-current" />
        <span>{githubStars ?? "—"}</span>
      </span>
    </Link>
  );
}
