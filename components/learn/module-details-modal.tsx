"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  Code,
  Target,
  Clock,
  CheckCircle2,
  PlayCircle,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Module } from "@/types/learning";
// Removed getModuleProgress, getTopicCompletion imports for fixed values

interface ModuleDetailsModalProps {
  module: Module | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ModuleDetailsModal({
  module,
  isOpen,
  onClose,
}: ModuleDetailsModalProps) {
  const router = useRouter();

  if (!module) return null;

  // Fixed values for demonstration
  const progress = 60; // e.g., 60% progress
  const completedTopics = 3;
  const totalTopics = 5;
  const estimatedHours = 2;
  const theoryTopics = 2;
  const exerciseTopics = 2;
  const projectTopics = 1;

  const handleStartModule = () => {
    router.push(`/learn/${module.id}`);
    onClose();
  };

  const getTopicIcon = (type: string) => {
    switch (type) {
      case 'theory':
        return <BookOpen className="h-4 w-4" />;
      case 'exercise':
        return <Code className="h-4 w-4" />;
      case 'project':
        return <Target className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getTopicColor = (type: string) => {
    switch (type) {
      case 'theory':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'exercise':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'project':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-black/95 border-green-500/20 text-white p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 shrink-0">
                <Image
                  src={module.image}
                  alt={module.title}
                  width={64}
                  height={64}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-white mb-2">
                  {module.title}
                </DialogTitle>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {module.description}
                </p>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="px-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card className="bg-gray-900/50 border-gray-700/50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Duration</span>
                </div>
                <p className="text-lg font-semibold text-white">{estimatedHours}h</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700/50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <BookOpen className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Topics</span>
                </div>
                <p className="text-lg font-semibold text-white">{totalTopics}</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700/50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Completed</span>
                </div>
                <p className="text-lg font-semibold text-white">{completedTopics}/{totalTopics}</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900/50 border-gray-700/50">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Target className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Progress</span>
                </div>
                <p className="text-lg font-semibold text-white">{progress}%</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Overall Progress</span>
              <span className="text-sm text-white font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div
                className="h-full bg-linear-to-r from-green-500 to-green-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* Topic Types Summary */}
          <div className="flex gap-2 mb-6">
            {theoryTopics > 0 && (
              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                <BookOpen className="h-3 w-3 mr-1" />
                {theoryTopics} Theory
              </Badge>
            )}
            {exerciseTopics > 0 && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                <Code className="h-3 w-3 mr-1" />
                {exerciseTopics} Exercise
              </Badge>
            )}
            {projectTopics > 0 && (
              <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                <Target className="h-3 w-3 mr-1" />
                {projectTopics} Project
              </Badge>
            )}
          </div>
        </div>

        {/* Topics List */}
        <ScrollArea className="flex-1 px-6 pb-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-white mb-4">Module Contents</h3>
            {module.topics && module.topics.length > 0 ? (
              // Show 5 fixed topics for demo
              Array.from({ length: totalTopics }).map((_, index) => {
                const isCompleted = index < completedTopics;
                const topicType = index === 4 ? 'project' : index % 2 === 0 ? 'theory' : 'exercise';
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-gray-900/30 border-gray-700/30 hover:border-gray-600/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <motion.div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${
                              isCompleted
                                ? "bg-green-500"
                                : "bg-gray-600"
                            }`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            ) : (
                              <span className="text-xs text-white font-medium">
                                {index + 1}
                              </span>
                            )}
                          </motion.div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-medium text-white">Topic {index + 1}</h4>
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${getTopicColor(topicType)}`}
                              >
                                {getTopicIcon(topicType)}
                                <span className="ml-1 capitalize">{topicType}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">
                              This is a demo topic description.
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })
            ) : (
              <p className="text-gray-400 text-center py-8">
                No topics available for this module
              </p>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="p-6 pt-0 border-t border-gray-700/50">
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleStartModule}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md transition-colors duration-200 flex items-center gap-2"
            >
              <PlayCircle className="h-4 w-4" />
              {progress > 0 ? 'Continue Module' : 'Start Module'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
