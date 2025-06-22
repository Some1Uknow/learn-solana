"use client";

import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import contentsData from "@/data/contents-data.json";
import {
  BookOpen,
  Code,
  Cpu,
  Database,
  Globe,
  Shield,
  Zap,
  Wrench,
  Rocket,
  Brain,
  Settings,
} from "lucide-react";

// Define icons for each module (including part-8)
const moduleIcons = {
  "part-0": Wrench,
  "part-1": Code,
  "part-2": Cpu,
  "part-3": Database,
  "part-4": Shield,
  "part-5": Zap,
  "part-6": Globe,
  "part-7": BookOpen,
  "part-8": Rocket,
};

// Creative and innovative grid layout configuration
const getCreativeGridLayout = (index: number, total: number) => {
  // Check if this is the last item (part-8)
  if (index === total - 1) {
    // Last item gets full width
    return "col-span-1 md:col-span-2 lg:col-span-3 row-span-2 min-h-[12rem] md:min-h-[14rem] lg:min-h-[16rem]";
  }

  // Alternating pattern: 2/3 width, 1/3 width for even rows
  // Pattern: part 0 (2/3), part 1 (1/3), then part 2 (1/3), part 3 (2/3), then part 4 (2/3), part 5 (1/3), etc.
  const layouts = [
    // Part 0 - 2/3 width with proper height
    "col-span-1 md:col-span-2 lg:col-span-2 row-span-2 min-h-[12rem] md:min-h-[14rem] lg:min-h-[16rem]",

    // Part 1 - 1/3 width with same height as part 0
    "col-span-1 md:col-span-1 lg:col-span-1 row-span-2 min-h-[12rem] md:min-h-[14rem] lg:min-h-[16rem]",

    // Part 2 - 1/3 width
    "col-span-1 md:col-span-1 lg:col-span-1 row-span-2 min-h-[12rem] md:min-h-[14rem] lg:min-h-[16rem]",

    // Part 3 - 2/3 width
    "col-span-1 md:col-span-2 lg:col-span-2 row-span-2 min-h-[12rem] md:min-h-[14rem] lg:min-h-[16rem]",

    // Part 4 - 2/3 width
    "col-span-1 md:col-span-2 lg:col-span-2 row-span-2 min-h-[12rem] md:min-h-[14rem] lg:min-h-[16rem]",

    // Part 5 - 1/3 width
    "col-span-1 md:col-span-1 lg:col-span-1 row-span-2 min-h-[12rem] md:min-h-[14rem] lg:min-h-[16rem]",

    // Part 6 - 1/3 width
    "col-span-1 md:col-span-1 lg:col-span-1 row-span-2 min-h-[12rem] md:min-h-[14rem] lg:min-h-[16rem]",

    // Part 7 - 2/3 width
    "col-span-1 md:col-span-2 lg:col-span-2 row-span-2 min-h-[12rem] md:min-h-[14rem] lg:min-h-[16rem]",
  ];

  return (
    layouts[index] ||
    "col-span-1 md:col-span-1 lg:col-span-1 row-span-2 min-h-[12rem] md:min-h-[14rem] lg:min-h-[16rem]"
  );
};

export function ContentsSection() {
  return (
    <div className="bg-black min-h-screen py-20 mt-10 rounded-2xl relative overflow-hidden">
      {/* Animated Background */}
      <ShootingStars className="z-0" />
      <StarsBackground className="z-0" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="m-32 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4">
            {contentsData.header.title}
          </h2>
          <p className="text-lg text-neutral-400 max-w-3xl mx-auto">
            {contentsData.header.description}
          </p>
        </div>{" "}
        {/* Creative Bento Grid Layout */}
        <BentoGrid className="auto-rows-[12rem] md:auto-rows-[14rem] lg:auto-rows-[16rem] grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {contentsData.modules.map((module, index) => {
            const Icon =
              moduleIcons[module.id as keyof typeof moduleIcons] || BookOpen;

            return (
              <BentoCard
                key={module.id}
                name={module.title}
                className={`${getCreativeGridLayout(
                  index,
                  contentsData.modules.length
                )} bg-neutral-900/50 border-neutral-800 hover:bg-neutral-800/50 hover:border-neutral-700 transition-all duration-300`}
                background={
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/20 via-transparent to-neutral-900/40" />
                }
                Icon={Icon}
                description={module.description}
                href={`/learn/${module.id}`}
                cta="Start Learning"
                topicsCount={module.topics?.length}
                moduleId={module.id}
                hoverImage={module.image}
              />
            );
          })}
        </BentoGrid>
      </div>
    </div>
  );
}
