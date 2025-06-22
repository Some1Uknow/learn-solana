"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Menu, X, Mic, Cross } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Module, Topic } from "@/types/learning";
import TopicHeader from "@/components/learn/topic/TopicHeader";
import TopicContent from "@/components/learn/topic/TopicContent";
import TopicNavigation from "@/components/learn/topic/TopicNavigation";
import TopicSidebar from "@/components/learn/topic/TopicSidebar";

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  const topicId = params.topicId as string;
  const [module, setModule] = useState<Module | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/contents-data.json");
        const data = await response.json();
        const foundModule = data.modules.find((m: Module) => m.id === moduleId);
        setModule(foundModule || null);
        if (foundModule) {
          const foundTopic = foundModule.topics.find(
            (t: Topic) => t.id === topicId
          );
          setTopic(foundTopic || null);
        }
      } catch (error) {
        console.error("Error loading topic data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [moduleId, topicId]);

  const getBackgroundTheme = (moduleId: string) => {
    if (moduleId === "part-1" || moduleId === "part-2") {
      return {
        gradientStyle: {
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249, 115, 22, 0.25), transparent 70%), #000000",
        },
        containerClass: "min-h-screen w-full relative bg-black",
      };
    }
    if (moduleId === "part-4" || moduleId === "part-5") {
      return {
        gradientStyle: {
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(56, 189, 248, 0.25), transparent 70%), #000000",
        },
        containerClass: "min-h-screen w-full relative bg-black",
      };
    }
    return {
      gradientStyle: {
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000",
      },
      containerClass: "min-h-screen w-full relative bg-black",
    };
  };

  const markTopicComplete = () => {
    if (!topic) return;
    router.push(`/learn/${moduleId}`);
  };

  const getCurrentTopicIndex = () => {
    if (!module?.topics || !topic) return -1;
    return module.topics.findIndex((t) => t.id === topic.id);
  };

  const getNavigationInfo = () => {
    if (!module?.topics) return { prev: null, next: null };

    const currentIndex = getCurrentTopicIndex();
    if (currentIndex === -1) return { prev: null, next: null };

    const prev = currentIndex > 0 ? module.topics[currentIndex - 1] : null;
    const next =
      currentIndex < module.topics.length - 1
        ? module.topics[currentIndex + 1]
        : null;

    return { prev, next };
  };

  const isCompleted = false;
  const backgroundTheme = getBackgroundTheme(moduleId);
  const { prev, next } = getNavigationInfo();
  const renderContent = () => {
    // Loading state
    if (loading) {
      return <div className="text-white">Loading topic...</div>;
    }

    // Error state - topic not found
    if (!module || !topic) {
      return (
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Topic not found</h1>
          <p className="mb-6">The requested topic could not be found.</p>
          <Link href={`/learn/${moduleId}`}>
            <Button variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Module
            </Button>
          </Link>
        </div>
      );
    }

    // Normal content state
    return (
      <>
        <Link href={`/learn/${moduleId}`} className="mb-8 inline-block">
          <Button variant="ghost" className="text-white hover:bg-white/10 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {module?.title}
          </Button>
        </Link>

        <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl shadow-black/20 p-8 mb-8">
          <TopicHeader topic={topic} isCompleted={isCompleted} />
          <TopicContent topic={topic} />
        </div>

        <TopicNavigation
          moduleId={moduleId}
          prev={prev}
          next={next}
          markTopicComplete={markTopicComplete}
        />
      </>
    );
  };
  return (
    <div className={`${backgroundTheme.containerClass} overflow-x-hidden`}>
      <div
        className="absolute inset-0 z-0"
        style={backgroundTheme.gradientStyle}
      />
      <div className="relative z-10 px-4 md:px-6 py-8 min-h-screen max-w-full overflow-x-hidden">
        <div className="relative max-w-full">
          <div className="flex flex-col lg:flex-row gap-6 max-w-full">
            <div className="flex-1 min-w-0">
              {/* min-w-0 allows flex child to shrink below content size */}
              <div className={loading || !module || !topic ? "m-auto" : ""}>
                {renderContent()}
              </div>
            </div>{" "}
            {module && module.topics && !loading && (
              <div className="lg:relative shrink-0">
                {/* Background Overlay */}
                <div
                  className={`
                    fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden
                    transition-opacity duration-300 ease-out
                    ${
                      showSidebar
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }
                  `}
                  onClick={() => setShowSidebar(false)}
                />
                {/* Sidebar */}
                <div
                  className={`
                  fixed inset-y-0 right-0 z-30 lg:static
                  transform transition-all duration-300 ease-out
                  ${
                    showSidebar
                      ? "translate-x-0 opacity-100"
                      : "translate-x-full opacity-0 lg:opacity-100 lg:translate-x-0"
                  }
                  w-[300px] max-w-[85vw]
                  ${showSidebar ? "lg:w-96" : "lg:w-0"}
                  lg:shrink-0 lg:transform-none overflow-hidden
                `}
                >
                  <div className="h-full w-full lg:h-auto lg:w-auto">
                    <TopicSidebar
                      moduleId={moduleId}
                      currentTopicId={topicId}
                      topics={module.topics}
                    />
                  </div>
                </div>{" "}
                {/* Sidebar Toggle Button */}
                <Button
                  variant="outline"
                  size="icon"
                  className={`
                    h-14 w-14 rounded-full bg-zinc-900/80 backdrop-blur-md
                    border border-white/20 shadow-xl transition-all duration-200 hover:bg-zinc-800
                    fixed top-5 z-40 sidebar-toggle-btn flex items-center justify-center
                    lg:absolute lg:top-5 lg:-left-20
                    ${
                      showSidebar
                        ? "bg-gray-800 ring-2 ring-white/30 sidebar-open"
                        : ""
                    }
                  `}
                  onClick={() => setShowSidebar(!showSidebar)}
                >
                  {" "}
                  <div className="relative h-10 w-10 flex items-center justify-center">
                    <Mic
                      className={`absolute h-10 w-10 text-white transition-all duration-300 ease-in-out ${
                        showSidebar
                          ? "opacity-0 -rotate-90 scale-0"
                          : "opacity-100 rotate-0 scale-100"
                      }`}
                    />
                    <X
                      className={`absolute h-6 w-6 text-white transition-all duration-300 ease-in-out ${
                        showSidebar
                          ? "opacity-100 rotate-0 scale-100"
                          : "opacity-0 rotate-90 scale-0"
                      }`}
                    />
                  </div>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
