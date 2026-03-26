"use client";

import { GlassCard } from "./glass-card";
import { Trophy, Flame, BookOpen } from "lucide-react";

interface ProgressCardProps {
  style?: React.CSSProperties;
  className?: string;
}

export function ProgressCard({ style, className }: ProgressCardProps) {
  return (
    <GlassCard glow="cyan" style={style} className={className}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-[#00c2ff]/10">
            <BookOpen className="w-4 h-4 text-[#00c2ff]" />
          </div>
          <span className="text-sm font-medium text-white">Your Progress</span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-neutral-400">Course completion</span>
            <span className="text-sm font-medium text-[#00c2ff]">73%</span>
          </div>
          <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#00c2ff] to-[#14f195] rounded-full transition-all duration-1000 ease-out"
              style={{ width: "73%" }}
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs text-neutral-400">12 completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-xs text-neutral-400">7 day streak</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
