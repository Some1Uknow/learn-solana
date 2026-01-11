"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { BlurFade } from "@/components/ui/blur-fade";
import { contentsData } from "../../data/contents-data";
import { useWeb3AuthUser } from "@web3auth/modal/react";
import { BookOpen, Search } from "lucide-react";

const modules = contentsData.modules;

export function ModulesPageClient() {
  const router = useRouter();
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
    <div className="min-h-screen w-full relative text-white">
      {/* Fixed gradient background - Learning/Knowledge theme */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 0%, rgba(153, 69, 255, 0.18), transparent 60%),
            radial-gradient(circle 400px at 85% 80%, rgba(20, 241, 149, 0.12), transparent),
            radial-gradient(circle 300px at 10% 60%, rgba(153, 69, 255, 0.08), transparent),
            radial-gradient(circle 500px at 50% 50%, rgba(20, 241, 149, 0.04), transparent),
            #000000
          `,
        }}
      />
      
      <Navbar />
      
      <div className="pt-28 pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <BlurFade delay={0.05} inView>
            <nav className="text-sm text-zinc-400 mb-8">
              <Link href="/" className="hover:text-[#14f195] transition-colors">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-white">Modules</span>
            </nav>
          </BlurFade>

          {/* Header */}
          <BlurFade delay={0.1} inView>
            <div className="mb-10">
              <div className="text-xs tracking-[0.25em] text-[#14f195] uppercase font-medium">[LEARNING PATHS]</div>
              <h1 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
                {userInfo ? `Welcome back, ${userInfo?.name || "Developer"}` : "Master Solana Development"}
              </h1>
              <p className="mt-4 text-lg text-zinc-400 max-w-2xl">
                Structured learning paths from fundamentals to advanced Solana programming. Pick your journey.
              </p>
            </div>
          </BlurFade>

          {/* Search */}
          <BlurFade delay={0.15} inView>
            <div className="mb-10">
              <label className="relative block w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search modules..."
                  className="w-full rounded-xl bg-white/5 border border-white/10 pl-12 pr-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition focus:border-[#14f195]/50 focus:bg-white/[0.08]"
                />
              </label>
            </div>
          </BlurFade>

          {/* Modules Grid */}
          <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[22rem] gap-5">
            {filtered.map((module, index) => (
              <BlurFade key={module.id} delay={0.1 + index * 0.05} inView>
                <Link href={`/modules/${module.id}`} className="block h-full group">
                  <BentoCard
                    name={module.title.replace(/^[^\w]*/, "")}
                    className="h-full col-span-1 bg-white/[0.02] border-white/[0.06] hover:border-[#14f195]/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(20,241,149,0.1)]"
                    background={
                      <>
                        <div className="absolute inset-0 bg-gradient-to-br from-[#9945ff]/5 via-transparent to-[#14f195]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                          <div className="relative w-24 h-24">
                            <Image
                              src={module.image || "/placeholder.png"}
                              alt=""
                              fill
                              className="object-contain"
                            />
                          </div>
                        </div>
                      </>
                    }
                    Icon={() => (
                      <div className="relative w-14 h-14 md:w-16 md:h-16">
                        <Image
                          src={module.image || "/placeholder.png"}
                          alt={module.title}
                          fill
                          sizes="64px"
                          className="object-contain"
                        />
                      </div>
                    )}
                    description={module.description}
                    href={`/modules/${module.id}`}
                    cta={`${module.topics.length} lessons`}
                  />
                </Link>
              </BlurFade>
            ))}
          </BentoGrid>

          {filtered.length === 0 && (
            <BlurFade delay={0.1} inView>
              <div className="text-center py-20">
                <p className="text-zinc-500">No modules found matching "{query}"</p>
              </div>
            </BlurFade>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModulesPageClient;
