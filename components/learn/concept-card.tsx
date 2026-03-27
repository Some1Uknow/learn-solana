"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ConceptCardProps {
  term: string;
  children: React.ReactNode;
  accentColor?: string;
}

interface ConceptCardsProps {
  concepts: Array<{
    term: string;
    definition: React.ReactNode;
  }>;
  accentColor?: string;
}

export function ConceptCard({
  term,
  children,
  accentColor = "#14f195",
}: ConceptCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="ls-concept-card relative w-full max-w-sm mx-auto my-6 cursor-pointer"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsFlipped(!isFlipped);
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isFlipped}
      aria-label={`${term} - click to ${isFlipped ? "hide" : "reveal"} definition`}
    >
      <motion.div
        className="relative w-full aspect-[3/2] preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front face */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden",
            "rounded-xl overflow-hidden",
            "border border-white/[0.08]",
            "bg-gradient-to-br from-[#0a0a0a] to-[#111111]",
            "flex flex-col items-center justify-center p-6",
            "transition-shadow duration-300",
            "hover:shadow-[0_0_30px_-10px_var(--accent)]"
          )}
          style={
            {
              "--accent": accentColor,
              backfaceVisibility: "hidden",
            } as React.CSSProperties
          }
        >
          {/* Decorative corner accent */}
          <div
            className="absolute top-0 right-0 w-24 h-24 opacity-10"
            style={{
              background: `radial-gradient(circle at 100% 0%, ${accentColor} 0%, transparent 70%)`,
            }}
          />
          
          <span
            className="text-2xl font-semibold tracking-tight text-center"
            style={{ color: accentColor }}
          >
            {term}
          </span>
          
          <span className="mt-3 text-xs text-[#a1a1a1] uppercase tracking-widest">
            Tap to reveal
          </span>
        </div>

        {/* Back face */}
        <div
          className={cn(
            "absolute inset-0 backface-hidden",
            "rounded-xl overflow-hidden",
            "border border-white/[0.08]",
            "bg-gradient-to-br from-[#0a0a0a] to-[#111111]",
            "flex flex-col items-center justify-center p-6",
            "text-center"
          )}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Decorative gradient */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              background: `linear-gradient(135deg, ${accentColor} 0%, transparent 50%)`,
            }}
          />
          
          <div className="relative z-10 text-sm text-[#a1a1a1] leading-relaxed [&_code]:bg-white/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[#ededed]">
            {children}
          </div>
          
          <span
            className="mt-4 text-xs uppercase tracking-widest"
            style={{ color: accentColor, opacity: 0.6 }}
          >
            {term}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

// Grid wrapper for multiple concept cards
export function ConceptCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8">
      {children}
    </div>
  );
}

export function ConceptCards({
  concepts,
  accentColor,
}: ConceptCardsProps) {
  return (
    <ConceptCardGrid>
      {concepts.map((concept) => (
        <ConceptCard
          key={concept.term}
          term={concept.term}
          accentColor={accentColor}
        >
          {concept.definition}
        </ConceptCard>
      ))}
    </ConceptCardGrid>
  );
}
