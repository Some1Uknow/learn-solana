"use client";

import { GlassCard } from "./glass-card";

interface CodePreviewCardProps {
  style?: React.CSSProperties;
  className?: string;
}

export function CodePreviewCard({ style, className }: CodePreviewCardProps) {
  return (
    <GlassCard glow="green" style={style} className={className}>
      {/* Window Chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-neutral-700" />
          <div className="w-3 h-3 rounded-full bg-neutral-700" />
          <div className="w-3 h-3 rounded-full bg-neutral-700" />
        </div>
        <span className="text-xs text-neutral-500 ml-2 font-mono">lib.rs</span>
      </div>

      {/* Code Content */}
      <div className="p-4 overflow-hidden">
        <pre className="text-[13px] font-mono leading-relaxed">
          <code>
            <span className="text-[#9945ff]">#[program]</span>
            {"\n"}
            <span className="text-[#00c2ff]">pub mod</span>{" "}
            <span className="text-white">learn_solana</span>{" "}
            <span className="text-neutral-500">{"{"}</span>
            {"\n"}
            {"    "}
            <span className="text-[#00c2ff]">use</span>{" "}
            <span className="text-white">super</span>
            <span className="text-neutral-500">::</span>
            <span className="text-neutral-500">*</span>
            <span className="text-neutral-500">;</span>
            {"\n\n"}
            {"    "}
            <span className="text-[#00c2ff]">pub fn</span>{" "}
            <span className="text-[#14f195]">initialize</span>
            <span className="text-neutral-500">(</span>
            {"\n"}
            {"        "}
            <span className="text-white">ctx</span>
            <span className="text-neutral-500">:</span>{" "}
            <span className="text-amber-400">Context</span>
            <span className="text-neutral-500">{"<"}</span>
            <span className="text-amber-400">Initialize</span>
            <span className="text-neutral-500">{">"}</span>
            {"\n"}
            {"    "}
            <span className="text-neutral-500">)</span>{" "}
            <span className="text-neutral-500">{"->"}</span>{" "}
            <span className="text-amber-400">Result</span>
            <span className="text-neutral-500">{"<"}</span>
            <span className="text-neutral-500">{"()"}</span>
            <span className="text-neutral-500">{">"}</span>{" "}
            <span className="text-neutral-500">{"{"}</span>
            {"\n"}
            {"        "}
            <span className="text-[#14f195]">msg!</span>
            <span className="text-neutral-500">(</span>
            <span className="text-amber-300">&quot;Welcome to Solana! 🚀&quot;</span>
            <span className="text-neutral-500">)</span>
            <span className="text-neutral-500">;</span>
            {"\n"}
            {"        "}
            <span className="text-[#00c2ff]">Ok</span>
            <span className="text-neutral-500">(</span>
            <span className="text-neutral-500">()</span>
            <span className="text-neutral-500">)</span>
            {"\n"}
            {"    "}
            <span className="text-neutral-500">{"}"}</span>
            {"\n"}
            <span className="text-neutral-500">{"}"}</span>
          </code>
        </pre>
      </div>
    </GlassCard>
  );
}
