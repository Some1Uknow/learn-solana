import React from "react";
import fs from "node:fs/promises";
import path from "node:path";
import ModulesGrid from "@/components/learn/modules-grid";
// Types for the data
interface Topic {
  id: string;
  title: string;
  description: string;
  type: string;
}

interface ModuleItem {
  id: string;
  title: string;
  description: string;
  goal: string;
  image?: string;
  icon?: string;
  topics: Topic[];
}

interface ContentsData {
  modules: ModuleItem[];
}

// Server function to load JSON content
async function loadModules(): Promise<ModuleItem[]> {
  const filePath = path.join(process.cwd(), "data", "contents-data.json");
  const raw = await fs.readFile(filePath, "utf-8");
  const json = JSON.parse(raw) as ContentsData;
  return json.modules;
}

export default async function ModulesPage() {
  const modules = await loadModules();
  return (
    <div className="min-h-screen w-full relative bg-black">
      {/* Prismatic Aurora Burst - Multi-layered Gradient */}
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
      {/* Content */}
      <main className="relative z-10 min-h-screen text-zinc-200">
        <section className="mx-auto max-w-7xl px-4 py-10 sm:py-14">
          <header className="mb-8 sm:mb-10">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Solana Learning Path
            </h1>
            <p className="mt-2 max-w-2xl text-zinc-400">
              Explore the 5-week curriculum from fundamentals to a
              portfolio-ready capstone.
            </p>
          </header>
          {/* Grid */}
          <ModulesGrid modules={modules} />
        </section>
      </main>
    </div>
  );
}

// Defer client logic to a separate component file for cleanliness
