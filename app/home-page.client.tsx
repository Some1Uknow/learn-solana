"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Suspense } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import SponsorSection from "@/components/home/sponsor-section";

// Lazy load below-the-fold components for faster initial load
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
    loading: () => <MarqueeSkeleton />,
    ssr: false // Client-only for marquee animations
  }
);

// Lightweight skeleton components
function StatsBannerSkeleton() {
  return (
    <section className="container relative z-10 py-16 md:py-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 animate-pulse">
            <div className="flex flex-col items-center space-y-4">
              <div className="h-12 w-12 bg-white/5 rounded-2xl" />
              <div className="h-10 w-24 bg-white/5 rounded-lg" />
              <div className="h-4 w-28 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function MarqueeSkeleton() {
  return (
    <section className="container relative z-10 py-10 md:py-14">
      <div className="mb-6 text-center">
        <div className="h-4 w-32 bg-white/5 rounded mx-auto mb-2" />
        <div className="h-8 w-64 bg-white/5 rounded mx-auto" />
      </div>
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-[320px] h-32 rounded-2xl bg-white/[0.02] animate-pulse shrink-0" />
        ))}
      </div>
    </section>
  );
}

export function HomePageClient() {
  return (
    <div className="min-h-screen w-full relative text-white" role="main">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #000000 40%, #010133 100%)",
        }}
      />
      <Navbar />
      <div
        className="px-4 sm:px-6 md:px-8 pb-6 md:pb-8 pt-24 md:pt-28"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="relative h-auto min-h-[70vh] mb-20 md:h-[calc(100vh-140px)] rounded-2xl md:rounded-3xl overflow-hidden bg-[#030303]"
        >
          <div 
            className="absolute inset-0 pointer-events-none opacity-40"
            style={{
              backgroundImage: "url('/hero-bg.svg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          {/* Dark overlay for extra dimming */}
          <div className="absolute inset-0 bg-black/30 pointer-events-none" />
          <div className="absolute inset-0 z-30 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 px-4 text-center">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                className="flex flex-wrap items-baseline justify-center gap-4 md:gap-8"
              >
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.7, ease: "easeOut" }}
                  className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tighter leading-none"
                >
                  <span className="sr-only">Learn Solana - </span>master
                </motion.h1>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.8,
                    duration: 0.6,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className="flex items-center"
                >
                  <Image
                    src="/solanaMain.png"
                    alt="Solana blockchain development"
                    width={120}
                    height={120}
                    priority
                    className="object-contain h-10 sm:h-14 md:h-15 w-auto"
                    sizes="(max-width: 640px) 40px, (max-width: 768px) 56px, 60px"
                  />
                </motion.div>
              </motion.div>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.7, ease: "easeOut" }}
                className="text-base sm:text-lg md:text-2xl lg:text-3xl text-white/70 tracking-tighter italic"
              >
                without any hassle.
              </motion.p>
            </div>
          </div>
        </motion.div>
        {/* Sponsor Section */}
        <SponsorSection />

        {/* Stats Banner - Lazy loaded */}
        <Suspense fallback={<StatsBannerSkeleton />}>
          <StatsBanner />
        </Suspense>

        {/* Learn Solana section - Lazy loaded */}
        <Suspense fallback={null}>
          <LearnSolanaSection />
        </Suspense>

        {/* X posts marquee - Lazy loaded, client only */}
        <Suspense fallback={<MarqueeSkeleton />}>
          <XPostsMarquee />
        </Suspense>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomePageClient;
