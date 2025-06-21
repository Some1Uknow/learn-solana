"use client";
import React from "react";
import { ShootingStars } from "./ui/shooting-stars";
import { StarsBackground } from "./ui/stars-background";
export default function ShootingStarsAndStarsBackgroundDemo() {
  return (
    <div className="h-[40rem] rounded-md bg-neutral-900 flex flex-col items-center justify-center relative w-full">
      <h2 className="relative flex-col md:flex-row z-10 text-3xl md:text-5xl md:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-white to-white flex items-center gap-2 md:gap-8">
        <span>Shooting Star</span>
        <span className="text-white text-lg font-thin">x</span>
        <span>Star Background</span>
      </h2>
      <ShootingStars />
      <StarsBackground />
    </div>
  );
}
