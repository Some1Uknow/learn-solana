"use client";

import Image from "next/image";
import { BeamsBackground } from "@/components/ui/beams-background";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  return (
    <div className="min-h-screen w-full relative text-white">
      {/* Azure Depths */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(125% 125% at 50% 10%, #000000 40%, #010133 100%)",
        }}
      />
      {/* Navbar Component */}
      <Navbar />
      {/* Main Content */}
      <div className="px-8 pb-8">
        <div className="relative h-[calc(100vh-120px)] rounded-3xl overflow-hidden bg-[#030303]">
          <BeamsBackground />
          {/* Custom content overlay with Solana logo */}
          <div className="absolute inset-0 z-30 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-6 px-4 text-center">
              <div className="flex items-baseline justify-center gap-8">
                <h1 className="text-6xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tighter leading-none">
                  master
                </h1>
                <div className="flex items-center">
                  <Image
                    src="/solanaMain.png"
                    alt="Solana Logo"
                    width={120}
                    height={120}
                    className="object-contain"
                    style={{ width: "auto", height: "60px" }}
                  />
                </div>
              </div>
              <p className="text-lg md:text-2xl lg:text-3xl text-white/70 tracking-tighter">
                without any hassle.
              </p>
            </div>
          </div>
        </div>
        {/* Contents Section */}
      </div>
    </div>
  );
}
