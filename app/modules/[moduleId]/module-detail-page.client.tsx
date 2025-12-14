"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ModuleItem } from "@/components/learn/modules-grid";

export default function ModuleDetailPageClient({
  module,
}: {
  module: ModuleItem;
}) {
  const router = useRouter();

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
    <div className="min-h-screen w-full relative bg-black">
      {/* Platform gradient background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
            radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
            radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
            radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
            #000000
          `,
        }}
      />

      <div className="relative z-10">
        {/* Breadcrumb & Back */}
        <div className="border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-sm text-zinc-500">
                <Link href="/modules" className="hover:text-cyan-300 transition-colors">
                  Paths
                </Link>
                <span>›</span>
                <span className="text-zinc-200">{module.title}</span>
              </div>
              <button
                onClick={() => router.push("/modules")}
                className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <motion.div 
          className="max-w-7xl mx-auto px-6 pt-12 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-400 border border-zinc-700">
              ◯ 0/{courseParts.length} COMPLETED
            </span>
          </div>
          <motion.h1 
            className="text-5xl font-bold text-zinc-100 mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {module.title}
          </motion.h1>
          <motion.p 
            className="text-lg text-zinc-400 max-w-3xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {module.description}
          </motion.p>
        </motion.div>

        {/* Course Grid */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseParts.map((part, index) => (
              <article
                key={part.key}
                className="group relative rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0))] border border-white/[0.02] shadow-[0_8px_40px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-300 hover:border-cyan-500/30 hover:-translate-y-1"
                style={{
                  animation: `fadeIn 400ms ease ${index * 60}ms both`,
                }}
              >
                <div className="absolute inset-0 rounded-2xl bg-zinc-950/60" />
                
                {/* Animated code background */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
                  <div
                    className="absolute top-4 left-4 right-4 space-y-1.5 font-mono text-[10px] text-cyan-300/20"
                    style={{
                      animation: `slideDown 8s ease-in-out infinite`,
                      animationDelay: `${index * 0.5}s`,
                    }}
                  >
                    <div>{">>>"} {getCodeLine(part.type, 1)}</div>
                    <div className="pl-4">{getCodeLine(part.type, 2)}</div>
                    <div className="pl-4">{getCodeLine(part.type, 3)}</div>
                    <div className="pl-8">{getCodeLine(part.type, 4)}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="relative p-6 flex flex-col h-full min-h-[340px]">
                  {/* Icon */}
                  <div className="mb-6 w-16 h-16 rounded-xl flex items-center justify-center">
                    <img 
                      src={module.image || "/placeholder.png"} 
                      alt={module.title} 
                      className="w-16 h-16 rounded-xl object-contain" 
                    />
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 rounded text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-400 bg-white/5">
                      {module.icon || "GENERAL"}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-300 bg-cyan-500/10 flex items-center gap-1">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-300" />
                      BEGINNER
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-semibold text-zinc-100 mb-3 group-hover:text-cyan-300 transition-colors">
                    {part.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-1">
                    {part.description}
                  </p>

                  {/* Action Button */}
                  <Link
                    href={part.href}
                    className="w-full flex items-center justify-between px-5 py-3 rounded-xl bg-cyan-500 text-sm font-medium text-black hover:bg-cyan-400 transition-all group/btn"
                  >
                    <span className="flex items-center gap-2">
                      DIVE IN!
                    </span>
                    <span className="group-hover/btn:translate-x-1 transition-transform">
                      ››
                    </span>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.2;
          }
          50% {
            transform: translateY(8px);
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  );
}

function getCodeLine(type: string, line: number): string {
  const codePatterns: Record<string, string[]> = {
    overview: [
      "initialize_program()",
      "let config = Config::new();",
      "setup_environment();",
      "return Ok(config);",
    ],
    setup: [
      "install_dependencies()",
      "configure_toolchain();",
      "verify_installation();",
      "println!(\"Setup complete\");",
    ],
    theory: [
      "fn learn_concepts() {",
      "let knowledge = Theory::new();",
      "knowledge.study();",
      "}",
    ],
    exercise: [
      "fn practice_skills() {",
      "let mut progress = 0;",
      "progress += solve();",
      "}",
    ],
    project: [
      "fn build_project() {",
      "let app = App::new();",
      "app.deploy();",
      "}",
    ],
    challenge: [
      "fn complete_challenge() {",
      "assert!(solution.is_valid());",
      "submit_result();",
      "}",
    ],
  };

  const patterns = codePatterns[type.toLowerCase()] || [
    "processing...",
    "loading module...",
    "compiling...",
    "ready.",
  ];

  return patterns[line - 1] || "...";
}
