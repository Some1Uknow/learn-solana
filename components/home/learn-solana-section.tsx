"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

type NavCard = {
  title: string;
  href: string;
  icon: string;
  subtitle: string;
};

const items: NavCard[] = [
  { title: "Modules", href: "/modules", icon: "/solanaLogo.png", subtitle: "Structured lessons" },
  { title: "Games", href: "/games", icon: "/solanaMain.png", subtitle: "Play to learn" },
  { title: "Projects", href: "/projects", icon: "/capstone.png", subtitle: "Build real apps" },
  { title: "Challenges", href: "/challenges", icon: "/anchor.png", subtitle: "Daily practice" },
];

export function LearnSolanaSection() {
  return (
    <section
      aria-labelledby="learn-solana"
      className="container relative z-10 -mt-6 md:-mt-10 pb-8 md:pb-12"
    >
      <div className="mb-6 md:mb-8 text-center">
        <div className="text-xs tracking-[0.25em] text-zinc-400">[LEARN SOLANA]</div>
        <h2 id="learn-solana" className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">
          Pick your path
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((item) => (
          <Link key={item.title} href={item.href} className="group">
            <Card className="relative bg-white/[0.02] border-white/5 hover:bg-white/[0.04] transition-colors duration-300">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="relative h-12 w-12 shrink-0">
                  <Image src={item.icon} alt={item.title} fill sizes="48px" className="object-contain rounded-md" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm uppercase tracking-[0.18em] text-zinc-400">{item.subtitle}</div>
                  <div className="mt-0.5 text-lg font-semibold group-hover:text-white">{item.title}</div>
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
