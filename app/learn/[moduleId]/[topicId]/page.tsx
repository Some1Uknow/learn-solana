"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";

// We'll use a client component for the MDX content
import MDXContent from "./mdx-content";

interface Topic {
  id: string;
  title: string;
  description: string;
  type: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  topics: Topic[];
}

export default function TopicPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;
  const topicId = params.topicId as string;
  
  const [topic, setTopic] = useState<Topic | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [mdxContent, setMdxContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch module and topic metadata
        const response = await fetch("/data/contents-data.json");
        const data = await response.json();
        const foundModule = data.modules.find((m: Module) => m.id === moduleId);
        setModule(foundModule || null);
        
        if (foundModule) {
          const foundTopic = foundModule.topics.find((t: Topic) => t.id === topicId);
          setTopic(foundTopic || null);
        }
        
        // Try to fetch MDX content
        try {
          const mdxResponse = await fetch(`/api/mdx?moduleId=${moduleId}&topicId=${topicId}`);
          if (mdxResponse.ok) {
            const { serializedContent } = await mdxResponse.json();
            if (serializedContent) {
              setMdxContent(serializedContent);
            }
          }
        } catch (error) {
          console.error("Error loading MDX content:", error);
        }
      } catch (error) {
        console.error("Error loading topic data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [moduleId, topicId]);

  const getTopicType = (type: string) => {
    switch (type) {
      case "theory": return "Theory";
      case "exercise": return "Exercise";
      case "project": return "Project";
      default: return "Content";
    }
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

  if (loading) {
    return (
      <div className="bg-black min-h-screen relative overflow-hidden">
        <ShootingStars className="z-0" />
        <StarsBackground className="z-0" />
        <div className="min-h-screen flex items-center justify-center relative z-10">
          <div className="text-white text-xl">Loading content...</div>
        </div>
      </div>
    );
  }

  if (!topic || !module) {
    return (
      <div className="bg-black min-h-screen relative overflow-hidden">
        <ShootingStars className="z-0" />
        <StarsBackground className="z-0" />
        <div className="container mx-auto px-6 py-12 relative z-10">
          <Link href={`/learn/${moduleId}`}>
            <Button variant="outline" className="bg-white/5 backdrop-blur-md border border-white/10 text-white mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Module
            </Button>
          </Link>
          
          <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-xl p-8">
            <h1 className="text-2xl font-bold text-white mb-4">Topic not found</h1>
            <p className="text-white/80 mb-6">This topic could not be found. It may have been moved or removed.</p>
          </div>
        </div>
      </div>
    );
  }
  
  const { prev, next } = getNavigationInfo();

  return (
    <div className="bg-black min-h-screen relative overflow-hidden">
      <ShootingStars className="z-0" />
      <StarsBackground className="z-0" />
      
      <div className="container mx-auto px-6 py-12 relative z-10 max-w-4xl">
        <Link href={`/learn/${moduleId}`}>
          <Button variant="outline" className="bg-white/5 backdrop-blur-md border border-white/10 text-white mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {module.title}
          </Button>
        </Link>
        
        <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-xl p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm text-white/70 mb-1">{getTopicType(topic.type)}</div>
              <h1 className="text-3xl font-bold text-white">{topic.title}</h1>
              <p className="text-white/70 mt-2">{topic.description}</p>
            </div>
          </div>
          
          <div className="my-8 border-t border-white/10 pt-8">
            {mdxContent ? (
              <Suspense fallback={<div className="text-white/60 animate-pulse">Loading content...</div>}>
                <MDXContent source={mdxContent} />
              </Suspense>
            ) : (
              <div className="text-center py-12">
                <p className="text-white/60">This topic doesn't have detailed content yet.</p>
                <p className="text-white/60 mt-2">Check back soon for updates!</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          {prev ? (
            <Link href={`/learn/${moduleId}/${prev.id}`}>
              <Button variant="outline" className="bg-white/5 backdrop-blur-md border border-white/10 text-white">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous: {prev.title}
              </Button>
            </Link>
          ) : (
            <div></div>
          )}
          
          {next ? (
            <Link href={`/learn/${moduleId}/${next.id}`}>
              <Button className="bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/15">
                Next: {next.title}
              </Button>
            </Link>
          ) : (
            <Button className="bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/15">
              Complete Module
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
