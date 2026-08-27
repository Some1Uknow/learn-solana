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
      return "bg-white/10 text-zinc-200";
    case "exercise":
      return "bg-[#a9ff2f]/15 text-[#d9ff9e]";
    case "project":
      return "bg-[#a9ff2f]/25 text-[#e8ffc8]";
    default:
      return "bg-gray-500/20 text-gray-300";
  }
};
