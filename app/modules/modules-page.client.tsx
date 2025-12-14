"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ModulesGrid from "@/components/learn/modules-grid";
import { contentsData } from "../../data/contents-data";

const modules = contentsData.modules;

export function ModulesPageClient() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full relative bg-black">
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

      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen p-8">
        {/* Breadcrumb */}
        <div className="w-full max-w-7xl mb-6">
          <nav className="text-sm text-zinc-400">
            <button
              onClick={() => router.push("/")}
              className="hover:text-zinc-200 transition-colors"
            >
              Home
            </button>
            <span className="mx-2">/</span>
            <span className="text-zinc-200">Modules</span>
          </nav>
        </div>

        <div className="w-full max-w-7xl">
          <ModulesGrid modules={modules} />
        </div>
      </div>
    </div>
  );
}

export default ModulesPageClient;
