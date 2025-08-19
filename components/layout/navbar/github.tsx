"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Github, Star } from "lucide-react";

// GitHub configuration
const githubConfig = {
  repoName: "learn.sol-main",
  owner: "Some1Uknow",
  fullRepoName: "learn.sol-main",
  url: "https://github.com/Some1Uknow/learn.sol-main",
};

interface NavbarGithubProps {
  isMobile?: boolean;
}

export function NavbarGithub({ isMobile = false }: NavbarGithubProps) {
  const [githubStars, setGithubStars] = useState<number | null>(null);

  // Fetch stars on component mount
  useEffect(() => {
    fetchGithubStars();
  }, []);

  // Fetch GitHub stars (optional - you can replace with static number)
  const fetchGithubStars = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repoName}`
      );
      const data = await response.json();
      setGithubStars(data.stargazers_count || 0);
    } catch (error) {
      setGithubStars(42); // Fallback number
    }
  };

  return (
    <Link
      href={githubConfig.url}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Button
        variant="outline"
        className={`flex items-center gap-2 h-10 px-4 rounded-full ${
          isMobile ? "w-full justify-center" : ""
        }`}
      >
        <Github size={16} />
        <div className="flex items-center gap-1">
          <Star size={14} className="fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-semibold">
            {githubStars || "..."}
          </span>
        </div>
      </Button>
    </Link>
  );
}
