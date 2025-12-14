"use client";

import Link from "next/link";
import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

const partnerCategories = [
  { id: "rpc", name: "RPC Providers", available: true },
  { id: "wallets", name: "Wallets", available: true },
  { id: "indexing", name: "Indexing & Data", available: true },
  { id: "devtools", name: "Developer Tooling", available: true },
];

interface PlatformStats {
  totalUsers: number;
  totalTutorialMinutes: number;
  totalGamePlayers: number;
  totalRustChallengesAttempted: number;
  rustChallengeParticipants: number;
}

// Count-up animation component
function AnimatedCounter({ end, duration = 2, decimals = 0, suffix = "" }: { end: number; duration?: number; decimals?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(easeOutQuart * end);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, end, duration]);

  return (
    <div ref={ref} className="text-5xl font-semibold text-white">
      {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}
    </div>
  );
}

// Scroll-triggered section wrapper
function ScrollSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
      animate={isInView && !prefersReducedMotion ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export function PartnerPageClient() {
  const prefersReducedMotion = useReducedMotion();
  const [stats, setStats] = useState<PlatformStats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to fetch stats:", err));
  }, []);

  const fadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  };

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white">
      {/* Subtle gradient background - Vercel style */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-violet-900/10 via-black to-black" />

        {/* Floating gradient balls */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className={
              "absolute -top-24 -left-24 h-112 w-md rounded-full blur-3xl " +
              "bg-[radial-gradient(circle_at_30%_30%,rgba(167,139,250,0.35),rgba(59,130,246,0.12),transparent_65%)] " +
              "animate-[partner-float-1_18s_ease-in-out_infinite]"
            }
          />
          <div
            className={
              "absolute top-24 -right-32 h-104 w-104 rounded-full blur-3xl " +
              "bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.28),rgba(99,102,241,0.10),transparent_65%)] " +
              "animate-[partner-float-2_22s_ease-in-out_infinite]"
            }
          />
          <div
            className={
              "absolute -bottom-40 left-1/3 h-120 w-120 -translate-x-1/2 rounded-full blur-3xl " +
              "bg-[radial-gradient(circle_at_30%_30%,rgba(244,114,182,0.22),rgba(168,85,247,0.10),transparent_65%)] " +
              "animate-[partner-float-3_26s_ease-in-out_infinite]"
            }
          />
          <div className="absolute inset-0 bg-black/40" />
          <style>{`
            @keyframes partner-float-1 {
              0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
              50% { transform: translate3d(40px, 26px, 0) scale(1.06); }
            }
            @keyframes partner-float-2 {
              0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
              50% { transform: translate3d(-36px, 18px, 0) scale(1.05); }
            }
            @keyframes partner-float-3 {
              0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
              50% { transform: translate3d(0, -34px, 0) scale(1.07); }
            }
            @media (prefers-reduced-motion: reduce) {
              .animate-\[partner-float-1_18s_ease-in-out_infinite\],
              .animate-\[partner-float-2_22s_ease-in-out_infinite\],
              .animate-\[partner-float-3_26s_ease-in-out_infinite\] {
                animation: none !important;
              }
            }
          `}</style>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <motion.div
          className="space-y-24"
          initial={prefersReducedMotion ? false : "hidden"}
          animate={prefersReducedMotion ? undefined : "visible"}
          variants={stagger}
        >
          
          {/* Breadcrumb */}
          <motion.div
            className="flex items-center gap-2 text-sm text-zinc-500"
            variants={fadeUp}
          >
            <Link href="/tools" className="hover:text-zinc-300 transition-colors">
              Tools
            </Link>
            <span>/</span>
            <span className="text-zinc-300">Partner</span>
          </motion.div>

          {/* HERO SECTION - Left aligned, Vercel style */}
          <motion.header className="space-y-4 max-w-4xl" variants={fadeUp}>
            <motion.div className="space-y-4" variants={stagger}>
              <motion.h1
                className="text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1]"
                variants={fadeUp}
              >
                Become the Default Stack for Solana Developers
              </motion.h1>
              <motion.p
                className="text-xl sm:text-2xl text-zinc-400 leading-relaxed max-w-3xl"
                variants={fadeUp}
              >
                LearnSol partners don&apos;t buy ads. They become the default infrastructure developers use while learning Solana.
              </motion.p>
            </motion.div>
            
            <motion.div className="pt-2 border-t border-zinc-800/50" variants={fadeUp}>
              <motion.p className="text-lg text-zinc-400 leading-relaxed max-w-2xl" variants={fadeUp}>
                We integrate partner tools directly into tutorials, code examples, and AI-assisted learning flows at the exact moment developers choose their stack.
              </motion.p>
            </motion.div>
          </motion.header>

          {/* PLATFORM CONTEXT */}
          <motion.section className="space-y-2 max-w-3xl" variants={fadeUp}>
            <motion.p className="text-lg text-zinc-400 leading-relaxed" variants={fadeUp}>
              LearnSol is a hands-on learning platform focused on Rust, Anchor, and real-world Solana program development. Our audience consists of high-intent developers actively building their first serious Solana applications.
            </motion.p>
          </motion.section>

          {/* PLATFORM SNAPSHOT - Clean stats grid */}
          <ScrollSection>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/20 p-6 space-y-2 hover:border-zinc-700/50 transition-colors">
                  <AnimatedCounter end={stats?.totalUsers || 1250} suffix="+" />
                  <div className="text-sm text-zinc-400">Solana Learners</div>
                </div>
                
                <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/20 p-6 space-y-2 hover:border-zinc-700/50 transition-colors">
                  <AnimatedCounter end={stats?.totalTutorialMinutes || 2700} suffix=" min" />
                  <div className="text-sm text-zinc-400">Total Tutorial Minutes Read</div>
                </div>

                <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/20 p-6 space-y-2 hover:border-zinc-700/50 transition-colors">
                  <AnimatedCounter end={stats?.totalRustChallengesAttempted || 200} suffix="+" />
                  <div className="text-sm text-zinc-400">Coding Challenges Attempted</div>
                </div>

                <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/20 p-6 space-y-2 hover:border-zinc-700/50 transition-colors">
                  <AnimatedCounter end={stats?.totalGamePlayers || 30} suffix="+" />
                  <div className="text-sm text-zinc-400">Games Played</div>
                </div>
              </div>

              <div className="max-w-2xl">
                <p className="text-base text-zinc-500 italic border-l-2 border-zinc-800 pl-4">
                  Growing more day by day.
                </p>
              </div>
          </ScrollSection>

          {/* WHY PARTNER */}
          <ScrollSection>
            <section className="space-y-8">
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                  Why Partner with LearnSol
                </h2>
                <p className="text-xl text-zinc-400 leading-relaxed">
                  Most developer tools compete too late when habits are already formed.
                </p>
              </div>

            <div className="max-w-3xl space-y-6">
              <p className="text-lg text-zinc-400 leading-relaxed">
                LearnSol partners reach developers <strong className="text-white font-medium">before preferences are locked in</strong>, while they are:
              </p>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/20 px-4 py-3">
                  <span className="text-sm text-zinc-300">Setting up their first RPC</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/20 px-4 py-3">
                  <span className="text-sm text-zinc-300">Choosing wallets</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/20 px-4 py-3">
                  <span className="text-sm text-zinc-300">Querying on-chain data</span>
                </div>
                <div className="flex items-center gap-3 rounded-lg border border-zinc-800/50 bg-zinc-900/20 px-4 py-3">
                  <span className="text-sm text-zinc-300">Deploying real programs</span>
                </div>
              </div>

              <div className="pt-4">
                <p className="text-xl font-medium text-white">
                  This is where defaults are formed.
                </p>
              </div>
            </div>
            </section>
          </ScrollSection>

          {/* WHAT PARTNERS GET */}
          <ScrollSection>
            <section className="space-y-8">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                What Partners Get
              </h2>
            </div>

            {/* Match Platform Snapshot grid + card styling (2x3 layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 max-w-5xl">
              {/* Default Tool Positioning */}
              <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/20 p-6 space-y-2 hover:border-zinc-700/50 transition-colors">
                <div className="space-y-1.5">
                  <div className="text-lg sm:text-xl font-semibold text-white truncate">
                    Default Tool Positioning
                  </div>
                  <div className="text-sm text-zinc-400 leading-relaxed">
                    Your product is the <span className="text-white font-medium">primary reference implementation</span> across key tutorials and examples.
                  </div>
                  <div className="text-sm text-zinc-500 leading-relaxed">
                    Developers ship first working builds using your stack, not just seeing your logo.
                  </div>
                </div>
              </div>

              {/* Tutorial Integration */}
              <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/20 p-6 space-y-2 hover:border-zinc-700/50 transition-colors">
                <div className="space-y-1.5">
                  <div className="text-lg sm:text-xl font-semibold text-white truncate">
                    Deep Tutorial Integration
                  </div>
                  <div className="text-sm text-zinc-400 leading-relaxed">
                    Dedicated tutorials, real Rust / Solana examples, and repeated mentions across the learning journey.
                  </div>
                  <div className="text-sm text-zinc-500 leading-relaxed">
                    Evergreen, instructional content that ranks and compounds over time.
                  </div>
                </div>
              </div>

              {/* AI Assistant */}
              <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/20 p-6 space-y-2 hover:border-zinc-700/50 transition-colors">
                <div className="space-y-1.5">
                  <div className="text-lg sm:text-xl font-semibold text-white truncate">
                    AI Assistant Recommendations
                  </div>
                  <div className="text-sm text-zinc-400 leading-relaxed">
                    When learners ask infra or tooling questions, your product is suggested as the <span className="text-white font-medium">default starting option</span>.
                  </div>
                  <div className="text-sm text-zinc-500 leading-relaxed">
                    Answers include setup flows aligned with your docs and best practices.
                  </div>
                </div>
              </div>

              {/* Category Exclusivity */}
              <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/20 p-6 space-y-2 hover:border-zinc-700/50 transition-colors">
                <div className="space-y-1.5">
                  <div className="text-lg sm:text-xl font-semibold text-white truncate">
                    Category Exclusivity
                  </div>
                  <div className="text-sm text-zinc-400 leading-relaxed">
                    We feature <span className="text-white font-medium">one primary partner per category</span> (RPC, wallets, indexing, devtools).
                  </div>
                  <div className="text-sm text-zinc-500 leading-relaxed">
                    Clear recommendations with no competing noise at the decision moment.
                  </div>
                </div>
              </div>

              {/* Early Feedback */}
              <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/20 p-6 space-y-2 hover:border-zinc-700/50 transition-colors">
                <div className="space-y-1.5">
                  <div className="text-lg sm:text-xl font-semibold text-white truncate">
                    Early Developer Feedback
                  </div>
                  <div className="text-sm text-zinc-400 leading-relaxed">
                    Direct input from builders on onboarding friction, docs clarity, and DX pain points.
                  </div>
                  <div className="text-sm text-zinc-500 leading-relaxed">
                    Especially valuable for infra teams tightening their developer journey.
                  </div>
                </div>
              </div>

              {/* Video & Content Tie-in */}
              <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/20 p-6 space-y-2 hover:border-zinc-700/50 transition-colors">
                <div className="space-y-1.5">
                  <div className="text-lg sm:text-xl font-semibold text-white truncate">
                    Content & Video Presence
                  </div>
                  <div className="text-sm text-zinc-400 leading-relaxed">
                    Inclusion in future walkthroughs, recorded demos, and content drops as the platform grows.
                  </div>
                  <div className="text-sm text-zinc-500 leading-relaxed">
                    Not a one-off shoutout, but ongoing contextual usage.
                  </div>
                </div>
              </div>
            </div>
            </section>
          </ScrollSection>

          {/* VIDEO & CONTENT EXPANSION */}
          <ScrollSection>
            <section className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Video & Content Expansion
              </h2>
            </div>
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/10 p-8 space-y-3">
              <p className="text-base text-zinc-400 leading-relaxed">
                As LearnSol expands into video content and walkthroughs, partner tools will be used in recorded demos, referenced in YouTube tutorials, and credited in descriptions and learning materials.
              </p>
              <div className="pt-3 border-t border-zinc-800/50">
                <p className="text-sm text-zinc-500">
                  We don't promise virality.
                </p>
                <p className="text-base text-white font-medium">
                  We promise consistent, contextual exposure as the platform grows.
                </p>
              </div>
            </div>
            </section>
          </ScrollSection>

          {/* HOW LEARNSOL DRIVES ADOPTION */}
          <ScrollSection>
            <section className="space-y-8">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                How LearnSol Drives Adoption
              </h2>
              <p className="text-xl text-zinc-400">
                LearnSol doesn't sell impressions. It shapes <strong className="text-white font-medium">developer defaults</strong>.
              </p>
            </div>

            <div className="max-w-3xl">
              <div className="space-y-3">
                {[
                  { num: "1", text: "Developer learns Rust & Solana fundamentals" },
                  { num: "2", text: "They reach the point where infra is required" },
                  { num: "3", text: "Partner tool is introduced as the default option" },
                  { num: "4", text: "Developer uses it to build their first real app" },
                  { num: "5", text: "Habits form early switching later is unlikely" },
                ].map((step) => (
                  <div key={step.num} className="flex items-start gap-4 rounded-lg border border-zinc-800/50 bg-zinc-900/10 p-4">
                    <div className="shrink-0 w-7 h-7 rounded-full border border-zinc-700 flex items-center justify-center text-sm font-medium text-zinc-400">
                      {step.num}
                    </div>
                    <p className="text-sm text-zinc-400 leading-relaxed pt-0.5">
                      {step.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-8">
                <p className="text-xl font-semibold text-white">
                  This is long-term adoption, not short-term exposure.
                </p>
              </div>
            </div>
            </section>
          </ScrollSection>

          {/* AVAILABLE CATEGORIES */}
          <ScrollSection>
            <section className="space-y-8">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Available Partner Categories
              </h2>
              <p className="text-base text-zinc-400">
                We currently onboard partners in a limited set of core infrastructure categories
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-4xl">
              {partnerCategories.map((category) => (
                <div
                  key={category.id}
                  className={`rounded-lg border p-6 space-y-3 transition-colors ${
                    category.available
                      ? "border-zinc-800/50 bg-zinc-900/10 hover:border-zinc-700/50"
                      : "border-zinc-800/30 bg-zinc-900/5 opacity-60"
                  }`}
                >
                  <div>
                    <div className="text-base font-medium text-white mb-1">{category.name}</div>
                    <div className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                      category.available 
                        ? "bg-violet-500/10 text-violet-300 border border-violet-500/20" 
                        : "bg-zinc-800/50 text-zinc-500"
                    }`}>
                      {category.available ? "Available" : "Limited"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="max-w-2xl">
              <p className="text-sm text-zinc-500 italic border-l-2 border-zinc-800 pl-4">
                We intentionally keep categories limited to maintain quality and trust.
              </p>
            </div>
            </section>
          </ScrollSection>

          {/* PARTNERSHIP MODEL */}
          <ScrollSection>
            <section className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                Partnership Model
              </h2>
            </div>
            <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/10 p-8 space-y-4">
              <p className="text-base text-zinc-400">
                We offer:
              </p>
              <ul className="space-y-2 text-sm text-zinc-400 list-disc list-inside">
                <li>Pilot partnerships for early partners</li>
                <li>Monthly or quarterly engagements</li>
                <li>Founder-led integrations during early phases</li>
              </ul>
              <div className="pt-3 border-t border-zinc-800/50">
                <p className="text-sm text-zinc-500">
                  Pricing depends on: <span className="text-zinc-300">category</span>, <span className="text-zinc-300">integration depth</span>, and <span className="text-zinc-300">duration</span>
                </p>
              </div>
            </div>
            </section>
          </ScrollSection>

          {/* GET STARTED - Clean CTA */}
          <ScrollSection>
            <section className="space-y-8">
            <div className="space-y-2 max-w-3xl">
              <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                Get Started
              </h2>
              <p className="text-base text-zinc-400">
                If you&apos;re building infrastructure or tooling for Solana developers and want to be part of the learning flow
              </p>
            </div>
            
            {/* Email CTA - Vercel clean style */}
            <div className="max-w-2xl">
              <a
                href="mailto:raghav@learnsol.site?subject=Featured%20Partner%20Inquiry"
                className="group block rounded-lg border border-zinc-800/50 bg-zinc-900/10 p-8 transition-all hover:border-zinc-700/50 hover:bg-zinc-900/20"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div>
                      <div className="text-xs text-zinc-500 mb-1">Email</div>
                      <div className="text-xl font-medium text-white group-hover:text-violet-300 transition-colors">
                        raghav@learnsol.site
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                    <span>Subject: Featured Partner Inquiry</span>
                  </div>
                </div>
              </a>
            </div>
            </section>
          </ScrollSection>

          {/* WHAT TO INCLUDE */}
          <ScrollSection>
            <section className="rounded-lg border border-zinc-800/50 bg-zinc-900/10 p-8 space-y-6 max-w-4xl">
            <h3 className="text-2xl font-semibold text-white">
              Include in Your Inquiry
            </h3>
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-medium text-zinc-500">01</div>
                  <div className="text-base font-medium text-white">Company & Product</div>
                </div>
                <p className="text-sm text-zinc-500 pl-7">Company name and product name</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-medium text-zinc-500">02</div>
                  <div className="text-base font-medium text-white">Category</div>
                </div>
                <p className="text-sm text-zinc-500 pl-7">Which category you&apos;re targeting</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-medium text-zinc-500">03</div>
                  <div className="text-base font-medium text-white">Developer Value</div>
                </div>
                <p className="text-sm text-zinc-500 pl-7">How your product helps Solana developers</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-lg font-medium text-zinc-500">04</div>
                  <div className="text-base font-medium text-white">Integration Ideas</div>
                </div>
                <p className="text-sm text-zinc-500 pl-7">Any ideas for tutorials or integrations</p>
              </div>
            </div>
            </section>
          </ScrollSection>

          {/* Back to Tools */}
          <div className="pt-8">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Tools
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default PartnerPageClient;