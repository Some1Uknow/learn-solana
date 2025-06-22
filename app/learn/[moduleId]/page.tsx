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
import { Progress } from "@/components/ui/progress";

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

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        // Load the contents data
        const response = await fetch("/data/contents-data.json");
        const data = await response.json();        // Find the module by ID
        const foundModule = data.modules.find((m: Module) => m.id === moduleId);
        setModule(foundModule || null);
      } catch (error) {
        console.error("Error loading module data:", error);
      } finally {
        setLoading(false);
      }
    };fetchModuleData();
  }, [moduleId]);

  const navigateToTopic = (topicId: string) => {
    router.push(`/learn/${moduleId}/${topicId}`);
  };

  const getTopicIcon = (type: string) => {
    switch (type) {
      case "theory":
        return <BookOpen className="h-5 w-5" />;
      case "exercise":
        return <Cpu className="h-5 w-5" />;
      case "project":
        return <FileCode className="h-5 w-5" />;
      default:
        return <PlayCircle className="h-5 w-5" />;
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

    // Solana theme (part-0, part-3, and others) - Emerald Radial Glow
    return {
      gradientStyle: {
        backgroundImage:
          "radial-gradient(circle 500px at 50% 300px, rgba(16,185,129,0.35), transparent)",
      },
      containerClass: "min-h-screen w-full bg-[#020617] relative",
    };
  };
  if (loading) {
    const backgroundTheme = getBackgroundTheme(moduleId);
    return (
      <div className={backgroundTheme.containerClass}>
        <div
          className="absolute inset-0 z-0"
          style={backgroundTheme.gradientStyle}
        />
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-white">Loading module...</div>
        </div>
      </div>
    );
  }
  if (!module) {
    const backgroundTheme = getBackgroundTheme(moduleId);
    return (
      <div className={backgroundTheme.containerClass}>
        <div
          className="absolute inset-0 z-0"
          style={backgroundTheme.gradientStyle}
        />
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-center text-white">
            <h1 className="text-2xl font-bold mb-4">Module not found</h1>
            <p className="mb-6">The module "{moduleId}" could not be found.</p>
            <Link href="/learn">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Learning
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }  const progressPercentage = 0; // Will be calculated from database later

  const backgroundTheme = getBackgroundTheme(moduleId);

  return (
    <div className={backgroundTheme.containerClass}>
      {/* Dynamic Background based on module type */}
      <div
        className="absolute inset-0 z-0"
        style={backgroundTheme.gradientStyle}
      />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          {" "}
          <Link href="/learn">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Learning
            </Button>
          </Link>
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-lg border border-purple-500/30 shadow-lg shadow-purple-500/10 p-6">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600/30 to-emerald-600/30 rounded-lg flex items-center justify-center backdrop-blur-sm border border-purple-400/20">
                {module.image ? (
                  <img
                    src={module.image}
                    alt={module.title}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <BookOpen className="h-8 w-8 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {module.title}
                </h1>
                <p className="text-white/80 text-lg mb-4">
                  {module.description}
                </p>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Progress value={progressPercentage} className="w-32 h-2" />                    <span className="text-white/80 text-sm">
                      0/{module.topics.length} completed
                    </span>
                  </div>
                  <Badge variant="secondary">
                    {module.topics.length} topics
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">        {module.topics.map((topic, index) => {
            const isCompleted = false; // Will be connected to database later
            const isAccessible = true; // All topics accessible for now, will add progression logic later

            return (<Card
                key={topic.id}
                className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-purple-500/30 transition-all duration-200 hover:from-white/15 hover:to-white/10 hover:border-purple-400/50 hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer ${
                  !isAccessible ? "opacity-60 cursor-not-allowed" : ""
                }`}
                onClick={() => isAccessible && navigateToTopic(topic.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`p-2 rounded-lg ${getTypeColor(topic.type)}`}
                      >
                        {getTopicIcon(topic.type)}
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className={getTypeColor(topic.type)}
                        >
                          {topic.type}
                        </Badge>
                      </div>
                    </div>
                    {isCompleted && (
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    )}
                  </div>
                  <CardTitle className="text-white text-lg">
                    {topic.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-white/70">
                    {topic.description}
                  </CardDescription>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-white/60 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>~15 min</span>
                    </div>

                    {!isAccessible && (
                      <Badge variant="destructive" className="text-xs">
                        Locked
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="mt-12 flex justify-between">
          <Button
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
          >
            Previous Module
          </Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Next Module
          </Button>
        </div>
      </div>
    </div>
  );
}