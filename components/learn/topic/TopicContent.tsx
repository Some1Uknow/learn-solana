import { Topic } from "@/types/learning";

interface TopicContentProps {
  topic: Topic;
}

export default function TopicContent({ topic }: TopicContentProps) {
  return (
    <div className="text-white/90 space-y-6">
      <p className="text-lg leading-relaxed">
        This is dummy content for the topic "{topic.title}". In a real
        application, this would contain the actual learning material
        such as:
      </p>

      {topic.type === "theory" && (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-white">
            Theory Content
          </h3>
          <ul className="list-disc list-inside space-y-3 text-lg ml-4">
            <li>Detailed explanations and concepts</li>
            <li>Code examples and demonstrations</li>
            <li>Visual diagrams and illustrations</li>
            <li>Key takeaways and summary points</li>
          </ul>
        </div>
      )}

      {topic.type === "exercise" && (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-white">
            Exercise Instructions
          </h3>
          <ul className="list-disc list-inside space-y-3 text-lg ml-4">
            <li>Step-by-step instructions</li>
            <li>Code templates and starter files</li>
            <li>Expected outcomes and validation</li>
            <li>Hints and troubleshooting tips</li>
          </ul>
        </div>
      )}

      {topic.type === "project" && (
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-white">
            Project Requirements
          </h3>
          <ul className="list-disc list-inside space-y-3 text-lg ml-4">
            <li>Project overview and objectives</li>
            <li>Technical requirements and specifications</li>
            <li>Resource files and assets</li>
            <li>Submission guidelines and evaluation criteria</li>
          </ul>
        </div>
      )}

      <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xs">
        <p className="text-white/70 leading-relaxed">
          💡 This is placeholder content. Real implementation would
          include interactive elements, code editors, video content, and
          more.
        </p>
      </div>
    </div>
  );
}
