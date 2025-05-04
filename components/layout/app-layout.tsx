"use client";

import { ReactNode } from "react";
import AppNavigation from "./app-navigation";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0c0c10] text-white">
      {/* Gradient background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[50%] h-[70%] bg-[#14F195]/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[60%] bg-[#9945FF]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[40%] bg-[#00C2FF]/20 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <AppNavigation />

      {/* Main Content */}
      <main className="pt-4 pb-12 md:ml-64 md:p-8 min-h-screen">
        <div className="container mx-auto px-4 mt-14 md:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
}