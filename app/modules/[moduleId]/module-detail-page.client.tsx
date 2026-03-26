"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ModuleItem } from "@/components/learn/modules-grid";
import { ArrowLeft, BookOpen, Code, FileText, Rocket, ChevronRight } from "lucide-react";

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
  // Build array of all course parts: Overview + Topics
  const courseParts = [
    {
      key: `${module.id}-overview`,
      title: module.title || "Overview",
      description: module.goal || module.description,
      type: "overview",
      href: module.overviewUrl || `/learn/${module.id}`,
    },
    ...module.topics.map((t) => ({
      key: t.id,
      title: t.title,
      description: t.description,
      type: t.type,
      href: t.url || `/learn/${module.id}/${t.id}`,
    })),
  ];

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <Navbar />

      <div className="pt-28 pb-24 px-4 sm:px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-sm text-neutral-400 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2 text-neutral-600">/</span>
            <Link href="/modules" className="hover:text-white transition-colors">
              Modules
            </Link>
            <span className="mx-2 text-neutral-600">/</span>
            <span className="text-white">{module.title}</span>
          </nav>

          {/* Back Link */}
          <Link
            href="/modules"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Modules
          </Link>

          {/* Header Section */}
          <div className="mb-12">
            <div className="flex items-start gap-5 mb-4">
              {module.image && (
                <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border border-neutral-800">
                  <Image
                    src={module.image}
                    alt={module.title}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              <div>
                <p className="text-xs uppercase tracking-widest text-[#14f195] mb-2">
                  Learning Module
                </p>
                <h1 className="text-3xl md:text-4xl font-medium tracking-tight">
                  {module.title}
                </h1>
              </div>
            </div>
            <p className="text-lg text-neutral-400 max-w-2xl mt-4">
              {module.description}
            </p>
            <div className="flex items-center gap-4 mt-6 text-sm text-neutral-500">
              <span>{courseParts.length} lessons</span>
            </div>
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courseParts.map((part) => {
              const IconComponent = typeIcons[part.type.toLowerCase()] || BookOpen;
              return (
                <Link
                  key={part.key}
                  href={part.href}
                  className="group block rounded-lg border border-neutral-800 bg-neutral-900/30 p-5 transition-all hover:border-neutral-700 hover:bg-neutral-900/50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg bg-neutral-800 flex items-center justify-center group-hover:bg-[#14f195]/10 transition-colors">
                      <IconComponent className="w-5 h-5 text-neutral-400 group-hover:text-[#14f195] transition-colors" />
                    </div>
                    <span className="text-xs uppercase tracking-wider text-neutral-500">
                      {typeLabels[part.type.toLowerCase()] || part.type}
                    </span>
                  </div>
                  <h3 className="text-base font-medium text-white mb-2 group-hover:text-[#14f195] transition-colors">
                    {part.title}
                  </h3>
                  <p className="text-sm text-neutral-500 line-clamp-2 mb-4">
                    {part.description}
                  </p>
                  <div className="flex items-center text-sm text-neutral-500 group-hover:text-[#14f195] transition-colors">
                    Start lesson
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
