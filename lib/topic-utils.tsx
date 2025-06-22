import { FileText, Code, Play } from "lucide-react";
import { ReactElement } from "react";

// Get icon based on topic type
export const getTopicIcon = (type: string): ReactElement => {
  switch (type) {
    case "theory":
      return <FileText className="h-4 w-4" />;
    case "exercise":
      return <Code className="h-4 w-4" />;
    case "project":
      return <Play className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

export const getTopicTypeStyle = (type: string): string => {
  switch (type) {
    case "theory":
      return "bg-blue-500/20 text-blue-300";
    case "exercise":
      return "bg-yellow-500/20 text-yellow-300";
    case "project":
      return "bg-purple-500/20 text-purple-300";
    default:
      return "bg-gray-500/20 text-gray-300";
  }
};
