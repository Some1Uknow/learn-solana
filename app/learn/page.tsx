"use client";

import contentsData from "@/data/contents-data.json";
import { Inter } from "next/font/google";
import DashboardBackground from "@/components/learn/dashboard-background";
import DashboardHeader from "@/components/learn/dashboard-header";
import StatsCards from "@/components/learn/stats-cards";
import ModulesSection from "@/components/learn/modules-section";
import {
  calculateOverallProgress,
  getCompletedModulesCount,
  getInProgressModulesCount,
} from "@/lib/progress-calculations";

const inter = Inter({ subsets: ["latin"] });

export default function LearningProgressDashboard() {
  const modules = contentsData.modules as any;
  const overallProgress = calculateOverallProgress(modules);
  const completedModules = getCompletedModulesCount(modules);
  const inProgressModules = getInProgressModulesCount(modules);

  return (
    <div className={`min-h-screen w-full bg-black relative ${inter.className}`}>
      <DashboardBackground />      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <DashboardHeader />

        <StatsCards
          overallProgress={overallProgress}
          completedModules={completedModules}
          inProgressModules={inProgressModules}
          totalModules={modules.length}
        />

        <ModulesSection modules={modules} />
      </div>
    </div>
  );
}
