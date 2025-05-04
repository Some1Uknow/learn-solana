"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Loader2, Cpu, Code, BugPlay, BookText, 
  Plus, ChevronLeft, ChevronRight, MoreVertical, Trash2, Download, Share2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useChat } from "@ai-sdk/react";
import { Markdown } from "@/components/ui/markdown";

type ChatSession = {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
};

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}/${year}`;
};

const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = String(hours % 12 || 12).padStart(2, '0');
  return `${formattedHours}:${minutes} ${ampm}`;
};

export default function ChatPage() {
  // State setup
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([
    {
      id: "default",
      title: "New Chat",
      timestamp: new Date(),
      messages: [],
    },
  ]);
  const [currentChatId, setCurrentChatId] = useState("default");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCopying, setIsCopying] = useState(false);
  const [shouldScroll, setShouldScroll] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollTimeout = useRef<NodeJS.Timeout>();

  // Initialize chat config first
  const chatConfig = useMemo(() => ({
    api: "/api/chat",
    initialMessages: [],
    onResponse: () => {
      if (shouldScroll && messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "auto" });
      }
    }
  }), [shouldScroll]);

  // Set up Vercel AI SDK chat
  const { 
    messages: aiMessages, 
    input, 
    handleSubmit: handleAiSubmit, 
    isLoading, 
    setInput,
    handleInputChange,
  } = useChat(chatConfig);

  // Convert AI SDK messages to our custom message format
  const currentMessages = useMemo(() => 
    aiMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      role: msg.role as "user" | "assistant",
      timestamp: new Date()
    })),
    [aiMessages]
  );

  // Single scroll effect to handle all scroll cases
  useEffect(() => {
    if (!shouldScroll || !messagesEndRef.current) return;

    if (scrollTimeout.current) {
      clearTimeout(scrollTimeout.current);
    }

    scrollTimeout.current = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, 100);

    return () => {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [currentMessages, shouldScroll]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const scrollArea = document.querySelector('[role="region"]');
      if (!scrollArea) return;

      const { scrollHeight, scrollTop, clientHeight } = scrollArea;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShouldScroll(isAtBottom);
    };

    const scrollArea = document.querySelector('[role="region"]');
    scrollArea?.addEventListener('scroll', handleScroll);
    return () => scrollArea?.removeEventListener('scroll', handleScroll);
  }, []);

  // Keep chat sessions in sync with current AI messages
  useEffect(() => {
    if (currentMessages.length > 0) {
      // Get current chat
      const currentChat = chatSessions.find(c => c.id === currentChatId);
      if (!currentChat) return;

      // Check if messages have actually changed
      const messagesChanged = 
        currentChat.messages.length !== currentMessages.length ||
        currentMessages.some((msg, idx) => 
          idx >= currentChat.messages.length || 
          msg.id !== currentChat.messages[idx].id || 
          msg.content !== currentChat.messages[idx].content
        );
      
      if (!messagesChanged) return;

      // Update chat sessions
      setChatSessions(prev => {
        const updatedSessions = prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, messages: currentMessages } 
            : chat
        );
        
        // Update chat title only for new chats with their first user message
        if (currentChat.title === "New Chat" && currentMessages.length >= 2) {
          const firstUserMessage = currentMessages.find(m => m.role === "user");
          if (firstUserMessage) {
            const updatedTitle = firstUserMessage.content.slice(0, 30) + (firstUserMessage.content.length > 30 ? "..." : "");
            return updatedSessions.map(chat =>
              chat.id === currentChatId
                ? { ...chat, title: updatedTitle }
                : chat
            );
          }
        }
        
        return updatedSessions;
      });
    }
  }, [currentChatId, currentMessages]);

  const createNewChat = () => {
    const newChat: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      timestamp: new Date(),
      messages: [
        {
          id: "welcome",
          content: "👋 Hi there! I'm learn.sol AI, your Solana development assistant. Ask me anything about Solana, Rust, Anchor, or web3 development!",
          role: "assistant",
          timestamp: new Date(),
        },
      ],
    };
    setChatSessions(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    
    // Reset AI SDK chat
    window.location.reload(); // This is a simple way to reset the chat state
  };

  const switchChat = (chatId: string) => {
    const chat = chatSessions.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      // For now, just reload the page when switching chats
      // In a production app, you'd want to save chat history and restore it
      window.location.reload();
    }
  };

  const deleteChat = (chatId: string) => {
    setChatSessions(prev => prev.filter(c => c.id !== chatId));
    if (currentChatId === chatId) {
      const remainingChats = chatSessions.filter(c => c.id !== chatId);
      if (remainingChats.length > 0) {
        switchChat(remainingChats[0].id);
      } else {
        createNewChat();
      }
    }
  };

  const updateChatTitle = (content: string) => {
    setChatSessions(prev => prev.map(chat => {
      if (chat.id === currentChatId) {
        const title = content.slice(0, 30) + (content.length > 30 ? "..." : "");
        return { ...chat, title };
      }
      return chat;
    }));
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopying(true);
      setTimeout(() => setIsCopying(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleChatSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleAiSubmit(e);
    setShouldScroll(true);
  }, [input, handleAiSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit(e);
    }
  }, [handleChatSubmit]);

  const setInputAndSend = (message: string) => {
    setInput(message); // Use setInput from useChat directly
    handleAiSubmit(new Event('submit') as any);
  };

  const features = [
    {
      id: 'code-gen',
      title: 'Code Generation',
      description: 'Generate Solana code snippets',
      icon: <Code className="h-4 w-4 text-[#14F195]" />,
      bgColor: 'bg-[#14F195]/10 hover:bg-[#14F195]/20'
    },
    {
      id: 'debug',
      title: 'Error Debugging',
      description: 'Fix errors in your code',
      icon: <BugPlay className="h-4 w-4 text-[#9945FF]" />,
      bgColor: 'bg-[#9945FF]/10 hover:bg-[#9945FF]/20'
    },
    {
      id: 'explain',
      title: 'Explain Concept',
      description: 'Learn about Solana concepts',
      icon: <BookText className="h-4 w-4 text-[#00C2FF]" />,
      bgColor: 'bg-[#00C2FF]/10 hover:bg-[#00C2FF]/20'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0c0c10] text-white flex flex-col">
      {/* Gradient background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[50%] h-[70%] bg-[#14F195]/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[60%] bg-[#9945FF]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[40%] bg-[#00C2FF]/20 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <header className="border-b border-white/10 p-4 sticky top-0 bg-[#0c0c10]/95 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back to Home</span>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
            </Button>
            <h1 className="text-xl font-bold font-space-grotesk flex items-center gap-2">
              learn.sol AI Chat
              <div className="h-2 w-2 rounded-full bg-[#14F195] animate-pulse" />
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="h-9 border-white/10 text-white/80 hover:text-white hover:bg-white/5">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button 
              variant="outline" 
              className="h-9 border-white/10 text-white/80 hover:text-white hover:bg-white/5"
              onClick={() => window.location.reload()}
            >
              Clear
            </Button>
            <Button className="h-9 bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black">
              <Download className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`${
          sidebarOpen ? 'w-80' : 'w-0'
        } transition-all duration-300 border-r border-white/10 bg-black/40 flex flex-col`}>
          <div className="p-4">
            <Button 
              onClick={createNewChat}
              className="w-full bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="space-y-2 p-4">
              {chatSessions.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    currentChatId === chat.id
                      ? 'bg-white/10'
                      : 'hover:bg-white/5'
                  }`}
                  onClick={() => switchChat(chat.id)}
                >
                  <div className="flex-1 truncate mr-2">
                    <p className="truncate">{chat.title}</p>
                    <p className="text-xs text-white/40">
                      {formatDate(chat.timestamp)}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#1c1c24] border-white/10">
                      <DropdownMenuItem onClick={() => deleteChat(chat.id)} className="text-red-400">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col h-[calc(100vh-73px)]">
          {/* Chat messages */}
          <ScrollArea className="flex-1 px-4 py-6">
            <div className="max-w-4xl mx-auto space-y-8">
              {currentMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#14F195] to-[#9945FF] flex items-center justify-center">
                    <Cpu className="h-8 w-8 text-black" />
                  </div>
                  <h2 className="text-2xl font-bold">Welcome to learn.sol AI</h2>
                  <p className="text-white/70 max-w-md">
                    Your personal Solana development assistant. Ask me anything about smart contracts, 
                    blockchain development, or Solana concepts.
                  </p>
             {/* suggested questions */}
                  <div className="flex flex-wrap gap-2 justify-center max-w-md">
                    <Button variant="outline" className="border-white/10" onClick={() => setInputAndSend("How do I create a basic Solana program?")}>
                      Create a Solana program
                    </Button>
                    <Button variant="outline" className="border-white/10" onClick={() => setInputAndSend("What is an SPL token?")}>
                      Learn about SPL tokens
                    </Button>
                    <Button variant="outline" className="border-white/10" onClick={() => setInputAndSend("How to deploy to devnet?")}>
                      Deploy to devnet
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {currentMessages.map((message, index) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      } chat-message-appear`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div
                        className={`flex max-w-[90%] break-words rounded-lg p-5 group relative ${
                          message.role === "user"
                            ? "bg-[#9945FF]/20 text-white"
                            : "bg-[#14F195]/10 text-white"
                        }`}
                      >
                        <div className="flex items-start w-full">
                          {message.role === "assistant" && (
                            <Avatar className="h-9 w-9 mr-4 mt-0.5 bg-gradient-to-r from-[#9945FF] to-[#14F195] flex-shrink-0">
                              <Cpu className="h-4 w-4 text-black" />
                            </Avatar>
                          )}
                          <div className="space-y-3 w-full overflow-hidden">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-white/40 hover:text-white absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => copyToClipboard(message.content)}
                                  >
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>{isCopying ? "Copied!" : "Copy message"}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Markdown className="text-base w-full">
                              {message.content}
                            </Markdown>
                            <div className="text-xs text-white/40 pt-1">
                              {formatTime(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start chat-message-appear">
                      <div className="bg-[#14F195]/10 flex items-center rounded-lg p-5 text-white max-w-[90%]">
                        <Avatar className="h-9 w-9 mr-4 bg-gradient-to-r from-[#9945FF] to-[#14F195]">
                          <Cpu className="h-4 w-4 text-black" />
                        </Avatar>
                        <div className="flex space-x-2">
                          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Chat input */}
          <div className="p-4 border-t border-white/10 bg-black/30 sticky bottom-0">
            <div className="max-w-4xl mx-auto">
              <form onSubmit={handleChatSubmit} className="flex items-end gap-2">
                <Textarea
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Lets dive into Solana now!"
                  className="flex-1 resize-none bg-white/5 border-white/10 focus-visible:ring-[#14F195] min-h-[52px] max-h-[200px] py-3 px-4"
                  rows={1}
                  spellCheck={false}
                  autoComplete="off"
                  autoCorrect="off"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || !input.trim()}
                  className={`h-[52px] w-[52px] rounded-full ${
                    isLoading || !input.trim()
                      ? "opacity-50"
                      : "bg-gradient-to-r from-[#14F195] to-[#9945FF] hover:opacity-90"
                  }`}
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-black" />
                  ) : (
                    <Send className="h-5 w-5 text-black" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Features Panel - Right side */}
        <div className="w-80 border-l border-white/10 bg-black/40 p-6 hidden lg:block">
          <div className="sticky top-24">
            <h3 className="text-lg font-medium mb-4">Features</h3>
            <div className="space-y-3">
              {features.map(feature => (
                <button 
                  key={feature.id}
                  className={`w-full p-3 rounded-lg ${feature.bgColor} cursor-pointer transition-colors text-left`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {feature.icon}
                    <h4 className="font-medium">{feature.title}</h4>
                  </div>
                  <p className="text-sm text-white/70">{feature.description}</p>
                </button>
              ))}
            </div>
            
            <div className="mt-8 bg-white/5 rounded-lg p-4">
              <h4 className="font-medium mb-2">Pro Tips</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-[#14F195] mt-0.5">•</span>
                  <span>Use <code className="bg-white/10 px-1 rounded">Shift+Enter</code> for a new line</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#14F195] mt-0.5">•</span>
                  <span>Include code samples with <code className="bg-white/10 px-1 rounded">```</code></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#14F195] mt-0.5">•</span>
                  <span>Ask for specific error solutions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}