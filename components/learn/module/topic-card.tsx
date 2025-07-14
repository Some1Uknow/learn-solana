import {
  CheckCircle2,
  Clock,
  PlayCircle,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Topic, Module } from "./types";

interface TopicCardProps {
  topic: Topic;
  module: Module;
  index: number;
  isCompleted?: boolean;
  isAccessible?: boolean;
  onTopicClick: (topicId: string) => void;
  topicHasMdxContent: (topicId: string) => boolean;
}

export const TopicCard = ({
  topic,
  module,
  index,
  isCompleted = false,
  isAccessible = true,
  onTopicClick,
  topicHasMdxContent,
}: TopicCardProps) => {
  return (
    <Card
      className={`relative bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/30 border-0 shadow-lg hover:shadow-xl transition-all duration-500 h-full overflow-hidden backdrop-blur-sm hover:scale-[1.02] cursor-pointer ${
        !isAccessible ? "opacity-60 cursor-not-allowed" : ""
      }`}
      onClick={() => isAccessible && onTopicClick(topic.id)}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
      
      <CardContent className="p-8 h-full flex flex-col">
        {/* Logo Container */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto flex items-center justify-center">
            {module.image ? (
              <img
                src={module.image}
                alt={module.title}
                className="w-full h-full object-contain"
              />
            ) : (
              <BookOpen className="w-full h-full text-gray-400 dark:text-gray-500" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {topic.title}
            {topicHasMdxContent(topic.id) && (
              <span className="ml-2 inline-block px-1.5 py-0.5 text-xs bg-blue-500/20 border border-blue-400/30 text-blue-200 rounded-full">
                MDX
              </span>
            )}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-8 flex-1">
            {topic.description}
          </p>

          {/* Status indicators */}
          <div className="mb-6 flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400 text-sm">
              <Clock className="h-4 w-4" />
              <span>~15 min</span>
            </div>
            {isCompleted && (
              <CheckCircle2 className="h-5 w-5 text-green-400" />
            )}
            {!isAccessible && (
              <Badge
                variant="destructive"
                className="bg-red-500/20 border border-red-400/30 text-red-200 text-xs"
              >
                Locked
              </Badge>
            )}
          </div>

          {/* Action button */}
          <button
            className="group/btn inline-flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all font-medium text-sm"
            onClick={(e) => {
              e.stopPropagation();
              if (isAccessible) onTopicClick(topic.id);
            }}
          >
            <span>{isCompleted ? 'Review topic' : 'Start learning'}</span>
            <PlayCircle className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};
