"use client";

import { useEffect, useState } from "react";
import { Users, Clock, Gamepad2, Trophy } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";

interface PlatformStats {
  totalUsers: number;
  totalTutorialMinutes: number;
  totalGamePlayers: number;
  totalRustChallengesAttempted: number;
  rustChallengeParticipants: number;
}

export function StatsBanner() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch stats:", err);
        setLoading(false);
      });
  }, []);

  if (loading || !stats) {
    return (
      <section className="container relative z-10 py-16 md:py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl p-8 animate-pulse"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="h-12 w-12 bg-white/5 rounded-2xl" />
                <div className="h-12 w-28 bg-white/5 rounded-lg" />
                <div className="h-4 w-32 bg-white/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  const statCards = [
    {
      value: stats.totalUsers,
      label: "Developers Learning",
      icon: Users,
      gradient: "from-[#14f195] to-[#9945ff]",
      iconBg: "bg-[#14f195]/10",
      iconColor: "text-[#14f195]",
    },
    {
      value: stats.totalTutorialMinutes,
      label: "Minutes of Learning",
      icon: Clock,
      gradient: "from-[#9945ff] to-[#00c2ff]",
      iconBg: "bg-[#9945ff]/10",
      iconColor: "text-[#9945ff]",
    },
    {
      value: stats.totalGamePlayers,
      label: "Game Players",
      icon: Gamepad2,
      gradient: "from-[#00c2ff] to-[#14f195]",
      iconBg: "bg-[#00c2ff]/10",
      iconColor: "text-[#00c2ff]",
    },
    {
      value: stats.rustChallengeParticipants,
      label: "Challenge Participants",
      icon: Trophy,
      gradient: "from-[#14f195] via-[#00c2ff] to-[#9945ff]",
      iconBg: "bg-gradient-to-br from-[#14f195]/10 to-[#9945ff]/10",
      iconColor: "text-[#14f195]",
    },
  ];

  return (
    <section className="container relative z-10 py-16 md:py-20">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <BlurFade key={index} delay={0.1 + index * 0.1} inView>
              <div
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-xl transition-all duration-500 hover:border-white/10 hover:shadow-2xl hover:shadow-[#9945ff]/10"
              >
                {/* Glow effect */}
                <div
                  className={`absolute -inset-[0.5px] bg-gradient-to-r ${stat.gradient} rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-20 -z-10`}
                />

                <div className="relative p-8 flex flex-col items-center text-center space-y-4">
                  {/* Icon */}
                  <div
                    className={`${stat.iconBg} p-3 rounded-2xl transition-transform duration-500 group-hover:scale-110`}
                  >
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} strokeWidth={2} />
                  </div>

                  {/* Number with ticker animation */}
                  <div className="space-y-1">
                    <div
                      className={`text-4xl md:text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                    >
                      <NumberTicker value={stat.value} delay={0.2 + index * 0.1} />
                    </div>
                  </div>

                  {/* Label */}
                  <p className="text-sm md:text-base text-zinc-400 font-medium tracking-wide">
                    {stat.label}
                  </p>
                </div>
              </div>
            </BlurFade>
          );
        })}
      </div>
    </section>
  );
}
