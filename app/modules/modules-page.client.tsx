"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Search } from "lucide-react";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BreadcrumbSchema } from "@/components/seo";
import { contentsData } from "../../data/contents-data";

const modules = contentsData.modules;
const breadcrumbItems = [{ name: "Home", url: "/" }, { name: "Modules", url: "/modules" }];

export function ModulesPageClient() {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return modules.filter((module) => !q || [module.title, module.description, ...module.topics.map((topic) => `${topic.title} ${topic.description}`)].some((text) => text.toLowerCase().includes(q)));
  }, [query]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#181818]">
      <BreadcrumbSchema items={breadcrumbItems} />
      <Navbar />
      <main>
        <header className="border-b border-[#dedede] py-20">
          <div className="ds-shell">
            <p className="ds-section-label">Curriculum</p>
            <h1 className="mt-4 text-4xl font-medium leading-none tracking-[-0.03em] md:text-5xl">Learning Modules</h1>
            <p className="mt-4 max-w-[672px] leading-7 text-[#636363]">Learn Rust, Anchor, the Solana runtime and modern clients. Start with the fundamentals or search for a topic.</p>
            <label className="mt-8 flex h-10 max-w-[560px] items-center gap-3 rounded-[6px] border border-[#dedede] bg-white px-3 focus-within:ring-2 focus-within:ring-[#6b8f27]/60">
              <Search className="h-4 w-4 text-[#636363]" aria-hidden="true" />
              <span className="sr-only">Search modules</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search modules" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#858585]" />
            </label>
          </div>
        </header>
        <section className="py-16 md:py-20">
          <div className="ds-shell grid gap-5 md:grid-cols-2">
            {filtered.map((module, index) => (
              <article key={module.id} className="flex min-w-0 flex-col gap-5 rounded-xl border border-[#dedede] bg-white p-5 sm:p-6">
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#636363]">[ {String(index + 1).padStart(2, "0")} / {String(modules.length).padStart(2, "0")} ] · {module.topics.length + 1} lessons</p>
                <div><h2 className="text-xl font-medium leading-none tracking-[-0.02em]">{module.title.replace(/^[^\w]*/, "")}</h2><p className="mt-3 leading-6 text-[#636363]">{module.description}</p></div>
                <div className="mt-auto flex items-center gap-2 text-sm text-[#636363]"><BookOpen className="h-4 w-4" />{module.goal}</div>
                <Link href={`/modules/${module.id}`} className="ds-focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-[6px] border border-[#dedede] bg-[#efefef] px-5 text-sm font-medium shadow-[0_1px_2px_rgba(0,0,0,0.12)] transition-opacity hover:opacity-80">Open module <ArrowRight className="h-4 w-4" /></Link>
              </article>
            ))}
          </div>
          {filtered.length === 0 && <div className="ds-shell py-16 text-center text-sm text-[#636363]">No modules match “{query}”.</div>}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default ModulesPageClient;
