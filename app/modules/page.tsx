"use client";

import contentsData from "@/data/contents-data.json";
import { Inter } from "next/font/google";
import ModulesSection from "@/components/learn/modules-section";


const inter = Inter({ subsets: ["latin"] });

export default function LearningProgressDashboard() {
  const modules = contentsData.modules as any;

  return (
    <div className={`min-h-screen w-full bg-black relative ${inter.className}`}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

        <ModulesSection modules={modules} />
      </div>
    </div>
  );
}
