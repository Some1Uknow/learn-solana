"use client";

import Link from "next/link";
import Image from "next/image";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { BlurFade } from "@/components/ui/blur-fade";
import { BookOpen, Gamepad2, Wrench, Code } from "lucide-react";

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

const iconMap = {
  modules: BookOpen,
  games: Gamepad2,
  tools: Wrench,
  challenges: Code,
};

export default function LearnSolanaSection() {
  return (
    <section aria-labelledby="learn-solana-courses" className="container relative z-10 -mt-6 md:-mt-10 pb-8 md:pb-12">
      <BlurFade delay={0.1} inView>
        <div className="mb-8 md:mb-12 text-center">
          <div className="text-xs tracking-[0.25em] text-[#14f195] uppercase font-medium">What We Offer</div>
          <h2 id="learn-solana-courses" className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Building the future of
            <br />
            Solana education
          </h2>
        </div>
      </BlurFade>

      <BentoGrid className="grid-cols-1 md:grid-cols-2 auto-rows-[18rem] md:auto-rows-[20rem] gap-4">
        {tiles.map((tile, index) => {
          const IconComponent = iconMap[tile.id as keyof typeof iconMap];
          return (
            <BlurFade key={tile.id} delay={0.15 + index * 0.1} inView>
              <Link href={tile.href} className="block h-full group">
                <BentoCard
                  name={tile.title}
                  className="h-full col-span-1 bg-black/40 border-white/[0.08] hover:border-[#14f195]/30 transition-all duration-300"
                  background={
                    <div className="absolute inset-0 bg-gradient-to-br from-[#14f195]/5 via-transparent to-[#9945ff]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  }
                  Icon={() => (
                    <div className="relative w-16 h-16 md:w-20 md:h-20">
                      <Image 
                        src={tile.icon} 
                        alt={tile.title} 
                        fill
                        sizes="(max-width: 768px) 64px, 80px"
                        className="object-contain"
                      />
                    </div>
                  )}
                  description={tile.description}
                  href={tile.href}
                  cta="Learn more"
                />
              </Link>
            </BlurFade>
          );
        })}
      </BentoGrid>
    </section>
  );
}