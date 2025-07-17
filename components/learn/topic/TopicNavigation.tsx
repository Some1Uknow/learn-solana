import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Topic } from "@/types/learning";

interface TopicNavigationProps {
  moduleId: string;
  prev: Topic | null;
  next: Topic | null;
  markTopicComplete: () => void;
}

export default function TopicNavigation({ moduleId, prev, next, markTopicComplete }: TopicNavigationProps) {
  return (
    <div className="flex flex-col space-y-6 mb-8">
      {/* Topic Navigation */}
      <div className="flex justify-between items-center">
        {prev ? (
          <Link href={`/learn/${moduleId}/${prev.id}`}>
            <Button
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10 backdrop-blur-xs bg-white/5"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {prev.title}
            </Button>
          </Link>
        ) : (
          <div></div>
        )}

        {next ? (
          <Link href={`/learn/${moduleId}/${next.id}`}>
            <Button
              variant="outline"
              className="text-white border-white/30 hover:bg-white/10 backdrop-blur-xs bg-white/5"
            >
              {next.title}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <div></div>
        )}
      </div>

      {/* Complete Topic Button */}
      <div className="text-center">
        <Button
          onClick={markTopicComplete}
          className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 text-lg font-semibold shadow-lg shadow-green-600/25 backdrop-blur-xs"
          size="lg"
        >
          <CheckCircle2 className="mr-3 h-6 w-6" />
          Mark Topic Complete
        </Button>
      </div>
    </div>
  );
}
