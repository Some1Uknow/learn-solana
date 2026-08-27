"use client";

import Link from "next/link";
import type React from "react";
import { ArrowLeft, ArrowRight, BookOpen, Code, FileText, Rocket } from "lucide-react";
import type { ModuleItem } from "@/components/learn/modules-grid";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const typeIcons: Record<string, React.ElementType> = { overview: BookOpen, theory: FileText, exercise: Code, project: Rocket, setup: Code, challenge: Code };

export default function ModuleDetailPageClient({ module }: { module: ModuleItem }) {
  const lessons = [{ key: `${module.id}-overview`, title: module.title || "Overview", description: module.goal || module.description, type: "overview", href: module.overviewUrl || `/learn/${module.id}` }, ...module.topics.map((topic) => ({ key: topic.id, title: topic.title, description: topic.description, type: topic.type, href: topic.url || `/learn/${module.id}/${topic.id}` }))];
  return (
    <div className="min-h-screen bg-[#f5f5f5] text-[#181818]">
      <Navbar />
      <main id="main-content" tabIndex={-1} className="pb-20">
        <header className="border-b border-[#dedede] py-14 md:py-20">
          <div className="ds-shell">
            <nav className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#636363]" aria-label="Breadcrumb"><Link href="/modules" className="hover:text-[#181818]">Modules</Link><span>/</span><span aria-current="page">{module.title}</span></nav>
            <p className="ds-section-label">Track Curriculum</p>
            <h1 className="mt-4 text-4xl font-medium leading-none tracking-[-0.03em] md:text-5xl">{module.title}</h1>
            <p className="mt-4 max-w-[720px] text-base leading-7 text-[#636363]">{module.description}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-[#636363]"><span>{lessons.length} lessons</span><span>·</span><span>{module.goal}</span></div>
          </div>
        </header>
        <div className="ds-shell grid gap-10 py-14 lg:grid-cols-[minmax(0,1fr)_275px]">
          <section>
            <div className="mb-6 flex items-center justify-between gap-4"><h2 className="text-2xl font-medium tracking-[-0.02em]">Lessons</h2><Link href="/modules" className="ds-focus-ring inline-flex items-center gap-2 rounded-[4px] text-sm text-[#636363] hover:text-[#181818]"><ArrowLeft className="h-4 w-4" />All modules</Link></div>
            <div className="overflow-hidden rounded-xl border border-[#dedede] bg-white">
              {lessons.map((lesson, index) => { const Icon = typeIcons[lesson.type.toLowerCase()] || BookOpen; return <Link key={lesson.key} href={lesson.href} className="group grid grid-cols-[40px_minmax(0,1fr)_auto] items-start gap-4 border-b border-[#dedede] p-5 last:border-b-0 hover:bg-[#efefef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#6b8f27]/60"><span className="flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#dedede] bg-[#f5f5f5]"><Icon className="h-4 w-4 text-[#557b11]" /></span><span className="min-w-0"><span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[#636363]">Lesson {String(index + 1).padStart(2, "0")}</span><span className="mt-1 block font-medium">{lesson.title}</span><span className="mt-1 block text-sm leading-6 text-[#636363]">{lesson.description}</span></span><ArrowRight className="mt-3 h-4 w-4 text-[#636363] transition-transform group-hover:translate-x-0.5" /></Link>; })}
            </div>
          </section>
          <aside className="h-fit rounded-xl border border-[#dedede] bg-white p-5 lg:sticky lg:top-24">
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-[#636363]">What you’ll learn</p>
            <p className="mt-3 text-sm leading-6 text-[#181818]">{module.goal}</p>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.1em] text-[#636363]">Access</p>
            <p className="mt-3 text-sm leading-6 text-[#636363]">Lessons are open. Sign in to save progress.</p>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
