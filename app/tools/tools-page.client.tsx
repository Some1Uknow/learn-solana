"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BreadcrumbSchema } from "@/components/seo";

const tools = [
  {
    id: "runtime-lab",
    name: "Runtime Lab",
    description:
      "Program-flow lab library where beginners pick a Solana program, follow a flow, inspect runtime checks, compare account diffs, and debug failures.",
    href: "/tools/runtime-lab",
    meta: "4 programs",
    cta: "Start learning",
  },
  {
    id: "visual-builder",
    name: "Visual Builder",
    description:
      "Map programs, instructions, signers, PDAs, and token accounts visually, then export a beginner-friendly Anchor starter.",
    href: "/tools/visual-builder",
    meta: "Builder",
    cta: "Open builder",
  },
];

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
];

export function ToolsPageClient() {
  const [query, setQuery] = useState("");

  const filteredTools = useMemo(() => {
    const q = query.toLowerCase().trim();
    return tools.filter((tool) => {
      return q
        ? tool.name.toLowerCase().includes(q) ||
            tool.description.toLowerCase().includes(q)
        : true;
    });
  }, [query]);

  return (
    <div className="min-h-screen bg-black text-white">
      <BreadcrumbSchema items={breadcrumbItems} />
      <Navbar />

      <div className="pt-24 pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <nav className="mb-8 text-sm text-neutral-500">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Tools</span>
          </nav>

          <div className="mb-10">
            <p className="mb-3 text-xs uppercase tracking-widest text-[#14f195]">
              Interactive Labs
            </p>
            <h1 className="mb-4 text-4xl font-medium tracking-tight md:text-5xl">
              Learn Solana by interacting with it
            </h1>
            <p className="max-w-2xl text-lg text-neutral-400">
              Start with Runtime Lab to understand what Solana validates, why
              transactions fail, and what actually changes on-chain. Then move
              into Visual Builder to map those ideas visually.
            </p>
          </div>

          <div className="mb-10">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search tools..."
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition-colors placeholder:text-neutral-500 focus:border-neutral-700 focus:bg-neutral-900"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className="group rounded-lg border border-neutral-800 bg-neutral-900/30 p-6 transition-all hover:border-neutral-700 hover:bg-neutral-900/50"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-medium text-white">{tool.name}</h3>
                    <p className="mt-1 text-xs text-neutral-500">{tool.meta}</p>
                  </div>
                </div>
                <p className="mb-4 text-sm text-neutral-400">{tool.description}</p>
                <div className="flex items-center text-sm text-[#14f195]">
                  <span>{tool.cta}</span>
                  <ArrowRight
                    size={14}
                    className="ml-1 transition-transform group-hover:translate-x-1"
                  />
                </div>
              </Link>
            ))}
          </div>

          {filteredTools.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-neutral-500">No tools found matching "{query}"</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ToolsPageClient;
