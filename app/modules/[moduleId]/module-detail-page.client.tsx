"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { BlurFade } from "@/components/ui/blur-fade";
import { ModuleItem } from "@/components/learn/modules-grid";
import { ArrowLeft, BookOpen, Code, FileText, Rocket } from "lucide-react";

const typeIcons: Record<string, React.ElementType> = {
  overview: BookOpen,
  theory: FileText,
  exercise: Code,
  project: Rocket,
  setup: Code,
  challenge: Code,
};

export default function ModuleDetailPageClient({
  module,
}: {
  module: ModuleItem;
}) {
  const router = useRouter();

  // Build array of all course parts: Overview + Topics
  const courseParts = [
    {
      key: `${module.id}-overview`,
      title: module.title || "Overview",
      description: module.goal || module.description,
      type: "overview",
      href: module.overviewUrl || `/learn/${module.id}`,
    },
    ...module.topics.map((t) => ({
      key: t.id,
      title: t.title,
      description: t.description,
      type: t.type,
      href: t.url || `/learn/${module.id}/${t.id}`,
    })),
  ];

  return (
    <div className="min-h-screen w-full relative text-white">
      {/* Fixed gradient background - Learning Journey theme */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          background: `
            radial-gradient(circle 450px at 15% 15%, rgba(153, 69, 255, 0.2), transparent),
            radial-gradient(circle 300px at 80% 30%, rgba(20, 241, 149, 0.1), transparent),
            radial-gradient(ellipse 80% 40% at 60% 90%, rgba(20, 241, 149, 0.08), transparent),
            radial-gradient(circle 200px at 30% 70%, rgba(153, 69, 255, 0.06), transparent),
            #000000
          `,
        }}
      />

      <Navbar />

      <div className="pt-28 pb-16 px-4 sm:px-6 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb & Back */}
          <BlurFade delay={0.05} inView>
            <div className="flex items-center justify-between mb-8">
              <nav className="text-sm text-zinc-400">
                <Link href="/" className="hover:text-[#14f195] transition-colors">
                  Home
                </Link>
                <span className="mx-2">/</span>
                <Link href="/modules" className="hover:text-[#14f195] transition-colors">
                  Modules
                </Link>
                <span className="mx-2">/</span>
                <span className="text-white">{module.title}</span>
              </nav>
              <button
                onClick={() => router.push("/modules")}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            </div>
          </BlurFade>

          {/* Header Section */}
          <BlurFade delay={0.1} inView>
            <div className="mb-12">
              <div className="flex items-start gap-4 mb-4">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <Image
                    src={module.image || "/placeholder.png"}
                    alt={module.title}
                    fill
                    className="object-contain"
                  />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  {module.title}
                </h1>
              </div>
              <p className="text-lg text-zinc-400 max-w-3xl">
                {module.description}
              </p>
            </div>
          </BlurFade>

          {/* Course Grid */}
          <BentoGrid className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[20rem] gap-5">
            {courseParts.map((part, index) => {
              const IconComponent = typeIcons[part.type.toLowerCase()] || BookOpen;
              return (
                <BlurFade key={part.key} delay={0.1 + index * 0.04} inView>
                  <Link href={part.href} className="block h-full group">
                    <BentoCard
                      name={part.title}
                      className="h-full col-span-1 bg-white/[0.02] border-white/[0.06] hover:border-[#14f195]/40 transition-all duration-300 hover:shadow-[0_0_40px_rgba(20,241,149,0.1)]"
                      background={
                        <div className="absolute inset-0 bg-gradient-to-br from-[#9945ff]/5 via-transparent to-[#14f195]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      }
                      Icon={() => (
                        <div className="w-12 h-12 rounded-xl bg-[#14f195]/10 flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-[#14f195]" />
                        </div>
                      )}
                      description={part.description}
                      href={part.href}
                      cta="Start lesson"
                    />
                  </Link>
                </BlurFade>
              );
            })}
          </BentoGrid>
        </div>
      </div>
    </div>
  );
}
