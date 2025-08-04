"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { MessageCircle, X, Send, Bot, User, Search } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function DocsChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "streaming";

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
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg z-50 transition-colors"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-96 h-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-40 flex flex-col">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg">
            <h3 className="font-semibold">Learn Solana Assistant</h3>
            <p className="text-sm text-blue-100">
              Ask me anything about Solana development!
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="text-gray-500 text-sm">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <p className="font-medium mb-2">
                    Try asking specific questions:
                  </p>
                  <ul className="text-xs space-y-1">
                    <li>
                      • "How do I set up a Solana development environment?"
                    </li>
                    <li>
                      • "What is the Solana account model and how does it work?"
                    </li>
                    <li>• "How do I write Rust programs for Solana?"</li>
                    <li>• "What are PDAs and how do I use them?"</li>
                    <li>• "How do I deploy a program to Solana?"</li>
                  </ul>
                </div>
              </div>
            )}

            {messages.map((m: any) => (
              <div key={m.id} className="space-y-2">
                <div
                  className={`flex items-start gap-2 ${
                    m.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`p-1 rounded-full ${
                      m.role === "user"
                        ? "bg-blue-100 dark:bg-blue-900"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    {m.role === "user" ? (
                      <User
                        size={16}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    ) : (
                      <Bot
                        size={16}
                        className="text-gray-600 dark:text-gray-400"
                      />
                    )}
                  </div>
                  <div
                    className={`p-3 rounded-lg max-w-[85%] ${
                      m.role === "user"
                        ? "bg-blue-500 text-white ml-auto"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    }`}
                  >
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {renderMessageContent(m)}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-gray-500 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Thinking...</span>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Solana development..."
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
