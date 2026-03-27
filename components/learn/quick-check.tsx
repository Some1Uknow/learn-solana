"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ChevronDown } from "lucide-react";

interface QuickCheckProps {
  question: string;
  options: string[];
  correctIndex: number;
  hint?: string;
  explanation?: string;
  id?: string;
}

export function QuickCheck({
  question,
  options,
  correctIndex,
  hint,
  explanation,
  id,
}: QuickCheckProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showHint, setShowHint] = useState(false);
  
  // Generate a stable ID for localStorage persistence
  const storageKey = id || `quickcheck-${question.slice(0, 30)}`;
  
  // Load saved state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSelectedIndex(parsed.selectedIndex);
        setHasSubmitted(parsed.hasSubmitted);
      } catch {
        // Ignore parse errors
      }
    }
  }, [storageKey]);
  
  // Save state to localStorage when submitted
  useEffect(() => {
    if (hasSubmitted && selectedIndex !== null) {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ selectedIndex, hasSubmitted })
      );
    }
  }, [hasSubmitted, selectedIndex, storageKey]);

  const isCorrect = selectedIndex === correctIndex;
  
  const handleSubmit = () => {
    if (selectedIndex === null) return;
    setHasSubmitted(true);
    if (selectedIndex === correctIndex) {
      setShowExplanation(true);
    }
  };
  
  const handleReset = () => {
    setSelectedIndex(null);
    setHasSubmitted(false);
    setShowExplanation(false);
    setShowHint(false);
    localStorage.removeItem(storageKey);
  };

  const statusTone = hasSubmitted
    ? isCorrect
      ? "text-[#14f195]"
      : "text-[#f87171]"
    : "text-[#a1a1a1]";

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="ls-quick-check my-8"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-[#0a0a0a]",
          "shadow-[0_1px_0_rgba(255,255,255,0.03)_inset]",
          hasSubmitted && isCorrect
            ? "border-[#14f195]/18"
            : hasSubmitted && !isCorrect
              ? "border-[#f87171]/18"
              : "border-white/[0.08]"
        )}
      >
        <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white/30" />
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#8a8a8a]">
              Quick Check
            </span>
          </div>

          <span className={cn("text-xs font-medium", statusTone)}>
            {hasSubmitted ? (isCorrect ? "Correct" : "Review") : "Single answer"}
          </span>

          {hasSubmitted && (
            <button
              type="button"
              onClick={handleReset}
              className="ml-auto text-xs text-[#8a8a8a] transition-colors hover:text-[#ededed]"
            >
              Try again
            </button>
          )}
        </div>

        <div className="px-5 py-5">
          <p className="mb-5 text-[15px] font-medium leading-7 text-[#ededed]">
            {question}
          </p>

          {hint && !hasSubmitted && (
            <div className="mb-5">
              <button
                type="button"
                onClick={() => setShowHint((current) => !current)}
                className="flex items-center gap-2 text-sm text-[#8a8a8a] transition-colors hover:text-[#ededed]"
              >
                <motion.span
                  animate={{ rotate: showHint ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.span>
                {showHint ? "Hide hint" : "Need a hint?"}
              </button>

              <AnimatePresence initial={false}>
                {showHint && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 border-l border-white/[0.08] pl-4 text-sm leading-6 text-[#9a9a9a]">
                      {hint}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          <div className="space-y-2.5">
            {options.map((option, index) => {
              const isSelected = selectedIndex === index;
              const isCorrectOption = index === correctIndex;
              const showResult = hasSubmitted;
              const optionLabel = String.fromCharCode(65 + index);
              
              return (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => !hasSubmitted && setSelectedIndex(index)}
                  disabled={hasSubmitted}
                  whileHover={!hasSubmitted ? { y: -1 } : undefined}
                  whileTap={!hasSubmitted ? { scale: 0.995 } : undefined}
                  className={cn(
                    "flex w-full items-start gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150",
                    "bg-white/[0.02]",
                    !hasSubmitted && "cursor-pointer hover:border-white/[0.16] hover:bg-white/[0.035]",
                    hasSubmitted && "cursor-default",
                    !showResult && !isSelected && "border-white/[0.08] text-[#a1a1a1]",
                    !showResult && isSelected && "border-white/[0.18] bg-white/[0.045] text-[#ededed]",
                    showResult && isCorrectOption && "border-[#14f195]/22 bg-[#14f195]/[0.06] text-[#d7ffe9]",
                    showResult && isSelected && !isCorrectOption && "border-[#f87171]/20 bg-[#f87171]/[0.05] text-[#ffd7d7]"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border text-[11px] font-medium",
                      !showResult && !isSelected && "border-white/[0.1] bg-white/[0.03] text-[#8a8a8a]",
                      !showResult && isSelected && "border-white/[0.16] bg-white/[0.06] text-[#ededed]",
                      showResult && isCorrectOption && "border-[#14f195]/24 bg-[#14f195]/[0.08] text-[#7dffc4]",
                      showResult && isSelected && !isCorrectOption && "border-[#f87171]/20 bg-[#f87171]/[0.08] text-[#ffb3b3]"
                    )}
                  >
                    {showResult && isCorrectOption && (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    {showResult && isSelected && !isCorrectOption && (
                      <X className="h-3.5 w-3.5" />
                    )}
                    {!showResult && isSelected && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ededed]" />
                    )}
                    {!showResult && !isSelected && (
                      <span>{optionLabel}</span>
                    )}
                  </span>

                  <span
                    className={cn(
                      "flex-1 text-sm leading-6",
                      !showResult && !isSelected && "text-[#a1a1a1]",
                      !showResult && isSelected && "text-[#ededed]",
                      showResult && isCorrectOption && "text-[#d7ffe9]",
                      showResult && isSelected && !isCorrectOption && "text-[#ffd7d7]"
                    )}
                  >
                    {option}
                  </span>
                </motion.button>
              );
            })}
          </div>
          
          {!hasSubmitted && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedIndex === null}
              className={cn(
                "mt-5 inline-flex rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                selectedIndex === null
                  ? "cursor-not-allowed border border-white/[0.08] bg-white/[0.03] text-[#707070]"
                  : "border border-white/[0.12] bg-[#ededed] text-[#0a0a0a] hover:bg-white"
              )}
            >
              Check Answer
            </button>
          )}

          <AnimatePresence>
            {hasSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-5"
              >
                <p
                  className={cn(
                    "text-sm font-medium",
                    isCorrect ? "text-[#14f195]" : "text-[#f87171]"
                  )}
                >
                  {isCorrect ? "Correct. The selected answer matches the lesson." : "Not quite. The correct answer is marked above."}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {explanation && hasSubmitted && (
            <div className="mt-4 border-t border-white/[0.06] pt-4">
              <button
                type="button"
                onClick={() => setShowExplanation(!showExplanation)}
                className="flex items-center gap-2 text-sm text-[#8a8a8a] transition-colors hover:text-[#ededed]"
              >
                <motion.span
                  animate={{ rotate: showExplanation ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.span>
                {showExplanation ? "Hide explanation" : "Show explanation"}
              </button>
              
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-3 border-l border-white/[0.08] pl-4 text-sm leading-6 text-[#9a9a9a]">
                      {explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
