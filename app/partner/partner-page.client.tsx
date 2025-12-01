"use client";

import Link from "next/link";

const backgroundStyle = `
  radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
  radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
  radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
  radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
  #000000
`;

const categories = [
  "RPC Providers",
  "Indexing & Data",
  "Wallets",
  "Storage & Archival",
  "Development Tools",
  "Block Explorers",
  "Security & Audits",
  "Analytics & Observability",
  "NFT & Asset APIs",
  "Web3 Hosting & Edge",
];

const benefits = [
  {
    icon: "⭐",
    title: "Premium Placement",
    description: "Your product featured prominently at the top of its category page with dedicated branding.",
  },
  {
    icon: "🤖",
    title: "AI Assistant Recommendations",
    description: "Featured partners are recommended by our AI assistant when developers ask for tool suggestions.",
  },
  {
    icon: "📚",
    title: "Tutorial Mentions",
    description: "Integration into relevant learning content and developer tutorials across the platform.",
  },
  {
    icon: "🔒",
    title: "Category Exclusivity",
    description: "Only one Featured Partner per category, ensuring maximum visibility and differentiation.",
  },
];

export function PartnerPageClient() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0" style={{ background: backgroundStyle }} />

      <div className="relative z-10 flex min-h-screen w-full justify-center px-6 py-16 md:px-10">
        <div className="flex w-full max-w-4xl flex-col gap-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <Link href="/tools" className="hover:text-white transition">
              Tools
            </Link>
            <span>/</span>
            <span className="text-white">Partner</span>
          </div>

          {/* Header */}
          <header className="space-y-6 text-center">
            <div className="inline-flex items-center rounded-full border border-[#14F195]/30 bg-[#14F195]/10 px-4 py-1.5 text-sm font-medium text-[#14F195]">
              Partnership Opportunities
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Partner with LearnSol
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-zinc-400">
              We&apos;re onboarding new Solana developers at scale. LearnSol offers exclusive Featured Partner slots across key infrastructure categories.
            </p>
          </header>

          {/* Categories Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-white text-center">
              Available Partner Categories
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <span
                  key={category}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300"
                >
                  {category}
                </span>
              ))}
            </div>
          </section>

          {/* Benefits Section */}
          <section className="space-y-8">
            <h2 className="text-xl font-semibold text-white text-center">
              Partnership Benefits
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className="rounded-2xl border border-white/10 bg-white/2 p-6 space-y-3"
                >
                  <div className="text-3xl">{benefit.icon}</div>
                  <h3 className="text-lg font-semibold text-white">{benefit.title}</h3>
                  <p className="text-sm text-zinc-400">{benefit.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-white text-center">
              Get in Touch
            </h2>
            <p className="text-center text-zinc-400">
              To become a Featured Partner, contact us at:
            </p>
            
            {/* Email Card */}
            <div className="mx-auto max-w-md">
              <a
                href="mailto:raghav@learnsol.site"
                className="block rounded-2xl border border-[#14F195]/20 bg-[#14F195]/5 p-6 text-center transition hover:border-[#14F195]/40 hover:bg-[#14F195]/10"
              >
                <div className="text-sm text-zinc-400 mb-2">Email</div>
                <div className="text-xl font-semibold text-[#14F195]">
                  raghav@learnsol.site
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-sm text-zinc-300">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Click to send email
                </div>
              </a>
            </div>
          </section>

          {/* What to Include */}
          <section className="rounded-2xl border border-white/10 bg-white/2 p-8 space-y-4">
            <h3 className="text-lg font-semibold text-white">What to Include in Your Inquiry</h3>
            <ul className="space-y-2 text-sm text-zinc-400">
              <li className="flex items-start gap-2">
                <span className="text-[#14F195] mt-0.5">→</span>
                Your company name and product
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#14F195] mt-0.5">→</span>
                The category you&apos;re interested in (RPC, Wallets, Security, etc.)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#14F195] mt-0.5">→</span>
                Brief description of how your product helps Solana developers
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#14F195] mt-0.5">→</span>
                Any specific partnership ideas or integrations you have in mind
              </li>
            </ul>
          </section>

          {/* Back to Tools */}
          <div className="text-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PartnerPageClient;
