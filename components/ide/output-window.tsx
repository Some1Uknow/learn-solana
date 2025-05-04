"use client";

import { useEffect, useRef } from "react";

interface OutputWindowProps {
  output: string;
}

export default function OutputWindow({ output }: OutputWindowProps) {
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div 
      ref={outputRef}
      className="h-full w-full bg-black/50 font-mono text-sm p-4 overflow-auto"
    >
      {output ? (
        output.split("\n").map((line, i) => (
          <div key={i} className="mb-1">
            {line.includes("signature:") ? (
              <>
                <span>Transaction signature: </span>
                <span className="text-[#14F195]">{line.split("signature: ")[1]}</span>
              </>
            ) : line.includes("error") ? (
              <span className="text-red-400">{line}</span>
            ) : line.includes("successfully") ? (
              <span className="text-[#14F195]">{line}</span>
            ) : (
              <span className="text-white/80">{line}</span>
            )}
          </div>
        ))
      ) : (
        <div className="text-white/50 italic">Run your code to see output here</div>
      )}
    </div>
  );
}