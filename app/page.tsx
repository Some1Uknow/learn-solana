"use client";

import {
  ArrowRight,
  BookOpen,
  Code,
  Layers,
  Globe,
  Trophy,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import HeroOrbitingLogos from "@/components/hero-orbiting-logos";

export default function Home() {
  const learningModules = [
    {
      title: "Basics of Solana",
      description: "Master the fundamentals of Solana blockchain development",
      modules: 10,
      exercises: 15,
      icon: BookOpen,
      gradient: "from-[#14F195] to-[#00C2FF]",
      bgGradient: "from-[#14F195]/10 to-[#00C2FF]/10",
      logo: "🔗",
    },
    {
      title: "Rust Programming",
      description: "Learn Rust for Solana smart contract development",
      modules: 12,
      exercises: 20,
      icon: Code,
      gradient: "from-[#9945FF] to-[#14F195]",
      bgGradient: "from-[#9945FF]/10 to-[#14F195]/10",
      logo: "⚙️",
    },
    {
      title: "Anchor Framework",
      description: "Build powerful dApps with the Anchor framework",
      modules: 8,
      exercises: 12,
      icon: Layers,
      gradient: "from-[#00C2FF] to-[#9945FF]",
      bgGradient: "from-[#00C2FF]/10 to-[#9945FF]/10",
      logo: "⚓",
    },
    {
      title: "Client-side Next.js",
      description: "Connect your dApps to beautiful frontends",
      modules: 15,
      exercises: 25,
      icon: Globe,
      gradient: "from-[#14F195] to-[#9945FF]",
      bgGradient: "from-[#14F195]/10 to-[#9945FF]/10",
      logo: "⚛️",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0c0c10] text-white">
      {/* Gradient background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[50%] h-[70%] bg-[#14F195]/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[60%] bg-[#9945FF]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[40%] bg-[#00C2FF]/20 blur-[120px] rounded-full" />
      </div>
      {/* Navbar */}
      <nav className="container mx-auto py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-space-grotesk">
            learn.sol
          </span>
          <div className="h-2 w-2 rounded-full bg-[#14F195] animate-pulse" />
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="text-white/80 hover:text-white">
            About
          </Button>
          <Button variant="ghost" className="text-white/80 hover:text-white">
            Features
          </Button>
          <Button variant="ghost" className="text-white/80 hover:text-white">
            Docs
          </Button>
          <Button className="bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black">
            Get Started
          </Button>
        </div>      </nav>      {/* Hero Section */}
      <section className="container mx-auto py-12 md:py-16 px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Hero Content - Left Side (2/3) */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight font-space-grotesk mb-4">
              Master Solana{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-[#9945FF]">
                Development
              </span>
            </h1>
            <p className="text-lg text-white/70 mb-6 leading-relaxed">
              The ultimate learning platform for Solana developers. Start your
              journey from basics to advanced concepts.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/learning">
                <Button className="bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black h-12 px-8 text-base font-semibold w-full sm:w-auto">
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                className="border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 h-12 px-8 text-base w-full sm:w-auto"
              >
                View Roadmap
              </Button>
            </div>
          </div>
          
          {/* Orbiting Circles - Right Side (1/3) */}
          <div className="flex justify-center lg:justify-end">
            <HeroOrbitingLogos />
          </div>
        </div>
      </section>{/* Learning Modules Section */}
      <section className="container mx-auto py-20 px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 font-space-grotesk">
            Start Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-[#9945FF]">
              Learning Journey
            </span>
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Choose from our comprehensive modules designed to take you from
            beginner to expert in Solana development.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {learningModules.map((module, index) => (
              <div key={index} className="group relative cursor-pointer">
                {/* Glassmorphism Card */}
                <div
                  className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl blur-sm"
                  style={{
                    background: `linear-gradient(135deg, ${module.gradient
                      .replace("from-", "")
                      .replace("to-", ", ")})`,
                  }}
                />

                <div
                  className={`relative h-full bg-gradient-to-br ${module.bgGradient} backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl transform group-hover:scale-105 transition-all duration-300`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-3xl">{module.logo}</div>
                    <div
                      className={`h-10 w-10 rounded-full bg-gradient-to-r ${module.gradient} flex items-center justify-center opacity-80`}
                    >
                      <module.icon className="h-5 w-5 text-black" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 font-space-grotesk">
                    {module.title}
                  </h3>
                  <p className="text-white/70 text-sm mb-6 leading-relaxed">
                    {module.description}
                  </p>

                  {/* Stats */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-white/60" />
                        <span className="text-sm text-white/60">Modules</span>
                      </div>
                      <span className="text-sm font-medium">
                        {module.modules}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-white/60" />
                        <span className="text-sm text-white/60">Exercises</span>
                      </div>
                      <span className="text-sm font-medium">
                        {module.exercises}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-white/60">Progress</span>
                      <span className="text-xs text-white/60">0%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-0 bg-gradient-to-r from-white/20 to-white/40 rounded-full transition-all duration-300 group-hover:w-[20%]"></div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <Button
                    className={`w-full bg-gradient-to-r ${module.gradient} text-black hover:opacity-90 transition-all duration-200 font-medium`}
                  >
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>      {/* CTA Section */}
      <section className="container mx-auto py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-3xl blur-lg opacity-20"></div>
            <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 p-16 text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 font-space-grotesk">
                Ready to become a{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-[#9945FF]">
                  Solana expert?
                </span>
              </h2>
              <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join thousands of developers mastering Solana development through
                our comprehensive learning platform.
              </p>
              <Link href="/learning">
                <Button className="bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black h-14 px-10 text-lg font-semibold">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
