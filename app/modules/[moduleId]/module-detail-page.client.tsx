"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, BookOpen, Code, FileText, Rocket } from "lucide-react";

import type { ModuleItem } from "@/components/learn/modules-grid";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Inter, Space_Grotesk } from "next/font/google";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const typeIcons: Record<string, React.ElementType> = {
  overview: BookOpen,
  theory: FileText,
  exercise: Code,
  project: Rocket,
  setup: Code,
  challenge: Code,
};

const typeLabels: Record<string, string> = {
  overview: "Overview",
  theory: "Theory",
  exercise: "Exercise",
  project: "Project",
  setup: "Setup",
  challenge: "Challenge",
};

export default function ModuleDetailPageClient({
  module,
}: {
  module: ModuleItem;
}) {
  const courseParts = [
    {
      key: `${module.id}-overview`,
      title: module.title || "Overview",
      description: module.goal || module.description,
      type: "overview",
      href: module.overviewUrl || `/learn/${module.id}`,
    },
    ...module.topics.map((topic) => ({
      key: topic.id,
      title: topic.title,
      description: topic.description,
      type: topic.type,
      href: topic.url || `/learn/${module.id}/${topic.id}`,
    })),
  ];

  return (
    <div
      className={`${body.className} min-h-screen overflow-x-clip bg-black text-white`}
    >
      <Navbar />

      <main className="pt-28 pb-24">
        <div className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 text-sm text-white/42">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span className="mx-2 text-white/20">/</span>
            <Link href="/modules" className="transition hover:text-white">
              Modules
            </Link>
            <span className="mx-2 text-white/20">/</span>
            <span className="text-white">{module.title}</span>
          </nav>

          <Link
            href="/modules"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/46 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Modules
          </Link>

          <section className="rounded-[32px] bg-[linear-gradient(180deg,rgba(15,15,15,0.98),rgba(8,8,8,0.98))] p-5 shadow-[0_24px_64px_rgba(0,0,0,0.42),_0_0_0_1px_rgba(255,255,255,0.02)]">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-3xl bg-[linear-gradient(180deg,rgba(169,255,47,0.12),rgba(169,255,47,0.04))] sm:h-32 sm:w-32">
                {module.image && (
                  <Image
                    src={module.image}
                    alt={module.title}
                    fill
                    sizes="128px"
                    className="object-contain p-3"
                  />
                )}
              </div>

              <div className="min-w-0">
                <p className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#a9ff2f]">
                  Learning Module
                </p>
                <h1 className={`mt-4 text-4xl leading-[0.95] tracking-[-0.065em] text-white sm:text-5xl ${display.className}`}>
                  {module.title}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-7 text-white/58 sm:text-lg">
                  {module.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-xs text-white/42">
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5">
                    {courseParts.length} lessons
                  </span>
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5">
                    {module.goal}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {courseParts.map((part) => {
                const IconComponent = typeIcons[part.type.toLowerCase()] || BookOpen;

                return (
                  <Link
                    key={part.key}
                    href={part.href}
                    className="group relative overflow-hidden rounded-[28px] bg-[linear-gradient(180deg,rgba(15,15,15,0.98),rgba(8,8,8,0.98))] p-5 text-white shadow-[0_24px_64px_rgba(0,0,0,0.42),_0_0_0_1px_rgba(255,255,255,0.02)] transition duration-300 hover:-translate-y-1"
                  >
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(169,255,47,0.12),transparent_28%),radial-gradient(circle_at_86%_8%,rgba(169,255,47,0.06),transparent_24%)] opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="relative z-10 flex items-start gap-4">
                      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(180deg,rgba(169,255,47,0.12),rgba(169,255,47,0.04))]">
                        <IconComponent className="h-7 w-7 text-[#a9ff2f]" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[10px] uppercase tracking-[0.24em] text-[#a9ff2f]/80">
                            {typeLabels[part.type.toLowerCase()] || part.type}
                          </span>
                          <ArrowRight className="h-4 w-4 text-white/34 transition-transform group-hover:translate-x-0.5" />
                        </div>

                        <h3 className={`mt-3 text-xl leading-[1.05] text-white ${display.className}`}>
                          {part.title}
                        </h3>
                        <p className="mt-2 text-sm leading-6 text-white/58">
                          {part.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
