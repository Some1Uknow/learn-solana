"use client";

import { useMouseParallax } from "@/hooks/use-mouse-parallax";
import { CodePreviewCard } from "./code-preview-card";
import { ProgressCard } from "./progress-card";
import { ChallengeCard } from "./challenge-card";
import { cn } from "@/lib/utils";

interface DimensionalStackProps {
  className?: string;
}

export function DimensionalStack({ className }: DimensionalStackProps) {
  const { x, y } = useMouseParallax(12);

  return (
    <div
      className={cn(
        "relative w-full h-[500px] lg:h-[550px]",
        // 3D perspective container
        "[perspective:1200px]",
        className
      )}
    >
      {/* Card 1: Challenge Card (Back - smallest) */}
      <div
        className="absolute top-0 right-0 w-[280px] lg:w-[320px] opacity-0 animate-card-enter-1"
        style={{
          transform: `
            translateZ(-80px)
            translateY(${-40 + y * 0.3}px)
            translateX(${20 + x * 0.3}px)
            rotateX(${12 + y * 0.4}deg)
            rotateY(${-6 + x * 0.4}deg)
            scale(0.88)
          `,
          transformStyle: "preserve-3d",
        }}
      >
        <ChallengeCard />
      </div>

      {/* Card 2: Progress Card (Middle) */}
      <div
        className="absolute top-[80px] right-[30px] lg:right-[50px] w-[300px] lg:w-[340px] opacity-0 animate-card-enter-2"
        style={{
          transform: `
            translateZ(-40px)
            translateY(${y * 0.5}px)
            translateX(${x * 0.5}px)
            rotateX(${10 + y * 0.3}deg)
            rotateY(${-4 + x * 0.3}deg)
            scale(0.94)
          `,
          transformStyle: "preserve-3d",
        }}
      >
        <ProgressCard />
      </div>

      {/* Card 3: Code Preview (Front - largest) */}
      <div
        className="absolute top-[180px] lg:top-[200px] right-[60px] lg:right-[100px] w-[320px] lg:w-[380px] opacity-0 animate-card-enter-3"
        style={{
          transform: `
            translateZ(0px)
            translateY(${20 + y * 0.7}px)
            translateX(${x * 0.7}px)
            rotateX(${8 + y * 0.2}deg)
            rotateY(${-3 + x * 0.2}deg)
          `,
          transformStyle: "preserve-3d",
        }}
      >
        <CodePreviewCard />
      </div>

      {/* Ambient glow behind cards */}
      <div 
        className="absolute inset-0 -z-10 opacity-0 animate-glow-fade"
        style={{
          background: `
            radial-gradient(ellipse at 70% 30%, rgba(153, 69, 255, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 60%, rgba(0, 194, 255, 0.12) 0%, transparent 40%),
            radial-gradient(ellipse at 60% 80%, rgba(20, 241, 149, 0.1) 0%, transparent 40%)
          `,
        }}
      />
    </div>
  );
}
