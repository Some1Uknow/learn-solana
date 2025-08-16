"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Search,
  GripVertical,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChatContext } from "./chat-context";

export default function DocsChat() {
  const { isOpen, setIsOpen, panelWidth, setPanelWidth } = useChatContext();
  const [input, setInput] = useState("");
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  // Better loading state: show loader until we have actual content
  const lastMessage = messages.at(-1);
  const hasActualContent = lastMessage?.role === "assistant" && 
    lastMessage?.parts?.some((part: any) => part.type === "text" && part.text?.length > 0);
  
  const isLoading = status === "submitted" || 
    (status === "streaming" && lastMessage?.role === "assistant" && !hasActualContent);

  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing && panelRef.current) {
        const newWidth = window.innerWidth - e.clientX;
        // Ensure panel width is within viewport bounds and reasonable limits
        const minWidth = 320;
        const maxWidth = Math.min(800, window.innerWidth * 0.9); // Max 90% of viewport
        const clampedWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
        setPanelWidth(clampedWidth);
      }
    },
    [isResizing, setPanelWidth]
  );

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResizing);
      document.body.style.cursor = "ew-resize";
      document.body.style.userSelect = "none";
    } else {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }

    return () => {
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResizing);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, resize, stopResizing]);

  // Handle window resize to ensure panel stays within bounds
  useEffect(() => {
    const handleWindowResize = () => {
      const maxWidth = window.innerWidth * 0.9;
      if (panelWidth > maxWidth) {
        setPanelWidth(Math.max(320, maxWidth));
      }
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [panelWidth, setPanelWidth]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  const renderMessageContent = (message: any) => {
    if (typeof message.content === "string") {
      return <ReactMarkdown>{message.content}</ReactMarkdown>;
    }
    if (message.parts) {
      return (
        <div className="space-y-1">
          {message.parts.map((part: any, index: number) => {
            if (part.type === "text") {
              return <ReactMarkdown key={index}>{part.text}</ReactMarkdown>;
            }
            return null;
          })}
        </div>
      );
    }
    if (message.toolInvocations) {
      return (
        <div className="space-y-2">
          {message.content && <ReactMarkdown>{message.content}</ReactMarkdown>}
          {message.toolInvocations.map((toolInvocation: any, index: number) => (
            <div
              key={index}
              className="border border-cyan-500/20 bg-black/30 backdrop-blur-md rounded-lg p-2 min-w-0"
            >
              {toolInvocation.toolName === "searchDocumentation" && (
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-1 text-cyan-300 font-medium text-xs">
                    <Search size={12} className="flex-shrink-0" />
                    <span className="truncate">Documentation Search</span>
                  </div>

                  {toolInvocation.state === "call" && (
                    <div className="text-xs text-cyan-200/80 break-words">
                      Searching for: "{toolInvocation.args?.query}"
                    </div>
                  )}

                  {toolInvocation.result && (
                    <div className="text-xs min-w-0">
                      {typeof toolInvocation.result === "string" ? (
                        <div className="text-gray-200 break-words">
                          {toolInvocation.result}
                        </div>
                      ) : (
                        <div className="space-y-1 min-w-0">
                          <div className="font-medium text-emerald-300 break-words">
                            {toolInvocation.result.success ? "✅ " : "❌ "}
                            {toolInvocation.result.message}
                          </div>
                          {toolInvocation.result.totalSections && (
                            <div className="text-xs text-gray-400">
                              Found {toolInvocation.result.totalSections}{" "}
                              relevant sections
                            </div>
                          )}
                          {toolInvocation.result.suggestion && (
                            <div className="text-xs text-amber-300 break-words">
                              💡 {toolInvocation.result.suggestion}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    return <ReactMarkdown>{message.content || ""}</ReactMarkdown>;
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 text-black dark:text-white bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 px-3 py-2 rounded-full shadow-[0_0_30px_-8px_rgba(34,211,238,0.6)] ring-1 ring-cyan-300/40 z-50 transition-all duration-300 hover:scale-105"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={18} /> : <MessageCircle size={18} />}
      </button>

      {/* Slide-out Chat Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full bg-[#07090c]/80 dark:bg-[#07090c]/80 backdrop-blur-xl shadow-2xl z-40 transition-transform duration-300 ease-out border-l border-white/10 flex flex-col overflow-hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          width: `${
            typeof window !== "undefined"
              ? Math.min(panelWidth, window.innerWidth * 0.9)
              : panelWidth
          }px`,
          maxWidth: "90vw",
          minWidth: "320px",
        }}
      >
        {/* Edge glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-fuchsia-500/5 via-transparent to-cyan-500/10" />

        {/* Resize Handle */}
        <div
          className="absolute left-0 top-0 h-full w-1 cursor-ew-resize group"
          onMouseDown={startResizing}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 bg-cyan-400/0 group-hover:bg-cyan-400/60 rounded-full p-1 transition-all">
            <GripVertical
              size={10}
              className="text-cyan-300/0 group-hover:text-black"
            />
          </div>
        </div>

        {/* Header */}
        <div className="relative text-white p-3 flex items-center justify-between flex-shrink-0 border-b border-white/10 min-w-0">
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/10 via-transparent to-cyan-400/10" />
          <div className="relative flex items-center gap-2 min-w-0 flex-1">
            <div className="p-1.5 rounded-lg bg-black/30 ring-1 ring-white/10 flex-shrink-0">
              <Bot size={14} className="text-cyan-300" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold tracking-tight text-sm truncate">
                Solana Assistant
              </h3>
              <p className="text-xs text-white/60 truncate">
                AI-powered documentation helper
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="relative p-1.5 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            aria-label="Close chat"
            title="Close chat"
          >
            <X size={14} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 space-y-2 bg-transparent min-w-0">
          {messages.length === 0 && (
            <div className="text-center py-4 min-w-0">
              <div className="rounded-xl p-4 border border-white/10 bg-white/5 backdrop-blur-md shadow-lg">
                <div className="mb-3">
                  <div className="w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center mx-auto mb-2 shadow-[0_0_30px_-8px_rgba(34,211,238,0.6)]">
                    <Search size={16} className="text-black" />
                  </div>
                  <h4 className="font-semibold text-white mb-1 text-sm">
                    Welcome to Solana Assistant
                  </h4>
                  <p className="text-xs text-white/60">
                    Ask specific questions about Solana development:
                  </p>
                </div>
                <div className="grid gap-1.5 text-left">
                  {[
                    "How do I set up a Solana development environment?",
                    "What is the Solana account model and how does it work?",
                    "How do I write Rust programs for Solana?",
                    "What are PDAs and how do I use them?",
                    "How do I deploy a program to Solana?",
                  ].map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        sendMessage({ text: question });
                      }}
                      className="text-left p-2 text-xs rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/90 transition-colors break-words"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((m: any) => (
            <div key={m.id} className="space-y-2 min-w-0">
              <div
                className={`flex items-start gap-2 min-w-0 ${
                  m.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ring-1 ${
                    m.role === "user"
                      ? "bg-white/10 text-white ring-white/10"
                      : "bg-black/30 text-cyan-300 ring-cyan-400/30"
                  }`}
                >
                  {m.role === "user" ? <User size={12} /> : <Bot size={12} />}
                </div>
                <div
                  className={`flex-1 min-w-0 rounded-xl p-3 shadow-lg border backdrop-blur-md ${
                    m.role === "user"
                      ? "bg-white/[0.06] border-white/10 text-white ml-6"
                      : "bg-black/40 border-white/10 text-gray-100 mr-6"
                  }`}
                >
                  <div
                    className={`chat-message-content break-words text-sm leading-relaxed ${
                      m.role === "user"
                        ? "chat-message-user text-white"
                        : "chat-message-bot text-gray-100"
                    } [&_code]:text-cyan-300 [&_code]:bg-black/40 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono [&_a]:text-cyan-300 hover:[&_a]:text-cyan-200 [&_a]:underline [&_strong]:font-semibold [&_em]:italic [&_pre]:bg-black/60 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:text-xs [&_pre]:font-mono [&_pre]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-cyan-400/30 [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-gray-300`}
                  >
                    {renderMessageContent(m)}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 px-1 min-w-0">
              <div className="w-6 h-6 rounded-full bg-black/30 ring-1 ring-cyan-400/30 flex items-center justify-center flex-shrink-0">
                <Bot size={12} className="text-cyan-300" />
              </div>
              <div className="rounded-xl p-3 shadow-lg border border-white/10 bg-black/40 backdrop-blur-md flex-1 min-w-0">
                <div className="flex items-center gap-2 text-white/70">
                  <div className="flex space-x-1 flex-shrink-0">
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:100ms]"></div>
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:200ms]"></div>
                  </div>
                  <span className="text-xs">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-3 bg-transparent border-t border-white/10 flex-shrink-0 min-w-0">
          <form onSubmit={handleSubmit} className="space-y-2 min-w-0">
            <div className="flex gap-2 min-w-0">
              <div className="flex-1 relative min-w-0">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Solana development..."
                  className="w-full px-3 py-2 pr-10 text-sm rounded-lg bg-white/[0.06] text-white placeholder-white/40 border border-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-300/30 transition-all min-w-0"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2 py-1.5 rounded-md text-black bg-cyan-400 hover:bg-cyan-300 active:bg-cyan-500 shadow-[0_0_24px_-6px_rgba(34,211,238,0.7)] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
                  aria-label="Send message"
                  title="Send message"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-white/50 min-w-0">
              <span className="truncate flex-1">
                Ask specific questions for better results
              </span>
              <span className="flex-shrink-0 ml-2">
                {typeof window !== "undefined"
                  ? Math.min(panelWidth, window.innerWidth * 0.9)
                  : panelWidth}
                px
              </span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
