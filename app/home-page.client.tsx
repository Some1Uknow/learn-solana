"use client";

import Image from "next/image";
import { BeamsBackground } from "@/components/ui/beams-background";
import { Navbar } from "@/components/layout/navbar";

export function HomePageClient() {
  return (
    <div className="min-h-screen w-full relative text-white" role="main">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #000000 40%, #010133 100%)",
        }}
      />
      <div className="relative z-50 pointer-events-auto">
        <Navbar />
      </div>
      <div
        className="px-4 sm:px-6 md:px-8 pb-6 md:pb-8 pt-4 md:pt-0"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 0px)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0px)",
        }}
      >
        <div className="relative h-auto min-h-[70vh] md:h-[calc(100vh-120px)] rounded-2xl md:rounded-3xl overflow-hidden bg-[#030303]">
          <div className="absolute inset-0 pointer-events-none">
            <BeamsBackground />
          </div>
          <div className="absolute inset-0 z-30 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 px-4 text-center">
              <div className="flex flex-wrap items-baseline justify-center gap-4 md:gap-8">
                <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-white tracking-tighter leading-none">
                  master
                </h1>
                <div className="flex items-center">
                  <Image
                    src="/solanaMain.png"
                    alt="Solana Logo"
                    width={120}
                    height={120}
                    className="object-contain h-10 sm:h-14 md:h-[60px] w-auto"
                    sizes="(max-width: 640px) 40px, (max-width: 768px) 56px, 60px"
                  />
                </div>
              </div>
              <p className="text-base sm:text-lg md:text-2xl lg:text-3xl text-white/70 tracking-tighter">
                without any hassle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePageClient;
