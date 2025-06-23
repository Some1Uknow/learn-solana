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
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

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
  const moduleId = params.moduleId as string;
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModuleData = async () => {
      try {
        // Load the contents data
        const response = await fetch("/data/contents-data.json");
        const data = await response.json(); // Find the module by ID
        const foundModule = data.modules.find((m: Module) => m.id === moduleId);
        setModule(foundModule || null);
      } catch (error) {
        console.error("Error loading module data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchModuleData();
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

  if (loading) {
    return (
      <div className="bg-black min-h-screen relative overflow-hidden">
        <ShootingStars className="z-0" />
        <StarsBackground className="z-0" />
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-white">Loading module...</div>
        </div>
      </div>
    );
  }
  if (!module) {
    return (
      <div className="bg-black min-h-screen relative overflow-hidden">
        <ShootingStars className="z-0" />
        <StarsBackground className="z-0" />
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
  }
  const progressPercentage = 0; // Will be calculated from database later

  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <ShootingStars className="z-0" />
      <StarsBackground className="z-0" />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          {" "}
          <Link href="/learn">
            <Button
              variant="ghost"
              className="bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white/10 hover:border-white/20 mb-6"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Learning
            </Button>
          </Link>{" "}
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl p-6">
            <div className="flex items-start space-x-6">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
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
                    <Progress value={progressPercentage} className="w-32 h-2" />{" "}
                    <span className="text-white/80 text-sm">
                      0/{module.topics.length} completed
                    </span>
                  </div>{" "}
                  <Badge
                    variant="secondary"
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white"
                  >
                    {module.topics.length} topics
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Topics Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {" "}
          {module.topics.map((topic, index) => {
            const isCompleted = false; // Will be connected to database later
            const isAccessible = true; // All topics accessible for now, will add progression logic later

            return (
              <Card
                key={topic.id}
                className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl cursor-pointer ${
                  !isAccessible ? "opacity-60 cursor-not-allowed" : ""
                }`}
                onClick={() => isAccessible && navigateToTopic(topic.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    {" "}
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                        {getTopicIcon(topic.type)}
                      </div>
                      <div>
                        <Badge
                          variant="outline"
                          className="bg-white/10 backdrop-blur-sm border-white/20 text-white"
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
                    </div>{" "}
                    {!isAccessible && (
                      <Badge
                        variant="destructive"
                        className="bg-red-500/20 backdrop-blur-sm border border-red-400/30 text-red-200 text-xs"
                      >
                        Locked
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>{" "}
        {/* Navigation */}
        <div className="mt-12 flex justify-between">
          <Button
            variant="outline"
            className="bg-white/5 backdrop-blur-md border border-white/20 text-white hover:bg-white/10 hover:border-white/30"
          >
            Previous Module
          </Button>
          <Button className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/15 hover:border-white/30">
            Next Module
          </Button>
        </div>
      </div>
    </div>
  );
}