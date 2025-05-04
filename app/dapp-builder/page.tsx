"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Code,
  Check,
  Download,
  Github,
  RefreshCw,
  Maximize2,
  ChevronRight,
  PanelLeft,
  MessageSquare,
  Send,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import CodeEditor from "@/components/ide/code-editor";

export default function DappBuilderPage() {
  const [contractType, setContractType] = useState("");
  const [contractName, setContractName] = useState("");
  const [frontendFramework, setFrontendFramework] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [currentView, setCurrentView] = useState<"code" | "preview">("code");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeChat, setActiveChat] = useState("general");
  const [chatMessages, setChatMessages] = useState<{
    [key: string]: { role: string; content: string; timestamp: Date }[];
  }>({
    general: [
      {
        role: "assistant",
        content:
          "Welcome to the Solana dApp Builder! I'll help you build your dApp. What type of project would you like to create?",
        timestamp: new Date(),
      },
    ],
    contract: [
      {
        role: "assistant",
        content:
          "This is your smart contract assistant. I can help with writing Solana programs using Anchor framework. What would you like to build?",
        timestamp: new Date(),
      },
    ],
    ui: [
      {
        role: "assistant",
        content:
          "I'm your UI assistant. I can help with React components, styling, and frontend integration with Solana. What do you need help with?",
        timestamp: new Date(),
      },
    ],
  });
  const [currentMessage, setCurrentMessage] = useState("");
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when new messages come in
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, activeChat]);

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    // Add user message to chat
    setChatMessages((prev) => ({
      ...prev,
      [activeChat]: [
        ...prev[activeChat],
        { role: "user", content: currentMessage, timestamp: new Date() },
      ],
    }));

    // Clear input
    setCurrentMessage("");

    // Simulate AI response
    setTimeout(() => {
      let responseMessage = "";

      if (activeChat === "general") {
        if (
          currentMessage.toLowerCase().includes("token") ||
          currentMessage.toLowerCase().includes("spl")
        ) {
          responseMessage =
            "Creating an SPL token is a great choice! You'll need to configure token parameters like name, symbol, and decimals. Would you like me to help you set up the basic structure?";
          setContractType("token");
        } else if (
          currentMessage.toLowerCase().includes("nft") ||
          currentMessage.toLowerCase().includes("collection")
        ) {
          responseMessage =
            "NFT collections are popular on Solana! You'll need to set up metadata standards and minting functionality. Let's configure your collection parameters.";
          setContractType("nft");
        } else if (currentMessage.toLowerCase().includes("marketplace")) {
          responseMessage =
            "Building a marketplace will require listing, bidding, and escrow functionality. I'll help you structure this properly for Solana's architecture.";
          setContractType("marketplace");
        } else {
          responseMessage =
            "I understand you want to build a Solana dApp. To get started, please select a contract type from the configuration panel. Would you like a token, NFT collection, marketplace, or something custom?";
        }
      } else if (activeChat === "contract") {
        responseMessage =
          "I'll help you with the smart contract code. Solana programs use the Anchor framework for safer development. What functionality would you like to implement in your contract?";
      } else if (activeChat === "ui") {
        responseMessage =
          "For the UI, we can use React with tailwind for styling. This will give you a modern interface that integrates well with Solana wallet adapters. Would you like to see some component examples?";
        setFrontendFramework("react");
      }

      handleAIResponse(responseMessage);
    }, 1000);
  };

  const handleAIResponse = (message: string, chatType: string = activeChat) => {
    setChatMessages((prev) => ({
      ...prev,
      [chatType]: [
        ...prev[chatType],
        { role: "assistant", content: message, timestamp: new Date() },
      ],
    }));
  };

  // Sample UI for app preview
  const AppPreview = () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-black/10 to-transparent rounded-lg border border-white/10 p-6">
      <div className="w-full max-w-md bg-black/50 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {contractName || "My Solana App"}
          </h2>
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
          </div>
        </div>

        <div className="mb-4 p-3 bg-white/5 rounded-lg">
          <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2 mb-2">
            <span className="text-white/60">Connection</span>
            <span className="text-[#14F195]">Connected</span>
          </div>
          <div className="text-white/80 text-xs truncate">
            <span className="text-white/50 mr-1">Wallet:</span>
            5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CerVrDCKWbN...
          </div>
        </div>

        <Button className="w-full bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black font-medium">
          Connect Wallet
        </Button>
      </div>
    </div>
  );

  // Sidebar projects
  const projects = [
    { name: "Token Project", color: "#14F195" },
    { name: "NFT Collection", color: "#9945FF" },
    { name: "Marketplace", color: "#00C2FF" },
    { name: "DAO Governance", color: "#F99D07" },
  ];

  // Chat tabs for different assistants
  const chatTabs = [
    {
      id: "general",
      label: "General",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: "contract",
      label: "Contract",
      icon: <Code className="w-4 h-4" />,
    },
    {
      id: "ui",
      label: "UI/UX",
      icon: <RefreshCw className="w-4 h-4" />,
    },
  ];

  return (
    <div className="h-screen bg-[#0c0c10] text-white flex">
      {/* Gradient background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[50%] h-[70%] bg-[#14F195]/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[60%] bg-[#9945FF]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[40%] bg-[#00C2FF]/20 blur-[120px] rounded-full" />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 bottom-0 left-0 h-full ${
          sidebarCollapsed ? "w-[60px]" : "w-[240px]"
        } bg-black/40 border-r border-white/10 flex flex-col z-20 transition-all duration-300`}
      >
        <div className="p-4 flex items-center justify-between border-b border-white/10">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded bg-gradient-to-r from-[#9945FF] to-[#14F195] flex items-center justify-center">
                <Code className="h-5 w-5 text-black" />
              </div>
              <span className="font-bold text-lg">Projects</span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="h-8 w-8 rounded bg-gradient-to-r from-[#9945FF] to-[#14F195] flex items-center justify-center mx-auto">
              <Code className="h-5 w-5 text-black" />
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <PanelLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {projects.map((project, index) => (
              <TooltipProvider key={index} delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-white/90 hover:text-white ${
                        sidebarCollapsed ? "px-0 justify-center" : ""
                      }`}
                    >
                      <span
                        className={`flex h-2 w-2 rounded-full`}
                        style={{ backgroundColor: project.color }}
                      ></span>
                      {!sidebarCollapsed && (
                        <span className="ml-2 truncate">{project.name}</span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  {sidebarCollapsed && (
                    <TooltipContent side="right">{project.name}</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </ScrollArea>

        {!sidebarCollapsed && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback className="bg-white/10 text-white/80">
                  US
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">User</p>
                <p className="text-xs text-white/60 truncate">
                  user@example.com
                </p>
              </div>
              <Button variant="ghost" size="icon" className="text-white/70">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 flex ${
          sidebarCollapsed ? "ml-[60px]" : "ml-[240px]"
        } transition-all duration-300`}
      >
        {/* Chat Section - Left Column */}
        <div className="w-1/3 border-r border-white/10 flex flex-col">
          {/* Chat Header */}
          <div className="border-b border-white/10 p-4 flex items-center justify-between">
            <h2 className="font-medium text-lg flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              AI Assistant
            </h2>
            <Tabs
              value={activeChat}
              onValueChange={setActiveChat}
              className="w-auto"
            >
              <TabsList className="bg-black/30 border border-white/10 h-8">
                {chatTabs.map((tab) => (
                  <TabsTrigger
                    key={tab.id}
                    value={tab.id}
                    className="text-xs h-8 px-3 data-[state=active]:bg-white/10"
                  >
                    {tab.icon}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Chat Messages */}
          <ScrollArea className="flex-1 p-4" ref={chatScrollRef}>
            <div className="space-y-4">
              {chatMessages[activeChat].map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.role === "assistant" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      msg.role === "assistant"
                        ? "bg-white/10 text-white"
                        : "bg-gradient-to-r from-[#14F195]/90 to-[#9945FF]/90 text-black"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    {/* <p className="text-xs opacity-70 mt-1">
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p> */}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Chat Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Ask AI assistant..."
                className="bg-white/5 border-white/10"
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button
                variant="ghost"
                size="icon"
                className="bg-white/10 hover:bg-white/20 text-white"
                onClick={handleSendMessage}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Workspace - Right Column */}
        <div className="flex-1 flex flex-col h-screen">
          {/* Main Header */}
          <header className="h-14 border-b border-white/10 p-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold">
              {contractName || "New Solana Project"}
            </h1>
            <div className="flex items-center gap-3">
              <Tabs
                value={currentView}
                onValueChange={(v) => setCurrentView(v as any)}
                className="mr-4"
              >
                <TabsList className="bg-black/30 border border-white/10">
                  <TabsTrigger
                    value="code"
                    className="data-[state=active]:bg-white/10"
                  >
                    Code
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="data-[state=active]:bg-white/10"
                  >
                    Preview
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white/10 hover:bg-white/5 text-white/80 h-8"
                >
                  <Github className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border-white/10 hover:bg-white/5 text-white/80 h-8"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  className="bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black hover:opacity-90 h-8"
                  size="sm"
                >
                  Deploy
                </Button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden h-full">
            <Tabs value={currentView} className="h-full">
              {/* Code View */}
              <TabsContent value="code" className="h-full w-full">
                <CodeEditor code={""} />
              </TabsContent>

              {/* Preview View */}
              <TabsContent value="preview" className="h-full">
                <div className="h-full">
                  <AppPreview />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
