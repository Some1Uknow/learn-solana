import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Cpu,
  FileCode,
  PlayCircle,
} from "lucide-react";
import { Topic } from "@/types/learning";

interface TopicHeaderProps {
  topic: Topic;
  isCompleted: boolean;
}

const getTopicIcon = (type: string) => {
  switch (type) {
    case "theory":
      return <BookOpen className="h-6 w-6" />;
    case "exercise":
      return <Cpu className="h-6 w-6" />;
    case "project":
      return <FileCode className="h-6 w-6" />;
    default:
      return <PlayCircle className="h-6 w-6" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "theory":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "exercise":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "project":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
  }
};

export default function TopicHeader({ topic, isCompleted }: TopicHeaderProps) {
  return (
    <div className="border-b border-white/10 pb-6 mb-8">
      <div className="flex items-center space-x-4 mb-4">
        <div className={`p-3 rounded-xl ${getTypeColor(topic.type)} shadow-lg`}>
          {getTopicIcon(topic.type)}
        </div>
        <div className="flex items-center space-x-3">
          <Badge
            variant="outline"
            className={`${getTypeColor(topic.type)} border-0 shadow-sm`}
          >
            {topic.type}
          </Badge>
          {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-400" />}
        </div>
      </div>

      <h1 className="text-4xl font-bold text-white mb-3 leading-tight">
        {topic.title}
      </h1>
      <p className="text-white/80 text-xl leading-relaxed mb-4">
        {topic.description}
      </p>
      <div className="flex items-center space-x-4 text-white/60">
        <Clock className="h-4 w-4" />
        <span>~15 min</span>
      </div>
    </div>
  );
}
