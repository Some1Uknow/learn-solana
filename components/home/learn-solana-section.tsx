"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

type Tile = {
  id: string;
  title: string;
  href: string;
  icon: string;
  description: string;
};

const tiles: Tile[] = [
  {
    id: "modules",
    title: "Free Solana Course",
    href: "/modules",
    icon: "/solanaLogo.png",
    description: "Learn Solana development from scratch. Blockchain fundamentals, Rust, Anchor framework, and building real dApps.",
  },
  {
    id: "games",
    title: "Learn with Games",
    href: "/games",
    icon: "/game_icon.png",
    description: "Master Solana concepts through interactive games. Learn transactions, accounts, and smart contracts.",
  },
  {
    id: "tools",
    title: "Developer Tools",
    href: "/tools",
    icon: "/tool_icon.png",
    description: "Discover essential Solana development tools. RPCs, wallets, explorers, and testing frameworks.",
  },
  {
    id: "challenges",
    title: "Coding Challenges",
    href: "/challenges",
    icon: "/rust-2.png",
    description: "Sharpen your skills with daily coding challenges. Practice Rust and Anchor with progressive difficulty.",
  },
];

export default function LearnSolanaSection() {
  return (
    <section className="py-20 border-t border-neutral-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <p className="text-xs uppercase tracking-widest text-neutral-500 mb-3">
            What we offer
          </p>
          <h2 className="text-3xl md:text-4xl font-medium tracking-tight text-white">
            Everything you need to master Solana
          </h2>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {tiles.map((tile) => (
            <Link
              key={tile.id}
              href={tile.href}
              className="group rounded-lg border border-neutral-800 bg-neutral-900/30 p-6 transition-all hover:border-neutral-700 hover:bg-neutral-900/50"
            >
              <div className="flex items-start gap-4">
                <div className="relative w-12 h-12 shrink-0">
                  <Image 
                    src={tile.icon} 
                    alt={tile.title} 
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-white mb-2 flex items-center gap-2">
                    {tile.title}
                    <ArrowRight 
                      size={16} 
                      className="text-neutral-500 transition-transform group-hover:translate-x-1 group-hover:text-[#14f195]" 
                    />
                  </h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    {tile.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
