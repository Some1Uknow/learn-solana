"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Loader2, Cpu, Plus, ChevronLeft, ChevronRight, 
  MoreVertical, Trash2, Copy } from "lucide-react";
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
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([{
    id: "default",
    title: "New Chat",
    timestamp: new Date(),
    messages: [],
  }]);
  const [currentChatId, setCurrentChatId] = useState("default");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCopying, setIsCopying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { 
    messages: aiMessages, 
    input, 
    handleSubmit: handleAiSubmit, 
    isLoading, 
    setInput,
    handleInputChange,
  } = useChat({
    api: "/api/chat",
    initialMessages: [],
    onResponse: () => {
      // Scroll to bottom after a small delay to ensure content is rendered
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  });

  // Convert AI SDK messages to our format with useMemo to prevent unnecessary recalculations
  const currentMessages = useMemo(() => 
    aiMessages.map(msg => ({
      id: msg.id,
      content: msg.content,
      role: msg.role as "user" | "assistant",
      timestamp: new Date()
    })),
    [aiMessages]
  );

  // Update chat sessions only when messages actually change
  useEffect(() => {
    if (currentMessages.length === 0) return;
    
    setChatSessions(prev => {
      const updatedSessions = [...prev];
      const chatIndex = updatedSessions.findIndex(chat => chat.id === currentChatId);
      
      if (chatIndex === -1) return prev;
      
      const currentChat = updatedSessions[chatIndex];
      if (currentChat.messages.length === currentMessages.length &&
          JSON.stringify(currentChat.messages) === JSON.stringify(currentMessages)) {
        return prev;
      }
      
      updatedSessions[chatIndex] = {
        ...currentChat,
        messages: currentMessages,
        title: currentChat.title === "New Chat" && currentMessages.length > 0
          ? currentMessages[0].content.slice(0, 30) + "..."
          : currentChat.title
      };
      
      return updatedSessions;
    });
  }, [currentMessages, currentChatId]);

  const handleChatSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleAiSubmit(e);
  }, [input, handleAiSubmit]);

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      timestamp: new Date(),
      messages: [],
    };
    setChatSessions(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
    window.location.reload();
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setIsCopying(true);
    setTimeout(() => setIsCopying(false), 2000);
  };

  return (
    <div className="flex h-screen bg-[#0c0c10] text-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-[300px]' : 'w-0'} transition-all duration-300 h-screen bg-[#0c0c10] border-r border-white/10 flex flex-col overflow-hidden fixed left-0 top-0 z-20`}>
        <div className="p-4 pb-2">
          <Button onClick={createNewChat} className="w-full bg-gradient-to-r from-[#14F195] to-[#9945FF]">
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="space-y-1 p-2">
            {chatSessions.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
                  currentChatId === chat.id
                    ? 'bg-white/10'
                    : 'hover:bg-white/5'
                }`}
                onClick={() => setCurrentChatId(chat.id)}
              >
                <div className="flex-1 truncate mr-2">
                  <p className="truncate font-medium">{chat.title}</p>
                  <p className="text-xs text-white/40 mt-1">
                    {formatDate(chat.timestamp)}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#1c1c1c] border-white/10">
                    <DropdownMenuItem onClick={() => setChatSessions(prev => prev.filter(c => c.id !== chat.id))} className="text-red-400">
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

      {/* Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed left-[300px] top-1/2 -translate-y-1/2 z-30 h-20 w-6 rounded-r-lg bg-white/5 hover:bg-white/10 transition-all duration-300 ${
          !sidebarOpen && 'left-0'
        }`}
      >
        {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
      </Button>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${sidebarOpen ? 'ml-[300px]' : 'ml-0'} transition-all duration-300`}>
        {/* Header */}
        <header className="border-b border-white/10 h-[73px] flex items-center px-8 sticky top-0 bg-[#0c0c10]/95 backdrop-blur-sm z-10">
          <div className="flex items-center gap-4 w-full max-w-6xl mx-auto">
            <h1 className="text-lg font-semibold">SolanaGPT</h1>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-73px-100px)] px-4 py-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {currentMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#14F195] to-[#9945FF] flex items-center justify-center">
                    <Cpu className="h-8 w-8 text-black" />
                  </div>
                  <h2 className="text-2xl font-bold">Welcome to SolanaGPT</h2>
                  <p className="text-white/70 max-w-md">
                    Your personal Solana development assistant powered by AI. Ask me anything about smart contracts, 
                    blockchain development, or Solana concepts.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center max-w-md">
                    <Button variant="outline" className="border-white/10" onClick={() => setInput("How do I create a basic Solana program?")}>
                      Create a Solana program
                    </Button>
                    <Button variant="outline" className="border-white/10" onClick={() => setInput("What is an SPL token?")}>
                      Learn about SPL tokens
                    </Button>
                    <Button variant="outline" className="border-white/10" onClick={() => setInput("How to deploy to devnet?")}>
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

          {/* Chat Input */}
          <div className="border-t border-white/10 bg-[#0c0c10] p-6">
            <form onSubmit={handleChatSubmit} className="max-w-4xl mx-auto flex items-end gap-3">
              <Textarea
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleChatSubmit(e)}
                placeholder="Message SolanaGPT..."
                className="flex-1 resize-none bg-white/5 border-white/10 min-h-[60px] max-h-[200px] rounded-2xl px-4 py-3"
                rows={1}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="h-[60px] w-[60px] rounded-2xl bg-[#9945FF] hover:bg-[#8935EF]"
              >
                {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}