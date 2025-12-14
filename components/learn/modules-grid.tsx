"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/cn";
import { useWeb3AuthUser } from "@web3auth/modal/react";

// Shared types with page
export interface Topic {
  id: string;
  title: string;
  description: string;
  type: string;
  url?: string;
}
export interface ModuleItem {
  id: string;
  title: string;
  description: string;
  goal: string;
  image?: string;
  icon?: string;
  overviewUrl?: string;
  topics: Topic[];
}

const DIFFICULTY = "BEGINNER";

const getImageForWeek = (m: ModuleItem) => {
  // Prefer explicit data.image; fallback to placeholder
  return m.image || "/placeholder.png";
};

export default function ModulesGrid({ modules }: { modules: ModuleItem[] }) {
  const { userInfo } = useWeb3AuthUser();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return modules.filter((m) => {
      const inTitle = m.title.toLowerCase().includes(q);
      const inDesc = m.description.toLowerCase().includes(q);
      const inTopics = m.topics.some(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
      return q ? inTitle || inDesc || inTopics : true;
    });
  }, [modules, query]);

  const continueItems = filtered.slice(0, 2);
  const rest = filtered.slice(2);

  return (
    <div>
      {/* Hero */}
      <div className="mb-10">
        <div className="text-xs tracking-[0.25em] text-zinc-400">[WELCOME]</div>
        <div className="mt-3 space-y-2">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {userInfo ? (
              <>
                Hi {userInfo?.name || "Developer"}, select a course to get
                started
              </>
            ) : (
              "Select a course to get started"
            )}
          </h2>
        </div>
        {/* Controls row */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-xl">
            <span className="sr-only">Search</span>
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              🔎
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, category, or level..."
              className="w-full rounded-xl bg-zinc-900/60 pl-9 pr-3 py-3 text-sm text-zinc-100 outline-none transition focus:bg-zinc-900"
            />
          </label>
          <div className="flex items-center gap-3">
            <button
              className="rounded-xl bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-900"
              type="button"
            >
              All Categories
            </button>
            <div className="flex overflow-hidden rounded-xl bg-zinc-900/60">
              <button
                className="px-3 py-3 text-zinc-300 hover:bg-zinc-900"
                aria-label="Grid view"
              >
                ▦
              </button>
              <button
                className="px-3 py-3 text-zinc-300 hover:bg-zinc-900"
                aria-label="List view"
              >
                ≡
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <section aria-labelledby="continue" className="mt-8">
        <h3 id="continue" className="text-lg font-medium text-zinc-200">
          Continue Learning
        </h3>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {continueItems.map((m, idx) => (
            <CourseCard
              key={m.id}
              m={m}
              onContinue={() => router.push(`/modules/${m.id}`)}
              large
            />
          ))}
        </div>
      </section>

      {/* All Courses */}
      <section aria-labelledby="all" className="mt-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((m, idx) => (
            <CourseCard key={m.id} m={m} onContinue={() => router.push(`/modules/${m.id}`)} />
          ))}
        </div>
      </section>
    </div>
  );
}

function CourseCard({
  m,
  large,
  onContinue,
}: {
  m: ModuleItem;
  large?: boolean;
  onContinue: () => void;
}) {
  const img = getImageForWeek(m);
  // Derive category from icon or fallback
  const category = (m.icon || "").toUpperCase() || "COURSE";
  const progress = `1/${Math.max(1, m.topics.length)}`; // placeholder progress

  return (
    <article
      className={cn(
        "relative isolate rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0))] p-5 text-zinc-100 shadow-[0_8px_40px_rgba(0,0,0,0.15),_0_0_0_1px_rgba(255,255,255,0.02)] transition-transform duration-300 hover:-translate-y-1",
        large ? "min-h-[220px]" : "min-h-[220px]"
      )}
    >
      <div className="absolute inset-0 rounded-2xl bg-zinc-950/60" />
      <div className="relative z-10 flex h-full flex-col">
        {/* Top Row: badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-300">
            ● {DIFFICULTY}
          </span>
        </div>

        {/* Middle */}
        <div className="mt-4 flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0">
            <Image
              src={img}
              alt="course"
              fill
              sizes="80px"
              className="rounded-xl object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">
              {category}
            </div>
            <h4 className="mt-1 text-xl font-semibold tracking-tight">
              {m.title.replace(/^[^\w]*/, "")}
            </h4>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-auto flex items-center justify-between pt-6">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>◦</span>
            <span>{progress}</span>
          </div>
          <button
            className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-400"
            type="button"
            onClick={onContinue}
          >
            CONTINUE →
          </button>
        </div>
      </div>
    </article>
  );
}
