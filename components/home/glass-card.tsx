"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type GlowColor = "green" | "purple" | "cyan" | "none";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: GlowColor;
  style?: React.CSSProperties;
}

const glowStyles: Record<GlowColor, string> = {
  green: "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_60px_-15px_rgba(20,241,149,0.4)]",
  purple: "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_60px_-15px_rgba(153,69,255,0.4)]",
  cyan: "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_60px_-15px_rgba(0,194,255,0.4)]",
  none: "shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]",
};

export function GlassCard({ children, className, glow = "none", style }: GlassCardProps) {
  return (
    <div
      className={cn(
        // Glass effect
        "bg-neutral-900/70 backdrop-blur-xl",
        // Border
        "border border-white/10 rounded-2xl",
        // Shadow/glow
        glowStyles[glow],
        // Inner highlight
        "ring-1 ring-inset ring-white/5",
        // Smooth transitions
        "transition-transform duration-300 ease-out",
        // GPU acceleration
        "will-change-transform",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
