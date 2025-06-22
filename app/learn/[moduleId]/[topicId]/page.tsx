"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  PlayCircle,
  FileCode,
  BookOpen,
  Cpu,
  ChevronLeft,
  ChevronRight,
  Mic,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface Topic {
  id: string;
  title: string;
  description: string;
  type: "theory" | "exercise" | "project";
}

interface Module {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  topics: Topic[];
}

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  const topicId = params.topicId as string;  const [module, setModule] = useState<Module | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load the contents data
        const response = await fetch("/data/contents-data.json");
        const data = await response.json();

        // Find the module by ID
        const foundModule = data.modules.find((m: Module) => m.id === moduleId);
        setModule(foundModule || null);        // Find the topic within the module
        if (foundModule) {
          const foundTopic = foundModule.topics.find((t: Topic) => t.id === topicId);
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
    // Rust modules (part-1, part-2) - Copper/Orange theme
    if (moduleId === "part-1" || moduleId === "part-2") {
      return {
        gradientStyle: {
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(249, 115, 22, 0.25), transparent 70%), #000000",
        },
        containerClass: "min-h-screen w-full relative bg-black",
      };
    }

    // Anchor modules (part-4, part-5) - Light Blue theme
    if (moduleId === "part-4" || moduleId === "part-5") {
      return {
        gradientStyle: {
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(56, 189, 248, 0.25), transparent 70%), #000000",
        },
        containerClass: "min-h-screen w-full relative bg-black",
      };
    }

    // Default Solana theme (part-0, part-3, and others) - Indigo theme
    return {
      gradientStyle: {
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99, 102, 241, 0.25), transparent 70%), #000000",
      },
      containerClass: "min-h-screen w-full relative bg-black",
    };
  };

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
  const markTopicComplete = () => {
    if (!topic) return;

    // Navigate back to module page
    router.push(`/learn/${moduleId}`);
  };

  const getCurrentTopicIndex = () => {
    if (!module || !topic) return -1;
    return module.topics.findIndex(t => t.id === topic.id);
  };

  const getNavigationInfo = () => {
    if (!module) return { prev: null, next: null };
    
    const currentIndex = getCurrentTopicIndex();
    const prev = currentIndex > 0 ? module.topics[currentIndex - 1] : null;
    const next = currentIndex < module.topics.length - 1 ? module.topics[currentIndex + 1] : null;
    
    return { prev, next };
  };
  const isCompleted = false; // Will be connected to database later
  const backgroundTheme = getBackgroundTheme(moduleId);
  const { prev, next } = getNavigationInfo();

  if (loading) {
    return (
      <div className={backgroundTheme.containerClass}>
        <div
          className="absolute inset-0 z-0"
          style={backgroundTheme.gradientStyle}
        />
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-white">Loading topic...</div>
        </div>
      </div>
    );
  }

  if (!module || !topic) {
    return (
      <div className={backgroundTheme.containerClass}>
        <div
          className="absolute inset-0 z-0"
          style={backgroundTheme.gradientStyle}
        />
        <div className="min-h-screen flex items-center justify-center relative z-10">
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
        </div>
      </div>
    );
  }
  return (
    <SidebarProvider defaultOpen={false}>
      <div className={backgroundTheme.containerClass}>
        {/* Dynamic Background based on module type */}
        <div
          className="absolute inset-0 z-0"
          style={backgroundTheme.gradientStyle}
        />

        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Back Button */}
          <div className="mb-8">
            <Link href={`/learn/${moduleId}`}>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 mb-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {module.title}
              </Button>
            </Link>
          </div>

          {/* Main Content Box */}
          <div className="bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl shadow-black/20 p-8 mb-8">
            {/* Header Section */}
            <div className="border-b border-white/10 pb-6 mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className={`p-3 rounded-xl ${getTypeColor(topic.type)} shadow-lg`}>
                  {getTopicIcon(topic.type)}
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="outline" className={`${getTypeColor(topic.type)} border-0 shadow-sm`}>
                    {topic.type}
                  </Badge>
                  {isCompleted && (
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  )}
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

            {/* Content Section */}
            <div className="text-white/90 space-y-6">
              <p className="text-lg leading-relaxed">
                This is dummy content for the topic "{topic.title}". In a real application, 
                this would contain the actual learning material such as:
              </p>
              
              {topic.type === "theory" && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-semibold text-white">Theory Content</h3>
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
                  <h3 className="text-2xl font-semibold text-white">Exercise Instructions</h3>
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
                  <h3 className="text-2xl font-semibold text-white">Project Requirements</h3>
                  <ul className="list-disc list-inside space-y-3 text-lg ml-4">
                    <li>Project overview and objectives</li>
                    <li>Technical requirements and specifications</li>
                    <li>Resource files and assets</li>
                    <li>Submission guidelines and evaluation criteria</li>
                  </ul>
                </div>
              )}
              
              <div className="mt-8 p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                <p className="text-white/70 leading-relaxed">
                  💡 This is placeholder content. Real implementation would include 
                  interactive elements, code editors, video content, and more.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Navigation - Outside the main box */}
          <div className="flex flex-col space-y-6 mb-8">
            {/* Topic Navigation */}
            <div className="flex justify-between items-center">
              {prev ? (
                <Link href={`/learn/${moduleId}/${prev.id}`}>
                  <Button variant="outline" className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm bg-white/5">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    {prev.title}
                  </Button>
                </Link>
              ) : (
                <div></div>
              )}

              {next ? (
                <Link href={`/learn/${moduleId}/${next.id}`}>
                  <Button variant="outline" className="text-white border-white/30 hover:bg-white/10 backdrop-blur-sm bg-white/5">
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
                className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 text-lg font-semibold shadow-lg shadow-green-600/25 backdrop-blur-sm"
                size="lg"
              >
                <CheckCircle2 className="mr-3 h-6 w-6" />
                Mark Topic Complete
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Mic Button */}
        <SidebarTrigger className="fixed right-8 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm p-3 rounded-full shadow-lg z-40">
          <Mic className="h-5 w-5" />
        </SidebarTrigger>

        {/* Voice Assistant Sidebar */}
        <Sidebar 
          side="right" 
          variant="floating" 
          collapsible="offcanvas"
          className="z-50"
        >
          <div className="h-full bg-gradient-to-br from-white/15 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/20 rounded-l-2xl">
            <SidebarHeader className="border-b border-white/10 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Voice Assistant</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-white/60">Ready</span>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-6">
              <div className="text-white/80 space-y-6">
                <p className="text-lg">Voice assistant features coming soon...</p>
                
                <div className="space-y-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center space-x-3 mb-2">
                      <Mic className="h-5 w-5 text-blue-400" />
                      <h4 className="font-semibold text-white">Voice Commands</h4>
                    </div>
                    <p className="text-sm text-white/70">Ask questions about the topic</p>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center space-x-3 mb-2">
                      <BookOpen className="h-5 w-5 text-purple-400" />
                      <h4 className="font-semibold text-white">AI Assistance</h4>
                    </div>
                    <p className="text-sm text-white/70">Get explanations and help</p>
                  </div>
                  
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center space-x-3 mb-2">
                      <FileCode className="h-5 w-5 text-green-400" />
                      <h4 className="font-semibold text-white">Voice Notes</h4>
                    </div>
                    <p className="text-sm text-white/70">Record your thoughts</p>
                  </div>
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-white/10">
                  <p className="text-sm text-white/60 text-center">
                    Try saying: "Explain this topic" or "What comes next?"
                  </p>
                </div>
              </div>
            </SidebarContent>
          </div>
        </Sidebar>
      </div>
    </SidebarProvider>
  );
}
