"use client";

import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Module } from "@/types/learning";
import { getModuleProgress, getTopicCompletion } from "@/lib/progress-data";
import TopicItem from "./topic-item";

interface ModuleCardProps {
  module: Module;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

export default function ModuleCard({
  module,
  index,
  isOpen,
  onToggle,
}: ModuleCardProps) {
  const router = useRouter();
  const progress = getModuleProgress(module.id);
  const isCompleted = progress === 100;
  const isStarted = progress > 0;
  const completedTopics =
    module.topics?.filter((topic) => getTopicCompletion(module.id, topic.id))
      .length || 0;
  const totalTopics = module.topics?.length || 0;

  const handleModuleClick = () => {
    router.push(`/learn/${module.id}`);
  };

  return (
    <motion.div
      key={module.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >      <Card className="bg-black/40 border-green-500/20 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300">        <Collapsible open={isOpen} onOpenChange={onToggle}>
          <CardHeader className="pb-4 px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                {/* Module Image */}
                <div className="flex-shrink-0 w-12 h-12">
                  <Image
                    src={module.image}
                    alt={module.title}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <motion.div
                  className={`w-4 h-4 rounded-full ${
                    isCompleted
                      ? "bg-green-500"
                      : isStarted
                      ? "bg-yellow-500"
                      : "bg-gray-600"
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                />
                <div className="text-left flex-1">
                  <CardTitle className="text-lg font-semibold text-white mb-2">
                    {module.title}
                  </CardTitle>
                  {totalTopics > 0 && (
                    <motion.p
                      className="text-sm text-gray-400 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + 0.4 }}
                    >
                      {completedTopics} of {totalTopics} topics completed
                    </motion.p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-base font-medium text-gray-300">
                  {progress}%
                </span>
                {/* View Module Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModuleClick();
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
                >
                  View Module
                </button>
                {/* Collapsible Toggle */}
                <CollapsibleTrigger asChild>
                  <motion.button
                    className="p-2 hover:bg-gray-700/50 rounded-md transition-colors duration-200"
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  </motion.button>
                </CollapsibleTrigger>
              </div>
            </div>
            <motion.div
              className="w-full bg-gray-800 rounded-full h-3 mt-4"
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
          </CardHeader>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                  height: { duration: 0.4 },
                  opacity: { duration: 0.3 },
                }}
                style={{ overflow: "hidden" }}
              >
                <CollapsibleContent>
                  <CardContent className="pt-0 px-6 pb-6">
                    {module.topics && module.topics.length > 0 ? (
                      <motion.div
                        className="space-y-4 border-t border-green-500/10 pt-6"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >                        {module.topics.map((topic, topicIndex) => {
                          const isTopicCompleted = getTopicCompletion(
                            module.id,
                            topic.id
                          );
                          return (
                            <TopicItem
                              key={topic.id}
                              topic={topic}
                              isCompleted={isTopicCompleted}
                              index={topicIndex}
                              moduleId={module.id}
                            />
                          );
                        })}
                      </motion.div>
                    ) : (
                      <p className="text-gray-400 text-base text-center py-8">
                        No topics available for this module
                      </p>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Collapsible>
      </Card>
    </motion.div>
  );
}
