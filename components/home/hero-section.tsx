"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { DimensionalStack } from "./dimensional-stack";

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] lg:min-h-[90vh] overflow-hidden">
      {/* Layer 1: Atmospheric Background */}
      <div 
        className="absolute inset-0 -z-20"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, rgba(20, 241, 149, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(153, 69, 255, 0.07) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 20%, rgba(0, 194, 255, 0.05) 0%, transparent 40%),
            linear-gradient(to bottom, #000000 0%, #030303 100%)
          `,
        }}
      />

      {/* Layer 2: Subtle noise texture */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 pb-16 lg:pt-40 lg:pb-32">
        <div className="grid lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-12 items-center">
          
          {/* Left: Typography */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[#14f195]/20 bg-[#14f195]/5 px-3 sm:px-4 py-1.5 backdrop-blur-sm opacity-0 animate-fade-up [animation-delay:200ms]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#14f195] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#14f195]" />
              </span>
              <span className="text-xs sm:text-sm font-medium text-[#14f195]">Free Forever</span>
            </div>

            {/* Main Headline - master + Solana Logo */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[0.95] opacity-0 animate-fade-up [animation-delay:300ms]">
                <span className="text-white ml-1">master</span>
                <Image
                  src="/solanaMain.png"
                  alt="Solana"
                  width={160}
                  height={160}
                  priority
                  className="inline-block h-10 sm:h-10 md:h-12 lg:h-16 w-auto sm:ml-3 lg:ml-4 align-middle -mt-1 sm:-mt-2"
                />
              </h1>
              
              {/* Subtitle - elegant and understated */}
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light tracking-tight text-neutral-500 opacity-0 animate-fade-up [animation-delay:450ms] ml-1">
                without the hassle.
              </p>
            </div>

            {/* Description */}
            <p className="text-base sm:text-lg text-neutral-400 max-w-md leading-relaxed opacity-0 animate-fade-up [animation-delay:550ms]">
              Interactive courses, hands-on challenges, and real-world projects. 
              Everything you need to become a Solana developer.
            </p>

            {/* CTA Group */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 opacity-0 animate-fade-up [animation-delay:650ms]">
              {/* Primary CTA */}
              <Link href="/modules" className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#14f195] to-[#00c2ff] rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300" />
                <div className="relative flex items-center justify-center gap-2 rounded-lg bg-[#14f195] px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-medium text-black transition-all">
                  Start Learning
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>

              {/* Secondary CTA */}
              <Link
                href="/challenges"
                className="flex items-center justify-center gap-2 rounded-lg border border-neutral-800 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-medium text-white hover:border-neutral-700 hover:bg-neutral-900/50 transition-all"
              >
                Browse Challenges
              </Link>
            </div>
          </div>

          {/* Right: Dimensional Stack - Desktop only */}
          <div className="relative hidden lg:block">
            <DimensionalStack />
          </div>

        </div>
      </div>

      {/* Mobile/Tablet: Show simplified cards */}
      <div className="lg:hidden px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="relative mx-auto max-w-md opacity-0 animate-fade-up [animation-delay:700ms]">
          <div className="space-y-3 sm:space-y-4">
            <div className="transform rotate-1">
              <div className="bg-neutral-900/70 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[0_0_40px_-10px_rgba(0,194,255,0.3)]">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-[#00c2ff]/10">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#00c2ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-white">Progress: 73%</span>
                    <div className="h-1 sm:h-1.5 w-20 sm:w-24 bg-neutral-800 rounded-full mt-1 overflow-hidden">
                      <div className="h-full w-[73%] bg-gradient-to-r from-[#00c2ff] to-[#14f195] rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="transform -rotate-1">
              <div className="bg-neutral-900/70 backdrop-blur-xl border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-[0_0_40px_-10px_rgba(20,241,149,0.3)]">
                <div className="font-mono text-[10px] sm:text-xs text-neutral-400">
                  <span className="text-[#9945ff]">#[program]</span>
                  <br />
                  <span className="text-[#00c2ff]">pub mod</span>{" "}
                  <span className="text-white">learn_solana</span> {"{"}...{"}"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
