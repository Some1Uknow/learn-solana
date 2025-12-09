"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

type Tile = {
  id: string;
  title: string;
  href: string;
  icon: string;
  eyebrow: string;
  blurb: string;
  tone?: "green" | "cyan" | "purple" | "amber";
};

const tiles: Tile[] = [
  {
    id: "modules",
    title: "Free Solana Course",
    href: "/modules",
    icon: "/solanaLogo.png",
    eyebrow: "Structured learning path",
    blurb: "Learn Solana development from scratch. Our free course covers blockchain fundamentals, Rust programming, Anchor framework, and building real dApps step-by-step.",
    tone: "green",
  },
  {
    id: "games",
    title: "Learn Solana with Games",
    href: "/games",
    icon: "/solanaLogo.png",
    eyebrow: "Interactive tutorials",
    blurb: "Master Solana concepts through fun, interactive games. Learn transactions, accounts, and smart contracts while earning NFTs for your progress.",
    tone: "cyan",
  },
  {
    id: "tools",
    title: "Solana Developer Tools",
    href: "/tools",
    icon: "/solanaLogo.png",
    eyebrow: "Essential dev stack",
    blurb: "Discover the best Solana development tools. RPCs, wallets, explorers, testing frameworks - everything you need to build on Solana.",
    tone: "purple",
  },
  {
    id: "challenges",
    title: "Solana Coding Challenges",
    href: "/challenges",
    icon: "/rust-2.png",
    eyebrow: "30-day practice tracks",
    blurb: "Sharpen your Solana skills with daily coding challenges. Practice Rust and Anchor development with progressive difficulty challenges.",
    tone: "amber",
  },
];

export function LearnSolanaSection() {
  return (
    <section aria-labelledby="learn-solana-courses" className="container relative z-10 -mt-6 md:-mt-10 pb-8 md:pb-12">
      <div className="mb-6 md:mb-8 text-center">
        <div className="text-xs tracking-[0.25em] text-zinc-400">[FREE SOLANA DEVELOPMENT COURSE]</div>
        <h2 id="learn-solana-courses" className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
          Start Learning Solana Today
        </h2>
        <p className="mt-2 max-w-2xl mx-auto text-sm text-zinc-400">
          Choose your learning path. Master Solana development through our free course, interactive games, and daily coding challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
        {tiles.map((t) => (
          <Link key={t.id} href={t.href} className="group" aria-label={t.title}>
            <Card
              className={`relative overflow-hidden rounded-3xl border border-white/6 bg-linear-to-b from-white/2 to-transparent transition-transform duration-300 hover:scale-[1.02] hover:shadow-[0_30px_80px_rgba(0,0,0,0.6)]`}
            >
              <div className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="w-full h-full bg-linear-to-br from-white/3 to-transparent mix-blend-screen" />
              </div>

              <CardContent className="p-5 md:p-8 flex min-h-60 md:min-h-64 items-stretch gap-4 md:gap-6">
                <div className="flex flex-col justify-between w-full">
                  <div className="flex items-start justify-between gap-3 sm:gap-4">
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-zinc-400">{t.eyebrow}</div>
                      <h3 className="mt-2 text-xl md:text-2xl font-semibold leading-tight text-white">
                        {t.title}
                      </h3>
                      <p className="mt-2 text-sm text-zinc-400 max-w-xl">{t.blurb}</p>
                    </div>

                    <div className="shrink-0 flex items-center justify-center">
                      <div className="relative h-12 w-12 sm:h-16 sm:w-16 md:h-20 md:w-20 rounded-lg bg-white/3 p-2 sm:p-3">
                        <Image src={t.icon} alt={t.title} width={72} height={72} sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, 80px" className="object-contain" />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-xs text-zinc-400">Ready to level up?</span>
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                        t.tone === "green"
                          ? "bg-[#14F195]/10 text-[#14F195] border border-[#14F195]/20"
                          : t.tone === "cyan"
                          ? "bg-[#00C2FF]/10 text-[#00C2FF] border border-[#00C2FF]/20"
                          : t.tone === "purple"
                          ? "bg-[#9945FF]/10 text-[#C292FF] border border-[#9945FF]/20"
                          : "bg-amber-400/8 text-amber-300 border border-amber-400/15"
                      }`}
                    >
                      Explore
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default LearnSolanaSection;
