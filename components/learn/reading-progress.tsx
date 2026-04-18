"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function ReadingProgress() {
  const [isVisible, setIsVisible] = useState(false);
  const progress = useMotionValue(0);
  const springProgress = useSpring(progress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const calculateProgress = () => {
      const article = document.querySelector("article");
      if (!article) return;

      const scrollTop = window.scrollY;
      const docHeight = article.scrollHeight;
      const winHeight = window.innerHeight;
      const articleTop = article.offsetTop;
      
      // Start measuring from article start
      const scrolledFromArticle = scrollTop - articleTop + winHeight;
      const articleScrollableHeight = docHeight;
      
      const scrollProgress = Math.min(
        Math.max((scrolledFromArticle / articleScrollableHeight), 0),
        1
      );
      
      progress.set(scrollProgress);
      setIsVisible(scrollTop > 100); // Show after scrolling a bit
    };

    calculateProgress();
    window.addEventListener("scroll", calculateProgress, { passive: true });
    window.addEventListener("resize", calculateProgress);

    return () => {
      window.removeEventListener("scroll", calculateProgress);
      window.removeEventListener("resize", calculateProgress);
    };
  }, [progress]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-transparent"
      aria-hidden="true"
    >
      <motion.div
        className="h-full origin-left"
        style={{
          scaleX: springProgress,
          background: "linear-gradient(90deg, #a9ff2f 0%, #9945ff 50%, #00c2ff 100%)",
        }}
      />
    </motion.div>
  );
}
