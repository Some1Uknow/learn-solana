"use client";

import { motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Topic } from "@/types/learning";
import { getTopicIcon, getTopicTypeStyle } from "@/lib/topic-utils";

interface TopicItemProps {
  topic: Topic;
  isCompleted: boolean;
  index: number;
  moduleId?: string;
}

export default function TopicItem({
  topic,
  isCompleted,
  index,
  moduleId,
}: TopicItemProps) {
  const router = useRouter();

  const handleTopicClick = () => {
    if (moduleId) {
      // Navigate to module page with topic hash
      router.push(`/learn/${moduleId}#${topic.id}`);
    }
  };

  return (
    <motion.div
      key={topic.id}
      className="flex items-center gap-4 p-4 rounded-lg hover:bg-green-500/5 transition-colors cursor-pointer"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05,
        ease: "easeOut",
      }}
      whileHover={{ x: 4 }}
      onClick={handleTopicClick}
    >
      <motion.div
        className="flex items-center gap-3"
        whileHover={{ scale: 1.05 }}
      >
        {isCompleted ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 + 0.2 }}
          >
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </motion.div>
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-gray-600" />
        )}
        {getTopicIcon(topic.type)}
      </motion.div>
      <div className="flex-1">
        <h4
          className={`text-base font-medium mb-1 ${
            isCompleted ? "text-white" : "text-gray-300"
          }`}
        >
          {topic.title}
        </h4>
        <p className="text-sm text-gray-500">{topic.description}</p>
      </div>
      <motion.span
        className={`text-sm px-3 py-1 rounded-full font-medium ${getTopicTypeStyle(
          topic.type
        )}`}
        whileHover={{ scale: 1.05 }}
      >
        {topic.type}
      </motion.span>
    </motion.div>
  );
}
