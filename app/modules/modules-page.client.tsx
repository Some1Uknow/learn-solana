"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { contentsData } from "../../data/contents-data";
import { useWeb3AuthUser } from "@web3auth/modal/react";
import { Search, ArrowRight } from "lucide-react";
import { BreadcrumbSchema } from "@/components/seo";

const modules = contentsData.modules;

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Modules", url: "/modules" },
];

export function ModulesPageClient() {
  const { userInfo } = useWeb3AuthUser();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return modules.filter((m) => {
      const inTitle = m.title.toLowerCase().includes(q);
      const inDesc = m.description.toLowerCase().includes(q);
      const inTopics = m.topics.some(
        (t: any) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
      return q ? inTitle || inDesc || inTopics : true;
    });
  }, [query]);

  return (
    <div className="min-h-screen bg-black text-white">
      <BreadcrumbSchema items={breadcrumbItems} />
      <Navbar />
      
      <div className="pt-24 pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-500 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Modules</span>
          </nav>

          {/* Header */}
          <div className="mb-10">
            <p className="text-xs uppercase tracking-widest text-[#14f195] mb-3">
              Learning Paths
            </p>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">
              {userInfo ? `Welcome back, ${userInfo?.name || "Developer"}` : "Master Solana Development"}
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl">
              Structured learning paths from fundamentals to advanced Solana programming.
            </p>
          </div>

          {/* Search */}
          <div className="mb-10">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search modules..."
                className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none transition-colors focus:border-neutral-700 focus:bg-neutral-900"
              />
            </div>
          </div>

          {/* Modules Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((module) => (
              <Link
                key={module.id}
                href={`/modules/${module.id}`}
                className="group rounded-lg border border-neutral-800 bg-neutral-900/30 p-6 transition-all hover:border-neutral-700 hover:bg-neutral-900/50"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative w-12 h-12 shrink-0">
                    <Image
                      src={module.image || "/placeholder.png"}
                      alt={module.title}
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-medium text-white truncate">
                      {module.title.replace(/^[^\w]*/, "")}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      {module.topics.length} lessons
                    </p>
                  </div>
                </div>
                <p className="text-sm text-neutral-400 line-clamp-2 mb-4">
                  {module.description}
                </p>
                <div className="flex items-center text-sm text-[#14f195]">
                  <span>Start learning</span>
                  <ArrowRight size={14} className="ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-neutral-500">No modules found matching "{query}"</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ModulesPageClient;
