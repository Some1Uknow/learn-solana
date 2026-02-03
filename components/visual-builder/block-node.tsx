"use client";

import { Handle, Position } from "reactflow";
import { getBlockDefinition } from "@/lib/visual-builder/blocks";
import type { VisualBuilderNodeData } from "@/lib/visual-builder/schema";

interface BlockNodeProps {
  data: VisualBuilderNodeData;
  selected?: boolean;
}

export function BlockNode({ data, selected }: BlockNodeProps) {
  const definition = getBlockDefinition(data.kind);

  return (
    <div
      className={`min-w-[170px] rounded-2xl border bg-black/60 px-4 py-3 text-sm shadow-lg transition-all ${
        selected ? "border-white/60" : "border-white/15"
      }`}
      style={{ boxShadow: `0 0 20px ${definition.accent}20` }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs uppercase tracking-[0.2em] text-white/50">
          {definition.group}
        </span>
        <span
          className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase"
          style={{ borderColor: `${definition.accent}60`, color: definition.accent }}
        >
          {definition.label}
        </span>
      </div>
      <div className="mt-2 text-base font-semibold text-white">{data.label}</div>
      <div className="mt-1 text-xs text-white/60">{data.description}</div>

      <Handle
        type="target"
        position={Position.Top}
        className="h-2 w-2 border-0"
        style={{ background: definition.accent }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="h-2 w-2 border-0"
        style={{ background: definition.accent }}
      />
    </div>
  );
}
