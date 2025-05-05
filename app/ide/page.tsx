"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Play,
  Save,
  RefreshCw,
  Download,
  Code,
  Terminal,
  Settings,
  FileCode,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeEditor from "@/components/ide/code-editor";
import OutputWindow from "@/components/ide/output-window";
import { Textarea } from "@/components/ui/textarea";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { contractSchema } from "../api/contract-generator/schema";
import { ScrollArea } from "@/components/ui/scroll-area";
import Markdown from "react-markdown";

const SAMPLE_FUNCTIONS = [
  {
    name: "Hello World",
    description: "A simple program that prints a message",
  },
  { name: "Token Mint", description: "Create and mint a new SPL token" },
  {
    name: "Counter Program",
    description: "Simple program to increment/decrement a counter",
  },
  { name: "NFT Mint", description: "Mint an NFT using the Metaplex standard" },
];

export default function IDEPage() {
  const [output, setOutput] = useState<string>("");
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [currentTab, setCurrentTab] = useState("code");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editorCode, setEditorCode] = useState<string>("");
  const [userMessages, setUserMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Hi! I'm your Solana smart contract assistant. How can I help you build your project today?",
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");

  // Use the AI SDK's useObject hook for contract generation
  const { object, submit, isLoading } = useObject({
    api: "/api/contract-generator",
    schema: contractSchema,
  });

  // Update messages and code when object updates
  useEffect(() => {
    console.log("Building program...");
    console.log("Compiling program...");
    console.log("Deploying to localnet...");
    console.log("Program deployed successfully!");
    console.log(
      "Transaction signature: 5KmWoS9vJJRuBRdiNZmn4ytq9G4DSRdL8kZVdJ1uKSHCZLgGZ4XcaDgCz7KSDTaMbdQHTwkmHGG5PCQbgSwFbLAN"
    );

    console.log("Building for deployment...");
    console.log("Compiling program for deployment...");
    console.log("Deploying to devnet...");
    console.log("This may take a few minutes...");
    console.log("Program deployed to devnet successfully!");
    console.log("Program ID: BvtE4MNNpJ9Nv8QzsQQcBTnf8ZkVk9SXM8voznzvW4Ed");
    console.log(
      "Transaction signature: 41AVCdwFfdjDxKiv2AeRRxhLfEpNYJhCHMUrBHDGvYRBCPBfCFGR5mMewZjHnXyZk5XrFQP2CiDP7Vj8VPcaLw4q"
    );

    const notification = object?.notification;
    const followUp = notification?.followUp;

    // Only add the message if we have a followUp and it's a non-empty string
    if (followUp && typeof followUp === "string" && followUp.trim() !== "") {
      // Check if message is not already in the chat history or is not a partial version
      // of the last message (to prevent duplicates)
      setUserMessages((prevMessages) => {
        const lastMessage = prevMessages[prevMessages.length - 1];

        // If the last message is from the assistant and the new follow-up
        // is not identical and not just a longer version of the last message
        if (
          lastMessage?.role !== "assistant" ||
          !followUp.includes(lastMessage.content)
        ) {
          return [...prevMessages, { role: "assistant", content: followUp }];
        }

        // If the new message is a more complete version of the last message, replace it
        if (
          lastMessage.role === "assistant" &&
          followUp.includes(lastMessage.content) &&
          followUp.length > lastMessage.content.length
        ) {
          const updatedMessages = [...prevMessages];
          updatedMessages[updatedMessages.length - 1] = {
            role: "assistant",
            content: followUp,
          };
          return updatedMessages;
        }

        return prevMessages;
      });
    }

    // Only update the code if codeChanged is true
    if (notification?.codeChanged && notification?.code) {
      setEditorCode(notification.code);
    }
    
    console.log("OBJECT", object);
  }, [object]);

  // Handle chat submission
  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentInput.trim()) return;

    // Add user message to the chat
    const newUserMessage = {
      role: "user" as const,
      content: currentInput,
    };

    setUserMessages((prev) => [...prev, newUserMessage]);

    // Submit to AI with the current context
    submit({
      messages: [...userMessages, newUserMessage],
    });

    // Clear the input
    setCurrentInput("");
  };

  // Refs for resizable elements
  const horizontalResizeRef = useRef<HTMLDivElement>(null);
  const verticalResizeRef = useRef<HTMLDivElement>(null);
  const aiSectionRef = useRef<HTMLDivElement>(null);
  const codeSectionRef = useRef<HTMLDivElement>(null);
  const outputSectionRef = useRef<HTMLDivElement>(null);

  // State for dragging
  const [horizontalDragging, setHorizontalDragging] = useState(false);
  const [verticalDragging, setVerticalDragging] = useState(false);
  const [aiWidth, setAiWidth] = useState(30); // percentage
  const [outputHeight, setOutputHeight] = useState(30); // percentage

  const handleRunCode = () => {
    setIsRunning(true);
    setOutput(""); // Clear previous output

    // Simulate code execution
    setTimeout(() => {
      setOutput(
        "Building program...\nCompiling program...\nDeploying to localnet...\nProgram deployed successfully!\nTransaction signature: 5KmWoS9vJJRuBRdiNZmn4ytq9G4DSRdL8kZVdJ1uKSHCZLgGZ4XcaDgCz7KSDTaMbdQHTwkmHGG5PCQbgSwFbLAN"
      );
      setIsRunning(false);
    }, 2000);
  };

  const deployToDevnet = () => {
    setIsRunning(true);
    setOutput(""); // Clear previous output

    // Simulate deployment
    setTimeout(() => {
      setOutput(
        "Building for deployment...\nCompiling program for deployment...\nDeploying to devnet...\nThis may take a few minutes...\nProgram deployed to devnet successfully!\nProgram ID: BvtE4MNNpJ9Nv8QzsQQcBTnf8ZkVk9SXM8voznzvW4Ed\nTransaction signature: 41AVCdwFfdjDxKiv2AeRRxhLfEpNYJhCHMUrBHDGvYRBCPBfCFGR5mMewZjHnXyZk5XrFQP2CiDP7Vj8VPcaLw4q"
      );
      setIsRunning(false);
    }, 5000);
  };

  // Horizontal resize handler for AI and Code sections
  useEffect(() => {
    const handleHorizontalMouseMove = (e: MouseEvent) => {
      if (!horizontalDragging) return;

      const container = document.querySelector(
        ".main-content-container"
      ) as HTMLElement;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const mouseX = e.clientX - container.getBoundingClientRect().left;
      let newWidth = (mouseX / containerWidth) * 100;

      // Limit minimum and maximum sizes
      newWidth = Math.max(20, Math.min(80, newWidth));
      setAiWidth(newWidth);
    };

    const handleHorizontalMouseUp = () => {
      setHorizontalDragging(false);
    };

    if (horizontalDragging) {
      document.addEventListener("mousemove", handleHorizontalMouseMove);
      document.addEventListener("mouseup", handleHorizontalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleHorizontalMouseMove);
      document.removeEventListener("mouseup", handleHorizontalMouseUp);
    };
  }, [horizontalDragging]);

  // Vertical resize handler for Code and Output sections
  useEffect(() => {
    const handleVerticalMouseMove = (e: MouseEvent) => {
      if (!verticalDragging) return;

      const codeContainer = document.querySelector(
        ".code-output-container"
      ) as HTMLElement;
      if (!codeContainer) return;

      const containerHeight = codeContainer.clientHeight;
      const mouseY = e.clientY - codeContainer.getBoundingClientRect().top;
      let newHeight = (mouseY / containerHeight) * 100;

      // Limit minimum and maximum sizes
      newHeight = Math.max(20, Math.min(80, newHeight));
      setOutputHeight(100 - newHeight);
    };

    const handleVerticalMouseUp = () => {
      setVerticalDragging(false);
    };

    if (verticalDragging) {
      document.addEventListener("mousemove", handleVerticalMouseMove);
      document.addEventListener("mouseup", handleVerticalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleVerticalMouseMove);
      document.removeEventListener("mouseup", handleVerticalMouseUp);
    };
  }, [verticalDragging]);

  return (
    <div className="h-screen bg-[#0c0c10] text-white flex flex-col overflow-hidden">
      {/* Gradient background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[50%] h-[70%] bg-[#14F195]/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[60%] bg-[#9945FF]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[40%] bg-[#00C2FF]/20 blur-[120px] rounded-full" />
      </div>

      {/* Header Bar */}
      <header className="border-b border-white/10 p-4 relative z-10">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Home</span>
            </Link>
            <h1 className="text-xl font-bold font-space-grotesk flex items-center gap-2">
              Solana AI Smart Contract IDE
              <div className="h-2 w-2 rounded-full bg-[#14F195] animate-pulse" />
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="outline"
                className="border-white/10 text-white/80 hover:text-white"
                onClick={() => setShowTemplateModal(!showTemplateModal)}
              >
                <FileCode className="h-4 w-4 mr-2" />
                Templates
              </Button>

              {showTemplateModal && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg shadow-lg p-4 z-50">
                  <h3 className="text-sm font-medium mb-2">Template Gallery</h3>
                  <div className="space-y-2">
                    {SAMPLE_FUNCTIONS.map((template, index) => (
                      <button
                        key={index}
                        className="w-full text-left p-2 hover:bg-white/10 rounded-md transition-colors"
                        onClick={() => {
                          setSelectedTemplate(template.name);
                          setShowTemplateModal(false);
                        }}
                      >
                        <p className="text-sm font-medium">{template.name}</p>
                        <p className="text-xs text-white/60">
                          {template.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Button
              variant="outline"
              className="border-white/10 text-white/80 hover:text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button
              variant={isRunning ? "outline" : "default"}
              className={
                isRunning
                  ? "border-white/10 text-white/50"
                  : "bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black"
              }
              onClick={handleRunCode}
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="border-white/10 text-white/80 hover:text-white"
              onClick={() => document.getElementById("settings-tab")?.click()}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Main IDE Area with collapsible sidebar */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Collapsible File Explorer - Left Side */}
        <div
          className={`border-r border-white/10 bg-black/20 ${
            sidebarCollapsed ? "w-10" : "w-52"
          } 
                    transition-all duration-300 md:flex flex-col relative`}
        >
          <button
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-[#14F195] rounded-full p-1 z-10"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-3 w-3 text-black" />
            ) : (
              <ChevronLeft className="h-3 w-3 text-black" />
            )}
          </button>

          {sidebarCollapsed ? (
            <div className="flex flex-col items-center py-4 space-y-6">
              <Code className="h-5 w-5 text-[#14F195]" />
              <FileCode className="h-5 w-5 text-white/60" />
              <Settings className="h-5 w-5 text-white/60" />
            </div>
          ) : (
            <>
              <h2 className="text-sm font-medium mb-3 p-4 pb-0">
                Project Files
              </h2>
              <div className="space-y-1 px-4">
                <div className="flex items-center px-2 py-1 bg-white/10 rounded-md">
                  <Code className="h-4 w-4 mr-2 text-[#14F195]" />
                  <span className="text-sm">main.rs</span>
                </div>
                <div className="flex items-center px-2 py-1 hover:bg-white/5 rounded-md cursor-pointer">
                  <Code className="h-4 w-4 mr-2 text-white/60" />
                  <span className="text-sm text-white/80">lib.rs</span>
                </div>
                <div className="flex items-center px-2 py-1 hover:bg-white/5 rounded-md cursor-pointer">
                  <Code className="h-4 w-4 mr-2 text-white/60" />
                  <span className="text-sm text-white/80">error.rs</span>
                </div>
                <div className="flex items-center px-2 py-1 hover:bg-white/5 rounded-md cursor-pointer">
                  <Code className="h-4 w-4 mr-2 text-white/60" />
                  <span className="text-sm text-white/80">types.rs</span>
                </div>
              </div>

              <div className="mt-6 px-4">
                <h2 className="text-sm font-medium mb-3">Project Settings</h2>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-white/70 block">
                      Solana Cluster
                    </label>
                    <Select defaultValue="localnet">
                      <SelectTrigger className="bg-white/5 border-white/10 h-8 text-xs">
                        <SelectValue placeholder="Select cluster" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="localnet">Localnet</SelectItem>
                        <SelectItem value="devnet">Devnet</SelectItem>
                        <SelectItem value="testnet">Testnet</SelectItem>
                        <SelectItem value="mainnet">Mainnet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs text-white/70 block">
                      Anchor Version
                    </label>
                    <Select defaultValue="0.29.0">
                      <SelectTrigger className="bg-white/5 border-white/10 h-8 text-xs">
                        <SelectValue placeholder="Select version" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.29.0">0.29.0</SelectItem>
                        <SelectItem value="0.28.0">0.28.0</SelectItem>
                        <SelectItem value="0.27.0">0.27.0</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-white/10 text-white/80 hover:text-white h-8"
                    onClick={deployToDevnet}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Deploy to Devnet
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Main content area with AI chat and code editor */}
        <div className="flex-1 flex flex-row overflow-hidden main-content-container">
          {/* AI Chat Section */}
          <div
            ref={aiSectionRef}
            className="h-full border-r border-white/10 flex flex-col bg-black/20 overflow-hidden"
            style={{ width: `${aiWidth}%` }}
          >
            <div className="border-b border-white/10 p-2 bg-black/30 flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center">
                <MessageSquare className="h-4 w-4 mr-2 text-[#14F195]" />
                AI Assistant
              </h3>
            </div>

            <ScrollArea className="flex-1 w-full">
              <div className="p-3 space-y-4">
                {userMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-[#9945FF]/20 rounded-tr-none"
                          : "bg-[#14F195]/10 rounded-tl-none"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">
                        <Markdown>{message.content}</Markdown>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="border-t border-white/10 p-3 bg-black/30">
              <form
                onSubmit={handleChatSubmit}
                className="flex items-center space-x-2"
              >
                <Textarea
                  placeholder="Ask the AI assistant about Solana development..."
                  className="min-h-[60px] resize-none bg-black/30 border-white/10"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleChatSubmit(e);
                    }
                  }}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-8 w-8 bg-[#14F195] hover:bg-[#14F195]/80 text-black"
                  disabled={isLoading || !currentInput.trim()}
                >
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Vertical Resize Handle */}
          <div
            ref={horizontalResizeRef}
            className="w-1 bg-white/5 hover:bg-[#14F195]/50 cursor-col-resize transition-colors"
            onMouseDown={() => setHorizontalDragging(true)}
          />

          {/* Code Editor and Output Section */}
          <div
            ref={codeSectionRef}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {/* Tab navigation */}
            <Tabs
              defaultValue="code"
              className="flex-1 flex flex-col"
              onValueChange={setCurrentTab}
            >
              <div className="border-b border-white/10 bg-black/40">
                <div className="container mx-auto px-4">
                  <TabsList className="bg-transparent border-b-0 h-10">
                    <TabsTrigger
                      value="code"
                      className="data-[state=active]:bg-white/10 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-[#14F195] h-10"
                    >
                      <Code className="h-4 w-4 mr-2" />
                      Code
                    </TabsTrigger>
                    <TabsTrigger
                      value="terminal"
                      className="data-[state=active]:bg-white/10 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-[#14F195] h-10"
                    >
                      <Terminal className="h-4 w-4 mr-2" />
                      Terminal
                    </TabsTrigger>
                    <TabsTrigger
                      id="settings-tab"
                      value="settings"
                      className="data-[state=active]:bg-white/10 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-[#14F195] h-10"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </TabsTrigger>
                  </TabsList>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                <TabsContent
                  value="code"
                  className="flex-1 flex flex-col p-0 mt-0 h-full"
                >
                  <div className="flex-1 flex flex-col overflow-hidden code-output-container">
                    {/* Code editor */}
                    <div
                      className="flex-1 overflow-hidden"
                      style={{ height: `${100 - outputHeight}%` }}
                    >
                      <CodeEditor code={editorCode} />
                    </div>

                    {/* Horizontal Resize Handle */}
                    <div
                      ref={verticalResizeRef}
                      className="h-1 bg-white/5 hover:bg-[#14F195]/50 cursor-row-resize transition-colors"
                      onMouseDown={() => setVerticalDragging(true)}
                    />

                    {/* Output */}
                    <div
                      ref={outputSectionRef}
                      className="border-t border-white/10 flex flex-col overflow-hidden"
                      style={{ height: `${outputHeight}%` }}
                    >
                      <div className="flex justify-between items-center p-3 border-b border-white/10 bg-black/20">
                        <h3 className="text-sm font-medium">Output</h3>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-xs text-white/70 hover:text-white"
                          onClick={() => setOutput("")}
                        >
                          Clear
                        </Button>
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <OutputWindow output={output} />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent
                  value="terminal"
                  className="flex-1 p-0 mt-0 h-full"
                >
                  <div className="h-full bg-black p-4 font-mono text-sm">
                    <p className="text-[#14F195]">$ solana --version</p>
                    <p className="text-white/80 mb-2">
                      solana-cli 1.16.10 (src:devbuild; feat:2916671234)
                    </p>
                    <p className="text-[#14F195]">$ anchor --version</p>
                    <p className="text-white/80 mb-2">anchor-cli 0.29.0</p>
                    <p className="text-[#14F195]">$ solana config get</p>
                    <p className="text-white/80">
                      Config File: /home/user/.config/solana/cli/config.yml
                    </p>
                    <p className="text-white/80">
                      RPC URL: http://localhost:8899
                    </p>
                    <p className="text-white/80">
                      WebSocket URL: ws://localhost:8900
                    </p>
                    <p className="text-white/80">
                      Keypair Path: /home/user/.config/solana/id.json
                    </p>
                    <p className="text-white/80 mb-2">Commitment: confirmed</p>
                    <p className="text-white/50 animate-pulse">►</p>
                  </div>
                </TabsContent>

                <TabsContent
                  value="settings"
                  className="flex-1 p-4 mt-0 overflow-auto"
                >
                  <h2 className="text-xl font-medium mb-4">IDE Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Editor</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-sm text-white/70">Theme</label>
                          <Select defaultValue="dark">
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dark">Dark</SelectItem>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="solana">
                                Solana Theme
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm text-white/70">
                            Font Size
                          </label>
                          <Select defaultValue="14">
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select font size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="12">12px</SelectItem>
                              <SelectItem value="14">14px</SelectItem>
                              <SelectItem value="16">16px</SelectItem>
                              <SelectItem value="18">18px</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Compiler</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-sm text-white/70">
                            Rust Edition
                          </label>
                          <Select defaultValue="2021">
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select Rust edition" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2018">Rust 2018</SelectItem>
                              <SelectItem value="2021">Rust 2021</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm text-white/70">
                            Optimization Level
                          </label>
                          <Select defaultValue="default">
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select optimization level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="debug">Debug</SelectItem>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="release">Release</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">AI Assistant</h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-sm text-white/70">
                            AI Model
                          </label>
                          <Select defaultValue="gpt-4">
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select AI model" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="gpt-4">
                                GPT-4 (Advanced)
                              </SelectItem>
                              <SelectItem value="gpt-3.5">
                                GPT-3.5 (Fast)
                              </SelectItem>
                              <SelectItem value="code-llama">
                                CodeLlama (Local)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-sm text-white/70">
                            Context Window
                          </label>
                          <Select defaultValue="large">
                            <SelectTrigger className="bg-white/5 border-white/10">
                              <SelectValue placeholder="Select context size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">
                                Small (4K tokens)
                              </SelectItem>
                              <SelectItem value="medium">
                                Medium (8K tokens)
                              </SelectItem>
                              <SelectItem value="large">
                                Large (16K tokens)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Mobile bottom action bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/60 backdrop-blur-md border-t border-white/10 p-3">
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-white/80 h-9"
          >
            <FileCode className="h-4 w-4 mr-1" />
            Files
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black h-9"
            onClick={handleRunCode}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-1" />
                Run Code
              </>
            )}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 text-white/80 h-9"
          >
            <MessageSquare className="h-4 w-4 mr-1" />
            AI Chat
          </Button>
        </div>
      </div>
    </div>
  );
}
