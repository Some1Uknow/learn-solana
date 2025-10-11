"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { Star } from "lucide-react";
import Image from "next/image";

// GitHub configuration
const githubConfig = {
  repoName: "learn-solana",
  owner: "Some1Uknow",
  fullRepoName: "learn-solana",
  url: "https://github.com/Some1Uknow/learn-solana",
};

interface NavbarGithubProps {
  isMobile?: boolean;
}

// Cache configuration
const CACHE_KEY = "github-stars-cache";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

interface CacheData {
  stars: number;
  timestamp: number;
}

// Custom hook for fetching GitHub stars with caching
function useGithubStars() {
  const [stars, setStars] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStars = useCallback(async () => {
    // Check cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const cacheData: CacheData = JSON.parse(cached);
        const now = Date.now();

        // Use cached data if it's still fresh
        if (now - cacheData.timestamp < CACHE_DURATION) {
          setStars(cacheData.stars);
          return;
        }
      } catch (error) {
        // Invalid cache, continue to fetch
        localStorage.removeItem(CACHE_KEY);
      }
    }

    setIsLoading(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(
        `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repoName}`,
        {
          signal: controller.signal,
          headers: {
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      const starCount = data.stargazers_count || 0;

      // Cache the result
      const cacheData: CacheData = {
        stars: starCount,
        timestamp: Date.now(),
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

      setStars(starCount);
    } catch (error) {
      // If fetch fails and we have no cached data, use fallback
      if (stars === null) {
        setStars(42); // Fallback number
      }
      console.warn("Failed to fetch GitHub stars:", error);
    } finally {
      setIsLoading(false);
    }
  }, [stars]);

  useEffect(() => {
    fetchStars();
  }, [fetchStars]);

  return { stars, isLoading };
}

export function NavbarGithub({ isMobile = false }: NavbarGithubProps) {
  const { stars: githubStars, isLoading } = useGithubStars();

  return (
    <Link href={githubConfig.url} target="_blank" rel="noopener noreferrer">
      <Button
        variant="outline"
        className={`flex items-center gap-2 h-10 px-2 py-0 bg-[#0d1117] hover:bg-[#161b22] border-[#0d1117] text-white ${
          isMobile ? "w-full justify-center" : ""
        }`}
      >
        <Image
          src="/github.svg"
          alt="GitHub"
          width={16}
          height={16}
          className="brightness-0 invert"
        />
        <div className="flex items-center gap-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">
            {isLoading ? "..." : githubStars || "..."}
          </span>
        </div>
      </Button>
    </Link>
  );
}
