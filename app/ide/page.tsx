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
  Trash2,
  Github,
  FolderInput,
  Upload,
  Beaker,
  Copy,
  AlertTriangle,
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { FileExplorer } from "@/components/ide/file-explorer";
import { FileSystemNode, Project } from "@/types/file-system";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [editorCode, setEditorCode] = useState<string>("");
  const [currentFile, setCurrentFile] = useState<FileSystemNode | null>(null);
  const [fileContents, setFileContents] = useState<Record<string, string>>({
    'src/lib.rs': '// Write your Solana program here',
    'client/client.ts': '// Client code here',
    'tests/anchor.test.ts': '// Test code here'
  });
  const [userMessages, setUserMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([
    {
      role: "assistant",
      content:
        "Hi! I'm your SageIDE assistant. How can I help you build your project today?",
    },
  ]);
  const [currentInput, setCurrentInput] = useState("");
  const [activeTab, setActiveTab] = useState("explorer");
  const [projects, setProjects] = useState<Project[]>([
    {
      name: "My Project",
      root: {
        id: "root",
        name: "My Project",
        type: "directory",
        children: [
          {
            id: "src",
            name: "src",
            type: "directory",
            children: [
              {
                id: "lib",
                name: "lib.rs",
                type: "file",
                content: "// Write your Solana program here"
              }
            ]
          },
          {
            id: "client",
            name: "client",
            type: "directory",
            children: [
              {
                id: "client-file",
                name: "client.ts",
                type: "file",
                content: "// Client code here"
              }
            ]
          },
          {
            id: "tests",
            name: "tests",
            type: "directory",
            children: [
              {
                id: "anchor-test",
                name: "anchor.test.ts",
                type: "file",
                content: "// Test code here"
              }
            ]
          }
        ]
      }
    }
  ]);
  const [selectedProject, setSelectedProject] = useState<string>("My Project");

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

  // File system operations
  const createFile = (parentId: string, name: string) => {
    setProjects(currentProjects => {
      const newProjects = [...currentProjects];
      const project = newProjects.find(p => p.name === selectedProject);
      if (!project) return currentProjects;

      const findAndUpdateParent = (node: FileSystemNode): boolean => {
        if (node.id === parentId && node.type === 'directory') {
          const newFile: FileSystemNode = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            type: 'file',
            content: '',
            parentId: node.id
          };
          node.children = node.children || [];
          node.children.push(newFile);
          return true;
        }
        if (node.children) {
          return node.children.some(findAndUpdateParent);
        }
        return false;
      };

      findAndUpdateParent(project.root);
      return newProjects;
    });
  };

  const createDirectory = (parentId: string, name: string) => {
    setProjects(currentProjects => {
      const newProjects = [...currentProjects];
      const project = newProjects.find(p => p.name === selectedProject);
      if (!project) return currentProjects;

      const findAndUpdateParent = (node: FileSystemNode): boolean => {
        if (node.id === parentId && node.type === 'directory') {
          const newDir: FileSystemNode = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            type: 'directory',
            children: [],
            parentId: node.id
          };
          node.children = node.children || [];
          node.children.push(newDir);
          return true;
        }
        if (node.children) {
          return node.children.some(findAndUpdateParent);
        }
        return false;
      };

      findAndUpdateParent(project.root);
      return newProjects;
    });
  };

  const deleteNode = (nodeId: string) => {
    setProjects(currentProjects => {
      const newProjects = [...currentProjects];
      const project = newProjects.find(p => p.name === selectedProject);
      if (!project) return currentProjects;

      const findAndDeleteNode = (parent: FileSystemNode): boolean => {
        if (parent.children) {
          const index = parent.children.findIndex(child => child.id === nodeId);
          if (index !== -1) {
            parent.children.splice(index, 1);
            return true;
          }
          return parent.children.some(findAndDeleteNode);
        }
        return false;
      };

      findAndDeleteNode(project.root);
      return newProjects;
    });

    if (currentFile?.id === nodeId) {
      setCurrentFile(null);
      setEditorCode("");
    }
  };

  const openFile = (node: FileSystemNode) => {
    if (node.type === 'file') {
      // Save current file content before switching
      if (currentFile) {
        setFileContents(prev => ({
          ...prev,
          [getFullPath(currentFile)]: editorCode
        }));
      }
      
      // Set the new current file
      setCurrentFile(node);
      
      // Load content from fileContents or use default content
      const fullPath = getFullPath(node);
      setEditorCode(fileContents[fullPath] ?? node.content ?? '');
    }
  };

  // Add a function to save file content
  const saveFileContent = (fileId: string, content: string) => {
    setFileContents(prev => ({
      ...prev,
      [fileId]: content
    }));
  };

  const saveCurrentFile = () => {
    if (!currentFile) return;
    const fullPath = getFullPath(currentFile);
    setFileContents(prev => ({
      ...prev,
      [fullPath]: editorCode
    }));
  };

  // Effect to save file content when switching tabs or closing
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentFile) {
        const fullPath = getFullPath(currentFile);
        setFileContents(prev => ({
          ...prev,
          [fullPath]: editorCode
        }));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [currentFile, editorCode]);

  // Add debounced auto-save
  useEffect(() => {
    if (!currentFile) return;

    const timeoutId = setTimeout(() => {
      const fullPath = getFullPath(currentFile);
      setFileContents(prev => ({
        ...prev,
        [fullPath]: editorCode
      }));
    }, 1000); // 1 second debounce

    return () => clearTimeout(timeoutId);
  }, [editorCode, currentFile]);

  // Sidebar renderer function
  const renderSidebar = () => {
    switch (activeTab) {
      case "explorer":
        const currentProject = projects.find(p => p.name === selectedProject);
        return (
          <div className="flex flex-col h-full">
            {/* Project Actions */}
            <div className="p-4 border-b border-white/10">
              <Button variant="outline" className="w-full mb-2 text-[#14F195] border-[#14F195]/30 hover:bg-[#14F195]/10">
                <FileCode className="h-4 w-4 mr-2" />
                New Project
              </Button>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.name} value={project.name}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Project Options */}
            <div className="p-4 border-b border-white/10 flex flex-wrap gap-2">
              <Button variant="ghost" size="sm" className="h-7">
                <Settings className="h-3 w-3 mr-1" />
                Rename
              </Button>
              <Button variant="ghost" size="sm" className="h-7 text-red-400 hover:text-red-300">
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>

            {/* File Explorer */}
            <div className="flex-1 overflow-auto p-4">
              {currentProject && (
                <FileExplorer
                  node={currentProject.root}
                  onFileOpen={openFile}
                  onCreateFile={createFile}
                  onCreateFolder={createDirectory}
                  onDelete={deleteNode}
                  currentFileId={currentFile?.id}
                />
              )}
            </div>
          </div>
        );
      case "build":
        return (
          <div className="flex flex-col h-full">
            {/* Build Button */}
            <div className="p-4">
              <Button 
                className="w-full bg-[#14F195] hover:bg-[#14F195]/80 text-black border-none h-10"
              >
                Build
              </Button>
            </div>

            {/* Program ID Section */}
            <ProgramSection />

            {/* Program Binary Section */}
            <Collapsible className="border-t border-white/10">
              <CollapsibleTrigger className="w-full p-4 flex items-center justify-between text-white/70 hover:bg-white/5">
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2 transition-transform duration-200 data-[state=open]:rotate-90" />
                  Program binary
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <p className="text-sm text-white/60 mb-3">
                  Import your program and deploy without failure.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
                >
                  Import
                </Button>
              </CollapsibleContent>
            </Collapsible>

            {/* IDL Section */}
            <Collapsible className="border-t border-white/10">
              <CollapsibleTrigger className="w-full p-4 flex items-center justify-between text-white/70 hover:bg-white/5">
                <div className="flex items-center">
                  <ChevronRight className="h-4 w-4 mr-2 transition-transform duration-200 data-[state=open]:rotate-90" />
                  IDL
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4">
                <p className="text-sm text-white/60 mb-3">
                  Anchor IDL interactions.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-8 border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
                >
                  Import
                </Button>
              </CollapsibleContent>
            </Collapsible>
          </div>
        );
      case "test":
        return (
          <div className="flex flex-col h-full">
            {/* Test Configuration */}
            <div className="p-4 border-b border-white/10">
              <h3 className="text-sm font-medium text-white/70 mb-3">Test Configuration</h3>
              <Select defaultValue="all">
                <SelectTrigger className="bg-white/5 border-white/10 mb-2">
                  <SelectValue placeholder="Select test scope" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tests</SelectItem>
                  <SelectItem value="unit">Unit Tests</SelectItem>
                  <SelectItem value="integration">Integration Tests</SelectItem>
                  <SelectItem value="e2e">E2E Tests</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full mb-2 text-white/70 border-white/10 hover:bg-white/5">
                <Settings className="h-4 w-4 mr-2" />
                Test Settings
              </Button>
            </div>

            {/* Test Actions */}
            <div className="p-4 border-b border-white/10">
              <h3 className="text-sm font-medium text-white/70 mb-3">Test Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start text-[#14F195] border-[#14F195]/30 hover:bg-[#14F195]/10">
                  <Play className="h-4 w-4 mr-2" />
                  Run All Tests
                </Button>
                <Button variant="outline" className="w-full justify-start text-white/70 border-white/10 hover:bg-white/5">
                  <Code className="h-4 w-4 mr-2" />
                  Run Current File Tests
                </Button>
                <Button variant="outline" className="w-full justify-start text-white/70 border-white/10 hover:bg-white/5">
                  <Terminal className="h-4 w-4 mr-2" />
                  Debug Test
                </Button>
              </div>
            </div>

            {/* Test Coverage */}
            <div className="p-4 border-b border-white/10">
              <h3 className="text-sm font-medium text-white/70 mb-3">Coverage</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-white/70">Overall</span>
                    <span className="text-sm text-[#14F195]">85%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#14F195] rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-white/70">Functions</span>
                    <span className="text-sm text-[#14F195]">92%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#14F195] rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-white/70">Branches</span>
                    <span className="text-sm text-[#14F195]">78%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#14F195] rounded-full" style={{ width: '78%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Test Runs */}
            <div className="p-4 flex-1 overflow-auto">
              <h3 className="text-sm font-medium text-white/70 mb-3">Recent Test Runs</h3>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/70">All Tests</span>
                    <div className="flex items-center">
                      <span className="text-xs text-[#14F195] mr-2">42/45 passed</span>
                      <span className="text-xs text-white/50">2min ago</span>
                    </div>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#14F195] rounded-full" style={{ width: '93%' }} />
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/70">Unit Tests</span>
                    <div className="flex items-center">
                      <span className="text-xs text-[#14F195] mr-2">28/28 passed</span>
                      <span className="text-xs text-white/50">15min ago</span>
                    </div>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-[#14F195] rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-white/70">Integration Tests</span>
                    <div className="flex items-center">
                      <span className="text-xs text-red-400 mr-2">14/17 passed</span>
                      <span className="text-xs text-white/50">1hr ago</span>
                    </div>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-red-400 rounded-full" style={{ width: '82%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Template modal section replacement
  const TemplateDialog = () => (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="bg-black/80 backdrop-blur-md border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium mb-2">Template Gallery</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {SAMPLE_FUNCTIONS.map((template, index) => (
            <button
              key={index}
              className="w-full text-left p-2 hover:bg-white/10 rounded-md transition-colors"
              onClick={() => {
                setSelectedTemplate(template.name);
                setDialogOpen(false);
              }}
            >
              <p className="text-sm font-medium">{template.name}</p>
              <p className="text-xs text-white/60">{template.description}</p>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );

  // Program ID section replacement using Collapsible
  const ProgramSection = () => (
    <Collapsible className="border-t border-white/10">
      <CollapsibleTrigger className="w-full p-4 flex items-center justify-between text-white/70 hover:bg-white/5">
        <div className="flex items-center">
          <ChevronRight className="h-4 w-4 mr-2 transition-transform duration-200 data-[state=open]:rotate-90" />
          Program ID
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-4">
        <p className="text-sm text-white/60 mb-3">
          Import/export program keypair or input a public key for the program.
        </p>
        <div className="flex gap-2 mb-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
          >
            New
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 border-white/10 text-white/70 hover:bg-white/5 hover:text-white"
          >
            Import
          </Button>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/60">Program ID:</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Your program's public key"
              className="w-full bg-black/20 border border-white/10 rounded-md p-2 text-sm text-white/80 focus:border-[#14F195]/50 focus:ring-1 focus:ring-[#14F195]/50 outline-none"
            />
            <Button 
              variant="ghost" 
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-white/40 hover:text-[#14F195] hover:bg-[#14F195]/10"
              aria-label="Copy program ID"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-start gap-2 mt-3 p-3 bg-[#14F195]/5 rounded-md border border-[#14F195]/20">
            <AlertTriangle className="h-4 w-4 text-[#14F195] mt-0.5" />
            <p className="text-xs text-white/70">
              Note that you need to have this program's authority to upgrade
            </p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );

  // Replace fileContents state with this function to get full path
  const getFullPath = (node: FileSystemNode | null): string => {
    if (!node) return '';
    const getParentPath = (currentNode: FileSystemNode, path: string = ''): string => {
      const project = projects.find(p => p.name === selectedProject);
      if (!project) return path;

      const findParent = (parentNode: FileSystemNode): FileSystemNode | null => {
        if (parentNode.children?.some(child => child.id === currentNode.id)) {
          return parentNode;
        }
        for (const child of parentNode.children || []) {
          const found = findParent(child);
          if (found) return found;
        }
        return null;
      };

      const parent = findParent(project.root);
      if (!parent || parent.id === project.root.id) {
        return `${currentNode.name}${path}`;
      }
      return getParentPath(parent, `/${currentNode.name}${path}`);
    };

    return getParentPath(node);
  };

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
              SageIDE
              <div className="h-2 w-2 rounded-full bg-[#14F195] animate-pulse" />
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Button
                variant="outline"
                className="border-white/10 text-white/80 hover:text-white"
                onClick={() => setDialogOpen(true)}
              >
                <FileCode className="h-4 w-4 mr-2" />
                Templates
              </Button>
              <TemplateDialog />
            </div>
            <Button
              variant="outline"
              className="border-white/10 text-white/80 hover:text-white"
              onClick={saveCurrentFile}
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

      {/* Main IDE Area with activity bar and panels */}
      <div className="flex-1 flex overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-black/40 flex flex-col items-center py-4 space-y-6 border-r border-white/10">
          <button 
            className={`p-2 rounded-lg transition-colors ${activeTab === "explorer" ? "bg-[#14F195]/20 text-[#14F195]" : "text-white/60 hover:text-white/80 hover:bg-white/10"}`}
            onClick={() => { setActiveTab("explorer"); setSidebarCollapsed(false); }}
            aria-label="File explorer"
          >
            <FileCode className="h-5 w-5" />
          </button>
          <button 
            className={`p-2 rounded-lg transition-colors ${activeTab === "build" ? "bg-[#14F195]/20 text-[#14F195]" : "text-white/60 hover:text-white/80 hover:bg-white/10"}`}
            onClick={() => { setActiveTab("build"); setSidebarCollapsed(false); }}
            aria-label="Build settings"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button 
            className={`p-2 rounded-lg transition-colors ${activeTab === "test" ? "bg-[#14F195]/20 text-[#14F195]" : "text-white/60 hover:text-white/80 hover:bg-white/10"}`}
            onClick={() => { setActiveTab("test"); setSidebarCollapsed(false); }}
            aria-label="Test settings"
          >
            <Beaker className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Panel */}
        <div
          className={`${
            sidebarCollapsed ? "w-0" : "w-72"
          } transition-all duration-300 relative bg-black/20 border-r border-white/10`}
        >
          <button
            className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-[#14F195] rounded-full p-1 z-10"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-3 w-3 text-black" />
            ) : (
              <ChevronLeft className="h-3 w-3 text-black" />
            )}
          </button>

          {!sidebarCollapsed && (
            <div className="h-full">
              {renderSidebar()}
            </div>
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
                      className="data-[state=active]:bg-white/10 data-[state=active]:shadow-none rounded-none border-b-2 border-transparent data-[state=active]:border-[#14F195] h-10 flex items-center gap-2"
                    >
                      <Code className="h-4 w-4" />
                      {currentFile ? (
                        <div className="flex flex-col items-start">
                          <span className="text-sm">{currentFile.name}</span>
                          <span className="text-[10px] text-white/50">{getFullPath(currentFile)}</span>
                        </div>
                      ) : (
                        'Code'
                      )}
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
                      <CodeEditor 
                        code={editorCode} 
                        onChange={(value) => setEditorCode(value)}
                      />
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
