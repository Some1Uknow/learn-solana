"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight, Clock, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

interface UpNextCardProps {
  // Next lesson
  nextTitle: string;
  nextDescription?: string;
  nextHref: string;
  nextLessonNumber?: string;
  nextReadingTime?: number;
  // Previous lesson
  prevTitle?: string;
  prevHref?: string;
  // Module info
  moduleName?: string;
}

export function UpNextCard({
  nextTitle,
  nextDescription,
  nextHref,
  nextLessonNumber,
  nextReadingTime,
  prevTitle,
  prevHref,
  moduleName,
}: UpNextCardProps) {
  return (
    <div className="ls-up-next my-12 pt-8 border-t border-white/[0.08]">
      {/* Section header */}
      {moduleName && (
        <p className="text-sm text-[#a1a1a1] mb-4">
          Up Next in <span className="text-[#a9ff2f]">{moduleName}</span>
        </p>
      )}

      {/* Next lesson card */}
      <Link href={nextHref}>
        <motion.div
          whileHover={{ scale: 1.01, y: -2 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative group rounded-xl overflow-hidden",
            "border border-white/[0.08]",
            "bg-gradient-to-br from-[#0a0a0a] to-[#111111]",
            "p-6",
            "transition-all duration-300",
            "hover:border-[#a9ff2f]/30 hover:shadow-[0_0_40px_-15px_#a9ff2f]"
          )}
        >
          {/* Large lesson number watermark */}
          {nextLessonNumber && (
            <div className="absolute top-4 right-6 text-[5rem] font-bold leading-none text-white/[0.03] select-none pointer-events-none">
              {nextLessonNumber}
            </div>
          )}

          {/* Content */}
          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-[#ededed] tracking-tight group-hover:text-white transition-colors">
              {nextTitle}
            </h3>

            {nextDescription && (
              <p className="mt-2 text-sm text-[#a1a1a1] leading-relaxed max-w-xl">
                {nextDescription}
              </p>
            )}

            {/* Footer row */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center gap-4">
                {nextReadingTime && (
                  <span className="flex items-center gap-1.5 text-xs text-[#a1a1a1]">
                    <Clock className="w-3.5 h-3.5" />
                    {nextReadingTime} min
                  </span>
                )}
              </div>

              <span className="flex items-center gap-1.5 text-sm font-medium text-[#a9ff2f] group-hover:gap-2 transition-all">
                Continue
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Previous lesson link */}
      {prevHref && prevTitle && (
        <Link
          href={prevHref}
          className="inline-flex items-center gap-2 mt-4 text-sm text-[#a1a1a1] hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous: {prevTitle}
        </Link>
      )}
    </div>
  );
}
