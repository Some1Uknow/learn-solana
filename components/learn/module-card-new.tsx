"use client";

import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Code,
  Target,
  Clock,
  PlayCircle,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Module } from "@/types/learning";
import { getModuleProgress, getTopicCompletion } from "@/lib/progress-data";

interface ModuleCardProps {
  module: Module;
  index: number;
  onViewDetails: () => void;
}

export default function ModuleCard({
  module,
  index,
  onViewDetails,
}: ModuleCardProps) {
  const router = useRouter();
  const progress = getModuleProgress(module.id);
  const isCompleted = progress === 100;
  const isStarted = progress > 0;
  const completedTopics =
    module.topics?.filter((topic) => getTopicCompletion(module.id, topic.id))
      .length || 0;
  const totalTopics = module.topics?.length || 0;
  
  const estimatedHours = Math.ceil((totalTopics * 30) / 60); // 30 min per topic average
  const theoryTopics = module.topics?.filter(topic => topic.type === 'theory').length || 0;
  const exerciseTopics = module.topics?.filter(topic => topic.type === 'exercise').length || 0;
  const projectTopics = module.topics?.filter(topic => topic.type === 'project').length || 0;

  const handleStartModule = () => {
    router.push(`/learn/${module.id}`);
  };

  const getStatusText = () => {
    if (isCompleted) return "Completed";
    if (isStarted) return "In Progress";
    return "Not Started";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Card className="bg-black/40 border-green-500/20 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300 h-full">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="w-16 h-16 flex-shrink-0">
              <Image
                src={module.image}
                alt={module.title}
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <motion.div
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                isCompleted
                  ? "bg-green-500/20 text-green-400"
                  : isStarted
                  ? "bg-yellow-500/20 text-yellow-400"
                  : "bg-gray-600/20 text-gray-400"
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              {getStatusText()}
            </motion.div>
          </div>

          <CardTitle className="text-lg font-semibold text-white mb-2 leading-tight">
            {module.title}
          </CardTitle>
          
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-2">
            {module.description}
          </p>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-400">Duration</span>
              </div>
              <p className="text-sm font-semibold text-white">{estimatedHours}h</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <BookOpen className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-400">Topics</span>
              </div>
              <p className="text-sm font-semibold text-white">{totalTopics}</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-400">Progress</span>
              </div>
              <p className="text-sm font-semibold text-white">{progress}%</p>
            </div>
          </div>

          {/* Topic Types */}
          <div className="flex flex-wrap gap-1 mb-4">
            {theoryTopics > 0 && (
              <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20">
                {theoryTopics} Theory
              </Badge>
            )}
            {exerciseTopics > 0 && (
              <Badge variant="outline" className="text-xs bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                {exerciseTopics} Exercise
              </Badge>
            )}
            {projectTopics > 0 && (
              <Badge variant="outline" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/20">
                {projectTopics} Project
              </Badge>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400">Completion</span>
              <span className="text-xs text-white font-medium">
                {completedTopics}/{totalTopics} topics
              </span>
            </div>
            <motion.div
              className="w-full bg-gray-800 rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: index * 0.1 + 0.5, duration: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{
                  delay: index * 0.1 + 0.7,
                  duration: 0.8,
                  ease: "easeOut",
                }}
              />
            </motion.div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={onViewDetails}
              className="flex-1 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>
            <button
              onClick={handleStartModule}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <PlayCircle className="h-4 w-4" />
              {isStarted ? 'Continue' : 'Start'}
            </button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
