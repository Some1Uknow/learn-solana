"use client";

import { GlassCard } from "./glass-card";
import { Target, ChevronRight } from "lucide-react";

interface ChallengeCardProps {
  style?: React.CSSProperties;
  className?: string;
}

export function ChallengeCard({ style, className }: ChallengeCardProps) {
  return (
    <GlassCard glow="purple" style={style} className={className}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-[#9945ff]/10">
            <Target className="w-4 h-4 text-[#9945ff]" />
          </div>
          <span className="text-sm font-medium text-white">Current Challenge</span>
        </div>

        {/* Challenge Info */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-medium text-white mb-1">
              Day 15: Token Program
            </h4>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#9945ff]/20 text-[#9945ff] border border-[#9945ff]/30">
                Intermediate
              </span>
              <span className="text-xs text-neutral-500">~45 min</span>
            </div>
          </div>
          <div className="p-2 rounded-full bg-[#9945ff]/10 text-[#9945ff]">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
