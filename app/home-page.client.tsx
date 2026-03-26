"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";

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
      
      {/* Hero Section - Dimensional Stack */}
      <HeroSection />

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
