"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, CheckCircle2, Clock, BookOpen } from "lucide-react";

interface StatsCardsProps {
  overallProgress: number;
  completedModules: number;
  inProgressModules: number;
  totalModules: number;
}

export default function StatsCards({
  overallProgress,
  completedModules,
  inProgressModules,
  totalModules,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <Card className="bg-black/40 border-green-500/20 backdrop-blur-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">
            Overall Progress
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {overallProgress}%
          </div>
          <Progress
            value={overallProgress}
            className="mt-2 h-2 bg-gray-800"
          >
            <div
              className="h-full bg-linear-to-r from-green-500 to-green-400 transition-all rounded-full"
              style={{ width: `${overallProgress}%` }}
            />
          </Progress>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-green-500/20 backdrop-blur-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">
            Completed Modules
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {completedModules}
          </div>
          <p className="text-xs text-gray-400">
            out of {totalModules} modules
          </p>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-green-500/20 backdrop-blur-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">
            In Progress
          </CardTitle>
          <Clock className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {inProgressModules}
          </div>
          <p className="text-xs text-gray-400">modules started</p>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-green-500/20 backdrop-blur-xs">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-300">
            Total Modules
          </CardTitle>
          <BookOpen className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {totalModules}
          </div>
          <p className="text-xs text-gray-400">available modules</p>
        </CardContent>
      </Card>
    </div>
  );
}
