"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Info,
  AlertTriangle,
  Lightbulb,
  Microscope,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CalloutVariant = "info" | "warning" | "tip" | "deep-dive";
type LegacyCalloutType = "info" | "warn" | "warning" | "tip";

interface CalloutProps {
  variant?: CalloutVariant;
  type?: LegacyCalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
  defaultExpanded?: boolean;
}

const variantConfig = {
  info: {
    icon: Info,
    accentColor: "#00c2ff",
    bgGradient: "from-[#00c2ff]/5 to-transparent",
    borderGradient: "from-[#00c2ff]/30 via-[#00c2ff]/10 to-transparent",
    defaultTitle: "Info",
  },
  warning: {
    icon: AlertTriangle,
    accentColor: "#ffbd2e",
    bgGradient: "from-[#ffbd2e]/5 to-transparent",
    borderGradient: "from-[#ffbd2e]/30 via-[#ffbd2e]/10 to-transparent",
    defaultTitle: "Warning",
  },
  tip: {
    icon: Lightbulb,
    accentColor: "#a9ff2f",
    bgGradient: "from-[#a9ff2f]/5 to-transparent",
    borderGradient: "from-[#a9ff2f]/30 via-[#a9ff2f]/10 to-transparent",
    defaultTitle: "Pro Tip",
  },
  "deep-dive": {
    icon: Microscope,
    accentColor: "#9945ff",
    bgGradient: "from-[#9945ff]/5 to-transparent",
    borderGradient: "from-[#9945ff]/30 via-[#9945ff]/10 to-transparent",
    defaultTitle: "Deep Dive",
  },
};

export function Callout({
  variant = "info",
  type,
  title,
  children,
  className,
  defaultExpanded = false,
}: CalloutProps) {
  const resolvedVariant =
    variant !== "info"
      ? variant
      : type === "warn" || type === "warning"
        ? "warning"
        : type === "tip"
          ? "tip"
          : "info";
  const [isExpanded, setIsExpanded] = useState(
    resolvedVariant !== "deep-dive" || defaultExpanded
  );
  const config = variantConfig[resolvedVariant];
  const Icon = config.icon;
  const isExpandable = resolvedVariant === "deep-dive";

  return (
    <div
      className={cn(
        "ls-callout relative my-6 rounded-xl overflow-hidden",
        "border border-transparent",
        className
      )}
      style={
        {
          "--callout-accent": config.accentColor,
        } as React.CSSProperties
      }
    >
      {/* Gradient border effect */}
      <div
        className={cn(
          "absolute inset-0 rounded-xl p-[1px]",
          "bg-gradient-to-br",
          config.borderGradient
        )}
        style={{ zIndex: 0 }}
      />

      {/* Background */}
      <div
        className={cn(
          "relative rounded-xl",
          "bg-gradient-to-br",
          config.bgGradient,
          "bg-[#0a0a0a]"
        )}
        style={{ zIndex: 1 }}
      >
        {/* Header */}
        <div
          className={cn(
            "flex items-center gap-3 px-4 py-3",
            isExpandable && "cursor-pointer hover:bg-white/[0.02] transition-colors"
          )}
          onClick={isExpandable ? () => setIsExpanded(!isExpanded) : undefined}
          role={isExpandable ? "button" : undefined}
          aria-expanded={isExpandable ? isExpanded : undefined}
        >
          <span
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-lg",
              "bg-[var(--callout-accent)]/10"
            )}
          >
            <Icon
              className={cn(
                "w-4 h-4",
                resolvedVariant === "warning" && "animate-pulse"
              )}
              style={{ color: config.accentColor }}
            />
          </span>
          
          <span
            className="flex-1 text-sm font-semibold"
            style={{ color: config.accentColor }}
          >
            {title || config.defaultTitle}
          </span>
          
          {isExpandable && (
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-[var(--callout-accent)]/60"
            >
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          )}
        </div>

        {/* Content */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={isExpandable ? { height: 0, opacity: 0 } : false}
              animate={{ height: "auto", opacity: 1 }}
              exit={isExpandable ? { height: 0, opacity: 0 } : undefined}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 pt-1 text-sm text-[#a1a1a1] leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_code]:bg-white/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[#ededed] [&_a]:text-[var(--callout-accent)] [&_a]:underline [&_a:hover]:opacity-80">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Convenience exports for MDX
export function InfoCallout({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <Callout variant="info" title={title}>
      {children}
    </Callout>
  );
}

export function WarningCallout({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <Callout variant="warning" title={title}>
      {children}
    </Callout>
  );
}

export function TipCallout({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <Callout variant="tip" title={title}>
      {children}
    </Callout>
  );
}

export function DeepDive({
  title,
  children,
  defaultExpanded = false,
}: {
  title?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}) {
  return (
    <Callout variant="deep-dive" title={title} defaultExpanded={defaultExpanded}>
      {children}
    </Callout>
  );
}
