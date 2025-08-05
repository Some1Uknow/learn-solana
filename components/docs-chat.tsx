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

  const isLoading = status === "streaming";

  // Handle panel resizing
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
        if (newWidth >= 320 && newWidth <= 800) {
          // Min and max width constraints
          setPanelWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  // Add event listeners for resizing
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    sendMessage({ text: input });
    setInput("");
  };

  const renderMessageContent = (message: any) => {
    // Handle text content
    if (typeof message.content === "string") {
      return <ReactMarkdown>{message.content}</ReactMarkdown>;
    }

    // Handle parts-based format (AI SDK 5.0)
    if (message.parts) {
      return (
        <div className="space-y-2">
          {message.parts.map((part: any, index: number) => {
            if (part.type === "text") {
              return <ReactMarkdown key={index}>{part.text}</ReactMarkdown>;
            }
            return null;
          })}
        </div>
      );
    }

    // Handle tool invocations with detailed feedback
    if (message.toolInvocations) {
      return (
        <div className="space-y-3">
          {message.content && <ReactMarkdown>{message.content}</ReactMarkdown>}
          {message.toolInvocations.map((toolInvocation: any, index: number) => (
            <div
              key={index}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 rounded-lg"
            >
              {toolInvocation.toolName === "searchDocumentation" && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-medium">
                    <Search size={14} />
                    <span>Documentation Search</span>
                  </div>

                  {toolInvocation.state === "call" && (
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      Searching for: "{toolInvocation.args?.query}"
                    </div>
                  )}

                  {toolInvocation.result && (
                    <div className="text-sm">
                      {typeof toolInvocation.result === "string" ? (
                        <div className="text-gray-700 dark:text-gray-300">
                          {toolInvocation.result}
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="font-medium text-green-700 dark:text-green-300">
                            {toolInvocation.result.success ? "✅ " : "❌ "}
                            {toolInvocation.result.message}
                          </div>
                          {toolInvocation.result.totalSections && (
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              Found {toolInvocation.result.totalSections}{" "}
                              relevant sections
                            </div>
                          )}
                          {toolInvocation.result.suggestion && (
                            <div className="text-xs text-yellow-700 dark:text-yellow-300">
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
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-2xl z-50 transition-all duration-300 transform hover:scale-110 hover:shadow-blue-500/25"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Slide-out Chat Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full bg-white dark:bg-gray-900 shadow-2xl z-40 transition-transform duration-300 ease-out border-l border-gray-200 dark:border-gray-700 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: `${panelWidth}px` }}
      >
        {/* Resize Handle */}
        <div
          className="absolute left-0 top-0 h-full w-1 cursor-ew-resize hover:bg-blue-500 transition-colors group"
          onMouseDown={startResizing}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 bg-gray-300 dark:bg-gray-600 group-hover:bg-blue-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical
              size={12}
              className="text-gray-600 dark:text-gray-300 group-hover:text-white"
            />
          </div>
        </div>

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Solana Assistant</h3>
              <p className="text-blue-100 text-sm">
                AI-powered documentation helper
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close chat"
            title="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Search size={24} className="text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Welcome to Solana Assistant
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Ask specific questions about Solana development:
                </p>
              </div>
              <div className="grid gap-2 text-left">
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
                      setInput(question);
                      sendMessage({ text: question });
                    }}
                    className="text-left p-3 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((m: any) => (
          <div key={m.id} className="space-y-3">
            <div
              className={`flex items-start gap-3 ${
                m.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-blue-500 to-purple-600"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              >
                {m.role === "user" ? (
                  <User size={16} className="text-white" />
                ) : (
                  <Bot size={16} className="text-gray-600 dark:text-gray-300" />
                )}
              </div>
              <div
                className={`flex-1 rounded-xl p-4 shadow-sm ${
                  m.role === "user"
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white ml-8"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 mr-8"
                }`}
              >
                <div
                  className={`prose prose-sm max-w-none ${
                    m.role === "user" ? "prose-invert" : "dark:prose-invert"
                  }`}
                >
                  {renderMessageContent(m)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3 px-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Bot size={16} className="text-gray-600 dark:text-gray-300" />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

        {/* Input Area */}
        <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about Solana development..."
                  className="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 disabled:transform-none"
                  aria-label="Send message"
                  title="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>Ask specific questions for better results</span>
              <span>{panelWidth}px wide</span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
