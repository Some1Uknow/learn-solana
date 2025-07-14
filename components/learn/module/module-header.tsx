import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Module } from "./types";

interface ModuleHeaderProps {
  module: Module;
  progressPercentage?: number;
}

export const ModuleHeader = ({ module, progressPercentage = 0 }: ModuleHeaderProps) => {
  return (
    <div className="mb-8 w-4/5 mx-auto">
      <Link href="/learn">
        <Button
          variant="ghost"
          className="bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Learning
        </Button>
      </Link>
      <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-6">
        <div className="flex items-center space-x-6">
          <div className="flex-shrink-0">
            {module.image ? (
              <img
                src={module.image}
                alt={module.title}
                className="w-16 h-16 object-contain"
              />
            ) : (
              <BookOpen className="w-16 h-16 text-white" />
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-white mb-2">
              {module.title}
            </h1>
            <p className="text-white/80 text-lg mb-4">
              {module.description}
            </p>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Progress value={progressPercentage} className="w-32 h-2" />
                <span className="text-white/80 text-sm">
                  0/{module.topics.length} completed
                </span>
              </div>
              <Badge
                variant="secondary"
                className="bg-white/10 backdrop-blur-sm border border-white/20 text-white"
              >
                {module.topics.length} topics
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
