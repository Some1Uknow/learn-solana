"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Filter, Search, CheckCircle2, Clock, LockIcon, PlayCircle, FileCode, Cpu, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "locked";
  type: "video" | "interactive" | "exercise" | "quiz";
  duration: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

interface RoadmapSection {
  id: string;
  title: string;
  description: string;
  completed: number;
  total: number;
  items: RoadmapItem[];
}

export default function RoadmapPage() {
  // Track user progress (in a real app, this would come from a database)
  const [progress, setProgress] = useState(25);
  const [selectedTrack, setSelectedTrack] = useState("all");
  const [expandedSection, setExpandedSection] = useState<string>("section-1");
  const [searchQuery, setSearchQuery] = useState("");

  const roadmapData: RoadmapSection[] = [
    {
      id: "section-1",
      title: "Solana Fundamentals",
      description: "Learn the core concepts of Solana blockchain",
      completed: 2,
      total: 5,
      items: [
        {
          id: "item-1-1",
          title: "Introduction to Solana",
          description: "Overview of Solana architecture and unique features",
          status: "completed",
          type: "video",
          duration: "10 min",
          difficulty: "beginner",
        },
        {
          id: "item-1-2",
          title: "Accounts, Programs, and Transactions",
          description: "Understanding the account model and program execution",
          status: "completed",
          type: "interactive",
          duration: "15 min",
          difficulty: "beginner",
        },
        {
          id: "item-1-3",
          title: "Setting Up Your Development Environment",
          description: "Install and configure the Solana CLI and development tools",
          status: "in-progress",
          type: "exercise",
          duration: "20 min",
          difficulty: "beginner",
        },
        {
          id: "item-1-4",
          title: "Your First Solana Transaction",
          description: "Create and submit a transaction on Solana devnet",
          status: "locked",
          type: "interactive",
          duration: "25 min",
          difficulty: "beginner",
        },
        {
          id: "item-1-5",
          title: "Understanding SOL and SPL Tokens",
          description: "Overview of Solana's native token and token standard",
          status: "locked",
          type: "quiz",
          duration: "15 min",
          difficulty: "beginner",
        },
      ],
    },
    {
      id: "section-2",
      title: "Rust Programming",
      description: "Master Rust for Solana development",
      completed: 0,
      total: 5,
      items: [
        {
          id: "item-2-1",
          title: "Rust Fundamentals for Solana",
          description: "Learn the essential Rust concepts for Solana development",
          status: "locked",
          type: "video",
          duration: "30 min",
          difficulty: "intermediate",
        },
        {
          id: "item-2-2",
          title: "Ownership and Borrowing",
          description: "Master Rust's ownership system and memory management",
          status: "locked",
          type: "interactive",
          duration: "25 min",
          difficulty: "intermediate",
        },
        {
          id: "item-2-3",
          title: "Structs, Enums, and Pattern Matching",
          description: "Work with Rust's type system and data structures",
          status: "locked",
          type: "exercise",
          duration: "30 min",
          difficulty: "intermediate",
        },
        {
          id: "item-2-4",
          title: "Error Handling in Rust",
          description: "Learn how to handle errors effectively in Rust programs",
          status: "locked",
          type: "interactive",
          duration: "20 min",
          difficulty: "intermediate",
        },
        {
          id: "item-2-5",
          title: "Testing Rust Code",
          description: "Write and run tests for your Rust programs",
          status: "locked",
          type: "quiz",
          duration: "15 min",
          difficulty: "intermediate",
        },
      ],
    },
    {
      id: "section-3",
      title: "Anchor Framework",
      description: "Build Solana programs with the Anchor framework",
      completed: 0,
      total: 3,
      items: [
        {
          id: "item-3-1",
          title: "Introduction to Anchor",
          description: "Overview of the Anchor framework and its benefits",
          status: "locked",
          type: "video",
          duration: "20 min",
          difficulty: "intermediate",
        },
        {
          id: "item-3-2",
          title: "Building Your First Anchor Program",
          description: "Create, build, and deploy a simple Anchor program",
          status: "locked",
          type: "interactive",
          duration: "45 min",
          difficulty: "intermediate",
        },
        {
          id: "item-3-3",
          title: "Advanced Anchor Concepts",
          description: "Program Derived Addresses, Cross-Program Invocation, and more",
          status: "locked",
          type: "exercise",
          duration: "40 min",
          difficulty: "advanced",
        },
      ],
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-[#14F195]" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-[#9945FF]" />;
      case "locked":
        return <LockIcon className="h-4 w-4 text-white/40" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <PlayCircle className="h-4 w-4 text-[#14F195]" />;
      case "interactive":
        return <Cpu className="h-4 w-4 text-[#9945FF]" />;
      case "exercise":
        return <FileCode className="h-4 w-4 text-[#00C2FF]" />;
      case "quiz":
        return <Wallet className="h-4 w-4 text-[#FFD700]" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/20 text-green-500";
      case "intermediate":
        return "bg-blue-500/20 text-blue-500";
      case "advanced":
        return "bg-purple-500/20 text-purple-500";
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0c10] text-white">
      {/* Gradient background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[50%] h-[70%] bg-[#14F195]/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[60%] bg-[#9945FF]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[40%] bg-[#00C2FF]/20 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 p-4 sticky top-0 bg-[#0c0c10] z-20">
        <div className="container mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold font-space-grotesk">
              Solana Developer Roadmap
            </h1>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input 
                placeholder="Search modules..." 
                className="pl-8 bg-white/5 border-white/10 w-full" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-white/10 text-white/80 hover:bg-white/5">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </header>

      {/* Progress indicator */}
      <div className="sticky top-[73px] bg-[#0c0c10]/80 backdrop-blur-sm border-b border-white/10 p-4 z-10">
        <div className="container mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black font-medium text-lg">
              {progress}%
            </div>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">Your progress</span>
                <span className="text-sm font-medium text-[#14F195]">{progress}% complete</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/10" indicatorclassname="bg-gradient-to-r from-[#14F195] to-[#9945FF]" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto p-4 pb-20">
        {/* Track selection tabs */}
        <Tabs defaultValue="all" className="mt-4" onValueChange={setSelectedTrack}>
          <TabsList className="bg-black/30 border border-white/10 w-full justify-start">
            <TabsTrigger value="all">All Tracks</TabsTrigger>
            <TabsTrigger value="solana">Solana</TabsTrigger>
            <TabsTrigger value="rust">Rust</TabsTrigger>
            <TabsTrigger value="anchor">Anchor</TabsTrigger>
            <TabsTrigger value="frontend">Frontend</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Timeline View */}
        <div className="mt-8 space-y-6">
          {roadmapData
            .filter(section => selectedTrack === "all" || section.title.toLowerCase().includes(selectedTrack.toLowerCase()))
            .map((section) => (
              <div key={section.id} className="border border-white/10 rounded-lg overflow-hidden bg-black/30 backdrop-blur-sm">
                {/* Section header */}
                <button
                  className="w-full flex items-center justify-between p-5 hover:bg-white/5 transition-colors"
                  onClick={() => setExpandedSection(expandedSection === section.id ? "" : section.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black font-medium">
                      {section.completed}/{section.total}
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold">{section.title}</h3>
                      <p className="text-sm text-white/70">{section.description}</p>
                    </div>
                  </div>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center border border-white/20 transition-transform ${
                    expandedSection === section.id ? "rotate-180" : ""
                  }`}>
                    <ArrowLeft className="h-4 w-4 text-white/50 rotate-[-90deg]" />
                  </div>
                </button>

                {/* Section content */}
                {expandedSection === section.id && (
                  <div className="p-5 border-t border-white/10 space-y-4">
                    {section.items
                      .filter(item => 
                        searchQuery === "" || 
                        item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        item.description.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((item) => (
                        <div
                          key={item.id}
                          className={`flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg ${
                            item.status === "locked" ? "bg-white/5 opacity-70" : "bg-white/10"
                          }`}
                        >
                          <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                            {getStatusIcon(item.status)}
                          </div>
                          <div className="flex-grow">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <h4 className="font-medium">{item.title}</h4>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="outline" className="px-2 py-0 text-xs flex items-center gap-1 border-white/20">
                                  {getTypeIcon(item.type)} {item.type}
                                </Badge>
                                <Badge className={`px-2 py-0 text-xs ${getDifficultyColor(item.difficulty)}`}>
                                  {item.difficulty}
                                </Badge>
                                <Badge variant="outline" className="px-2 py-0 text-xs border-white/20 text-white/70">
                                  {item.duration}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-white/70 mt-1">{item.description}</p>
                          </div>
                          <Button
                            className={
                              item.status === "locked"
                                ? "hidden sm:flex sm:flex-shrink-0 bg-white/10 text-white/50"
                                : "sm:flex-shrink-0 bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black"
                            }
                            size="sm"
                            disabled={item.status === "locked"}
                          >
                            {item.status === "completed" ? "Review" : item.status === "in-progress" ? "Continue" : "Start"}
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ))}
        </div>
      </main>

      {/* Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md border-t border-white/10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <p className="text-sm text-white/70">Next up: <span className="text-white font-medium">Setting Up Your Development Environment</span></p>
          </div>
          <Button className="bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black">
            Continue Learning
          </Button>
        </div>
      </div>
    </div>
  );
}