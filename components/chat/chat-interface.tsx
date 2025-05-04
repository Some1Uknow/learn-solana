"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/ui/avatar";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
};

const formatResponse = (content: string) => {
  const baseResponse = content.split('Suggested questions:')[0].trim();
  
  // Add suggested questions section
  return `${baseResponse}

Suggested questions:
1. What are the key differences between Solana and other blockchains?
2. How can I optimize my Solana program for better performance?
3. What are some best practices for Solana program security?`;
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "👋 Hi there! I'm learn.sol AI, your Solana development assistant. Ask me anything about Solana, Rust, Anchor, or web3 development!",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    // Simulate AI response (replace with actual API call in production)
    setTimeout(() => {
      const botResponses = [
        "To create a Solana program using Anchor, you'll need to set up your development environment first. Install Rust, Solana CLI, and Anchor framework. Would you like me to guide you through the setup process?",
        "In Rust, ownership is a key concept. Each value has a variable that's its 'owner', and there can only be one owner at a time. When the owner goes out of scope, the value is dropped. This helps Rust manage memory efficiently without garbage collection.",
        "Solana's high throughput comes from its unique consensus mechanism called Proof of History (PoH) combined with Proof of Stake (PoS). PoH creates a historical record that proves an event occurred at a specific moment in time.",
        "To deploy your Solana program to devnet, use `anchor deploy --provider.cluster devnet`. Make sure you have SOL in your devnet wallet first!",
      ];
      
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        content: formatResponse(randomResponse),
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] md:h-[calc(100vh-150px)] rounded-lg border border-white/10 bg-black/20 backdrop-blur-sm overflow-hidden">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`flex max-w-[80%] md:max-w-[70%] rounded-lg p-4 ${
                message.role === "user"
                  ? "bg-[#9945FF]/20 text-white ml-4"
                  : "bg-[#14F195]/10 text-white mr-4"
              }`}
            >
              <div className="flex">
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 mr-3 mt-0.5 bg-gradient-to-r from-[#9945FF] to-[#14F195]">
                    <Cpu className="h-4 w-4 text-black" />
                  </Avatar>
                )}
                <div>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className="text-xs text-white/40 mt-1">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-[#14F195]/10 flex items-center rounded-lg p-4 text-white mr-4">
              <Avatar className="h-8 w-8 mr-3 bg-gradient-to-r from-[#9945FF] to-[#14F195]">
                <Cpu className="h-4 w-4 text-black" />
              </Avatar>
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat input */}
      <div className="border-t border-white/10 p-4">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about Solana development..."
            className="flex-1 resize-none bg-white/5 border-white/10 focus-visible:ring-[#14F195]"
            rows={1}
          />
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className={`h-10 w-10 rounded-full ${
              isLoading || !input.trim()
                ? "opacity-50"
                : "bg-gradient-to-r from-[#14F195] to-[#9945FF] hover:opacity-90"
            }`}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-black" />
            ) : (
              <Send className="h-4 w-4 text-black" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}