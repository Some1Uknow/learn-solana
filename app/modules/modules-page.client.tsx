"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Inter, Space_Grotesk } from "next/font/google";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BreadcrumbSchema } from "@/components/seo";
import { contentsData } from "../../data/contents-data";

const modules = contentsData.modules;

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Modules", url: "/modules" },
];

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

function ModuleCard({
  module,
  index,
}: {
  module: (typeof modules)[number];
  index: number;
}) {
  const title = module.title.replace(/^[^\w]*/, "");

  return (
    <Link
      href={`/modules/${module.id}`}
      className="group relative overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,rgba(15,15,15,0.98),rgba(8,8,8,0.98))] p-4 text-white shadow-[0_24px_64px_rgba(0,0,0,0.42),_0_0_0_1px_rgba(255,255,255,0.02)] transition duration-300 hover:-translate-y-1"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(169,255,47,0.12),transparent_28%),radial-gradient(circle_at_86%_8%,rgba(169,255,47,0.06),transparent_24%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.03),transparent_28%,transparent_72%,rgba(255,255,255,0.02))] opacity-70" />

      <div className="relative z-10 flex min-h-[9rem] items-stretch gap-4 sm:gap-5">
        <div className="flex w-28 shrink-0 items-center justify-center sm:w-32">
          <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-[linear-gradient(180deg,rgba(169,255,47,0.12),rgba(169,255,47,0.04))]">
            <Image
              src={module.image || "/placeholder.png"}
              alt={module.title}
              fill
              sizes="96px"
              className="object-contain p-2.5"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 py-0.5">
          <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-[#a9ff2f]/80">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 text-[9px] text-white/60">
              Module {String(index + 1).padStart(2, "0")}
            </span>
            <span>{module.topics.length} lessons</span>
          </div>

          <h2 className={`mt-3 text-xl leading-[1.05] text-white sm:text-[1.65rem] ${display.className}`}>
            {title}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/58 sm:text-[0.95rem]">
            {module.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-white/42">
              <span className="inline-block h-2 w-2 rounded-full bg-[#a9ff2f] shadow-[0_0_18px_rgba(169,255,47,0.45)]" />
              <span>{module.goal}</span>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-[#a9ff2f]/20 bg-[#a9ff2f]/10 px-3 py-2 text-xs font-semibold text-[#d8ff98] transition group-hover:border-[#a9ff2f]/30 group-hover:bg-[#a9ff2f]/15">
              Open path
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export function ModulesPageClient() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return modules.filter((m) => {
      const inTitle = m.title.toLowerCase().includes(q);
      const inDesc = m.description.toLowerCase().includes(q);
      const inTopics = m.topics.some(
        (topic: any) =>
          topic.title.toLowerCase().includes(q) ||
          topic.description.toLowerCase().includes(q)
      );
      return q ? inTitle || inDesc || inTopics : true;
    });
  }, [query]);

  return (
    <div
      className={`${body.className} min-h-screen overflow-x-clip bg-black text-white`}
    >
      <BreadcrumbSchema items={breadcrumbItems} />
      <Navbar />

      <main className="pt-24">
        <section className="border-b border-white/[0.04] pb-8">
          <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#a9ff2f]">
                Learning Paths
              </p>
              <h1
                className={`mt-4 text-4xl leading-[0.95] tracking-[-0.065em] text-white sm:text-5xl lg:text-6xl ${display.className}`}
              >
                Modules
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/58 sm:text-lg">
                Structured learning paths from fundamentals to advanced Solana programming,
                presented with the same visual language as the home page.
              </p>
            </div>

            <div className="mt-8 flex max-w-xl items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.25)]">
              <Search className="h-4 w-4 shrink-0 text-white/36" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search modules"
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/32"
              />
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-10">
          <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
            <div className="grid gap-4 md:grid-cols-2 md:auto-rows-fr">
              {filtered.map((module, index) => (
                <ModuleCard key={module.id} module={module} index={index} />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="py-20 text-center text-sm text-white/46">
                No modules found matching "{query}"
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ModulesPageClient;
