"use client";

import { useParams, useRouter } from "next/navigation";
import { useModuleById } from "@/hooks/use-modules-data";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import {
  LoadingState,
  ErrorState,
  NotFoundState,
  ModuleHeader,
  TopicsGrid,
  ModuleNavigation,
  type Topic,
  type Module,
} from "@/components/learn/module";

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;

  // Use custom hook for data fetching
  const { module, allModules, isLoading, error } = useModuleById(moduleId);

  const navigateToTopic = (topicId: string) => {
    router.push(`/learn/${moduleId}/${topicId}`);
  };

  // Check if a topic has MDX content available
  const topicHasMdxContent = (topicId: string) => {
    // For now, only the "why-solana" topic has MDX content
    return topicId === "why-solana";
  };

  // Navigation helpers
  const getCurrentModuleIndex = () => {
    return allModules.findIndex((m: Module) => m.id === moduleId);
  };

  const getPreviousModule = () => {
    const currentIndex = getCurrentModuleIndex();
    return currentIndex > 0 ? allModules[currentIndex - 1] : null;
  };

  const getNextModule = () => {
    const currentIndex = getCurrentModuleIndex();
    return currentIndex < allModules.length - 1 ? allModules[currentIndex + 1] : null;
  };

  const navigateToPreviousModule = () => {
    const previousModule = getPreviousModule();
    if (previousModule) {
      router.push(`/learn/${previousModule.id}`);
    }
  };

  const navigateToNextModule = () => {
    const nextModule = getNextModule();
    if (nextModule) {
      router.push(`/learn/${nextModule.id}`);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!module) {
    return <NotFoundState moduleId={moduleId} />;
  }

  const progressPercentage = 0; // Will be calculated from database later

  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <ShootingStars className="z-0" />
      <StarsBackground className="z-0" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 py-8 relative z-10 max-w-none">
        {/* Header */}
        <ModuleHeader module={module} progressPercentage={progressPercentage} />

        {/* Topics Grid */}
        <TopicsGrid
          module={module}
          onTopicClick={navigateToTopic}
          topicHasMdxContent={topicHasMdxContent}
        />

        {/* Navigation */}
        <ModuleNavigation
          previousModule={getPreviousModule()}
          nextModule={getNextModule()}
          onPreviousClick={navigateToPreviousModule}
          onNextClick={navigateToNextModule}
        />
      </div>
    </div>
  );
}
