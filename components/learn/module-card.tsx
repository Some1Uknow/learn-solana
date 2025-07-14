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
  ArrowRight,
  Hexagon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Module } from "@/types/learning";
// Removed getModuleProgress, getTopicCompletion imports for fixed values

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
  // Fixed values for demonstration
  const progress = 60; // e.g., 60% progress
  const isCompleted = false;
  const isStarted = true;
  const completedTopics = 3;
  const totalTopics = 5;
  const estimatedHours = 2;
  const theoryTopics = 2;
  const exerciseTopics = 2;
  const projectTopics = 1;

  const handleStartModule = () => {
    router.push(`/learn/${module.id}`);
  };

  const getCategoryFromTitle = (title: string): string => {
    const lowerTitle = title.toLowerCase();
    
    // Programming Languages
    if (lowerTitle.includes('rust') || lowerTitle.includes('solidity') || lowerTitle.includes('javascript') || lowerTitle.includes('typescript')) return 'Programming';
    
    // AI/ML related
    if (lowerTitle.includes('ai') || lowerTitle.includes('artificial intelligence') || lowerTitle.includes('machine learning') || lowerTitle.includes('smart contract ai')) return 'Core AI';
    
    // Data & Analytics
    if (lowerTitle.includes('data') || lowerTitle.includes('analytics') || lowerTitle.includes('analysis')) return 'Analytics';
    
    // Blockchain & Web3
    if (lowerTitle.includes('blockchain') || lowerTitle.includes('solana') || lowerTitle.includes('web3') || lowerTitle.includes('defi') || lowerTitle.includes('crypto')) return 'Blockchain';
    
    // Development
    if (lowerTitle.includes('development') || lowerTitle.includes('programming') || lowerTitle.includes('coding')) return 'Development';
    
    return 'General';
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
      className="group"
    >
      <Card className="relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/30 border-0 shadow-lg hover:shadow-xl transition-all duration-500 h-full overflow-hidden backdrop-blur-sm hover:scale-[1.02]">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        
        <CardContent className="p-8 h-full flex flex-col">
          {/* Logo Container with Background */}
          <div className="relative mb-8">
            <motion.div
              className="w-full h-48 mx-auto relative"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: index * 0.1 + 0.2, 
                duration: 0.6,
                type: "spring",
                stiffness: 200
              }}
            >
              {/* Rectangle container with subtle background */}
              <div className="w-full h-full rounded-2xl flex items-center justify-center p-6 shadow-sm">
                {module.image ? (
                  <Image
                    src={module.image}
                    alt={module.title}
                    width={156}
                    height={156}
                    className="w-39 h-39 object-contain"
                  />
                ) : (
                  <Hexagon className="w-30 h-30 text-gray-400 dark:text-gray-500" />
                )}
              </div>
            </motion.div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col text-center">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.5 }}
              className="text-xl font-bold text-gray-900 dark:text-white mb-4 leading-tight"
            >
              {module.title}
            </motion.h3>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.6 }}
              className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8 flex-1"
            >
              {module.description}
            </motion.p>

            {/* Progress indicator */}
            {progress > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 + 0.7 }}
                className="mb-6"
              >
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-2">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{
                      delay: index * 0.1 + 0.8,
                      duration: 1,
                      ease: "easeOut",
                    }}
                  />
                </div>
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                  <span>{getStatusText()}</span>
                  <span>{progress}% complete</span>
                </div>
              </motion.div>
            )}

            {/* Read more button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.8 }}
              onClick={handleStartModule}
              className="group/btn inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 font-medium text-sm"
            >
              <span>{isStarted ? 'Continue learning' : 'Read more'}</span>
              <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
