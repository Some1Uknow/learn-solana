"use client";

import { useEffect, useState } from "react";
import { Users, Clock, Gamepad2, Trophy } from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";

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
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-6 animate-pulse">
                <div className="h-8 w-16 bg-neutral-800 rounded mb-2" />
                <div className="h-4 w-24 bg-neutral-800 rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const statCards = [
    {
      value: stats.totalUsers,
      label: "Developers",
      icon: Users,
      color: "text-[#14f195]",
    },
    {
      value: stats.totalTutorialMinutes,
      label: "Learning Minutes",
      icon: Clock,
      color: "text-[#9945ff]",
    },
    {
      value: stats.totalGamePlayers,
      label: "Game Players",
      icon: Gamepad2,
      color: "text-[#00c2ff]",
    },
    {
      value: stats.rustChallengeParticipants,
      label: "Challengers",
      icon: Trophy,
      color: "text-[#14f195]",
    },
  ];

  return (
    <section className="py-20 border-t border-neutral-900">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group rounded-lg border border-neutral-800 bg-neutral-900/30 p-6 transition-colors hover:border-neutral-700"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                  <span className="text-xs text-neutral-500 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <div className={`text-3xl md:text-4xl font-semibold tracking-tight ${stat.color}`}>
                  <NumberTicker value={stat.value} delay={0.1 + index * 0.1} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
