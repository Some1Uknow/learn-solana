"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArrowRight } from "lucide-react";

const StatsBanner = dynamic(
  () => import("@/components/home/stats-banner").then((mod) => ({ default: mod.StatsBanner })),
  { 
    loading: () => <StatsBannerSkeleton />,
    ssr: true 
  }
);

const LearnSolanaSection = dynamic(
  () => import("@/components/home/learn-solana-section"),
  { ssr: true }
);

const XPostsMarquee = dynamic(
  () => import("@/components/home/x-posts-marquee"),
  { 
    loading: () => null,
    ssr: false
  }
);

function StatsBannerSkeleton() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 animate-pulse">
              <div className="h-8 w-16 bg-neutral-800 rounded mb-2" />
              <div className="h-4 w-24 bg-neutral-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomePageClient() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/50 px-3 py-1 text-xs text-neutral-400 mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-[#14f195] animate-pulse" />
            Free Solana Development Course
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tighter text-white mb-6">
            Master
            <span className="inline-flex items-center mx-3 md:mx-4">
              <Image
                src="/solanaMain.png"
                alt="Solana"
                width={120}
                height={120}
                priority
                className="h-12 sm:h-14 md:h-16 lg:h-20 w-auto"
              />
            </span>
            <br className="hidden sm:block" />
            <span className="text-neutral-500">without the hassle.</span>
          </h1>
          
          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-neutral-400 mb-10">
            Learn Solana development through interactive courses, games, and coding challenges. 
            From blockchain basics to production-ready dApps.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/modules"
              className="inline-flex items-center gap-2 rounded-lg bg-[#14f195] px-6 py-3 text-sm font-medium text-black transition-all hover:bg-[#12d182]"
            >
              Start Learning
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/games"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-transparent px-6 py-3 text-sm font-medium text-white transition-all hover:border-neutral-700 hover:bg-neutral-900"
            >
              Play Games
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <Suspense fallback={<StatsBannerSkeleton />}>
        <StatsBanner />
      </Suspense>

      {/* Features Section */}
      <Suspense fallback={null}>
        <LearnSolanaSection />
      </Suspense>

      {/* Social Proof */}
      <Suspense fallback={null}>
        <XPostsMarquee />
      </Suspense>

      <Footer />
    </div>
  );
}

export default HomePageClient;
