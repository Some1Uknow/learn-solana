"use client";

import { Navbar } from "@/components/layout/navbar";
import { HomePageV2 } from "@/components/home/homepage-v2";

export function HomePageClient() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      <HomePageV2 />
    </div>
  );
}

export default HomePageClient;
