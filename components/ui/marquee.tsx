import React, { ComponentPropsWithoutRef, memo } from "react";

import { cn } from "@/lib/cn";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
}

function MarqueeBase({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 2,
  ...props
}: MarqueeProps) {
  const containerAxis = vertical ? "flex-col" : "flex-row";
  const baseAxis = vertical ? "flex-col" : "flex-row";
  const animationClass = reverse
    ? vertical
      ? "animate-marquee-vertical-reverse"
      : "animate-marquee-reverse"
    : vertical
      ? "animate-marquee-vertical"
      : "animate-marquee";
  const hoverPause = pauseOnHover ? "group-hover:[animation-play-state:paused]" : "";

  return (
    <div
      {...props}
      className={cn(
        "group flex [gap:var(--gap)] overflow-hidden p-2 [--duration:40s] [--gap:1rem]",
        containerAxis,
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              "flex shrink-0 justify-around [gap:var(--gap)] will-change-transform",
              baseAxis,
              animationClass,
              hoverPause
            )}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

export const Marquee = memo(MarqueeBase);
