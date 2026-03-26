"use client";

import { useEffect, useState, useCallback } from "react";

interface ParallaxPosition {
  x: number;
  y: number;
}

export function useMouseParallax(intensity: number = 15): ParallaxPosition {
  const [position, setPosition] = useState<ParallaxPosition>({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // Calculate position relative to center of viewport (-0.5 to 0.5)
      const x = (e.clientX / window.innerWidth - 0.5) * intensity;
      const y = (e.clientY / window.innerHeight - 0.5) * intensity;
      setPosition({ x, y });
    },
    [intensity]
  );

  useEffect(() => {
    // Debounce for performance (60fps = ~16ms)
    let rafId: number;
    let lastEvent: MouseEvent | null = null;

    const throttledHandler = (e: MouseEvent) => {
      lastEvent = e;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          if (lastEvent) {
            handleMouseMove(lastEvent);
          }
          rafId = 0;
        });
      }
    };

    window.addEventListener("mousemove", throttledHandler);
    return () => {
      window.removeEventListener("mousemove", throttledHandler);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [handleMouseMove]);

  return position;
}
