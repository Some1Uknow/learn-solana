"use client";

import Image from "next/image";
import Link from "next/link";

const githubConfig = {
  fullRepoName: "learn-solana",
  url: "https://github.com/Some1Uknow/learn-solana",
};

interface NavbarGithubProps {
  isMobile?: boolean;
}

export function NavbarGithub({ isMobile = false }: NavbarGithubProps) {
  return (
    <Link
      href={githubConfig.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${githubConfig.fullRepoName} on GitHub`}
      title="Open learn-solana on GitHub"
      className={`ds-focus-ring inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#dedede] bg-white text-[#636363] transition-colors duration-150 hover:bg-[#efefef] hover:text-[#181818] ${
        isMobile ? "justify-self-start" : ""
      }`}
    >
      <Image
        src="/github.svg"
        alt=""
        aria-hidden="true"
        width={18}
        height={18}
        className="opacity-75"
      />
    </Link>
  );
}
