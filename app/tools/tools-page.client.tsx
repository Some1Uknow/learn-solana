"use client";

import Link from "next/link";
import { toolCategories } from "@/data/tools-data";

const backgroundStyle = `
  radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
  radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
  radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
  radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
  #000000
`;

const categoryCards = toolCategories.map((cat) => ({
  id: cat.id,
  name: cat.name,
  description: cat.description,
  featured: cat.featured,
  icon: cat.icon,
  href: `/tools/${cat.id}`,
}));

export function ToolsPageClient() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0" style={{ background: backgroundStyle }} />

      <div className="relative z-10 flex min-h-screen w-full justify-center px-6 py-16 md:px-10">
        <div className="flex w-full max-w-7xl flex-col gap-12">
          <header className="space-y-8">
            <div className="space-y-4">
              <div className="text-xs tracking-[0.25em] text-zinc-500">[TOOLS]</div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Essential Solana Developer Tools & Infrastructure
              </h1>
              <p className="max-w-2xl text-sm text-zinc-400 sm:text-base">
                Discover the best tools, infrastructure, and services to build, deploy, and scale your Solana applications. Each category features trusted partners and projects built with these tools.
              </p>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.02] px-6 py-5">
              <p className="text-sm text-zinc-300">
                🤝 <span className="text-white font-medium">Partner with us:</span> Interested in featuring your tool? Reach out to showcase your product to Solana developers.
              </p>
            </div>
          </header>

          <section className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Tool Categories
              </h2>
              <p className="text-sm text-zinc-400 mt-2">
                Browse by category to find the right tools for your Solana development stack.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categoryCards.map((category) => (
                <ToolCategoryCard key={category.id} category={category} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

type CategoryCard = (typeof categoryCards)[number];

function ToolCategoryCard({ category }: { category: CategoryCard }) {
  return (
    <Link href={category.href}>
      <article className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-md transition duration-300 hover:-translate-y-1 hover:border-white/10 h-full">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition group-hover:opacity-100" />
        <div className="relative flex h-full flex-col gap-4">
          <div className="flex items-start justify-between">
            <div className="text-4xl">{category.icon}</div>
            <span className="inline-flex items-center rounded-full border border-[#14F195]/30 bg-[#14F195]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-[#14F195]">
              Featured
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold tracking-tight text-white">{category.name}</h3>
            <p className="mt-2 text-sm text-zinc-400">{category.description}</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div className="text-sm">
              <span className="text-zinc-500">Featured: </span>
              <span className="text-white font-medium">{category.featured}</span>
            </div>
            <svg
              className="w-5 h-5 text-zinc-400 group-hover:text-white group-hover:translate-x-1 transition-all"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ToolsPageClient;
