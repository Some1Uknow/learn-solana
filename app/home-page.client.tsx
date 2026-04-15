"use client";

import { Navbar } from "@/components/layout/navbar";
import { HomePage } from "@/components/home/homepage";

export function HomePageClient() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <HomePage />
    </div>
  );
}

export default HomePageClient;
