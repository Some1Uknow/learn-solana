import { TopicCard } from "./topic-card";
import { Topic, Module } from "./types";

interface TopicsGridProps {
  module: Module;
  onTopicClick: (topicId: string) => void;
  topicHasMdxContent: (topicId: string) => boolean;
}

export const TopicsGrid = ({
  module,
  onTopicClick,
  topicHasMdxContent,
}: TopicsGridProps) => {
  return (
    <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 w-4/5 mx-auto">
      {module.topics.map((topic: Topic, index: number) => {
        const isCompleted = false; // Will be connected to database later
        const isAccessible = true; // All topics accessible for now, will add progression logic later

        return (
          <TopicCard
            key={topic.id}
            topic={topic}
            module={module}
            index={index}
            isCompleted={isCompleted}
            isAccessible={isAccessible}
            onTopicClick={onTopicClick}
            topicHasMdxContent={topicHasMdxContent}
          />
        );
      })}
    </div>
  );
};
