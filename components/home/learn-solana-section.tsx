"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@/components/ui/card";

type Tile = {
  id: string;
  title: string;
  href: string;
  icon: string;
  label: string;
  description: string;
};

const tiles: Tile[] = [
  {
    id: "modules",
    title: "Free Solana Course",
    href: "/modules",
    icon: "/solanaLogo.png",
    label: "Structured Learning",
    description: "Learn Solana development from scratch. Our free course covers blockchain fundamentals, Rust programming, Anchor framework, and building real dApps step-by-step.",
  },
  {
    id: "games",
    title: "Learn with Games",
    href: "/games",
    icon: "/game_icon.png",
    label: "Interactive Tutorials",
    description: "Master Solana concepts through fun, interactive games. Learn transactions, accounts, and smart contracts while earning NFTs for your progress.",
  },
  {
    id: "tools",
    title: "Developer Tools",
    href: "/tools",
    icon: "/tool_icon.png",
    label: "Essential Dev Stack",
    description: "Discover the best Solana development tools. RPCs, wallets, explorers, testing frameworks - everything you need to build on Solana.",
  },
  {
    id: "challenges",
    title: "Coding Challenges",
    href: "/challenges",
    icon: "/rust-2.png",
    label: "30-Day Practice Tracks",
    description: "Sharpen your Solana skills with daily coding challenges. Practice Rust and Anchor development with progressive difficulty challenges.",
  },
];

export default function LearnSolanaSection() {
  return (
    <section aria-labelledby="learn-solana-courses" className="container relative z-10 -mt-6 md:-mt-10 pb-8 md:pb-12">
      <div className="mb-8 md:mb-12 text-center">
        <div className="text-xs tracking-[0.25em] text-[#14f195] uppercase font-medium">What We Offer</div>
        <h2 id="learn-solana-courses" className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Building the future of
          <br />
          Solana education
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        {tiles.map((tile) => {
          return (
            <Link key={tile.id} href={tile.href} className="group" aria-label={tile.title}>
              <Card className="relative overflow-hidden border border-white/[0.08] bg-black/40 backdrop-blur-sm transition-all duration-300 hover:border-white/[0.15] h-full">
                {/* Subtle corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#14f195]/5 to-transparent pointer-events-none" />
                
                <div className="relative p-8 md:p-10 flex flex-col h-full">
                  {/* Icon and label row */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 bg-white/[0.03] rounded-lg p-3 border border-white/[0.05]">
                      <Image 
                        src={tile.icon} 
                        alt={tile.title} 
                        fill
                        sizes="64px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#14f195]" />
                      <span className="text-sm text-zinc-400 font-medium">{tile.label}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4 flex-1">
                    <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                      {tile.title}
                    </h3>
                    <p className="text-sm md:text-base text-zinc-400 leading-relaxed">
                      {tile.description}
                    </p>
                  </div>

                  {/* Arrow indicator */}
                  <div className="mt-6 flex items-center text-zinc-500 text-sm group-hover:text-[#14f195] transition-colors">
                    <span className="mr-2">Learn more</span>
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}