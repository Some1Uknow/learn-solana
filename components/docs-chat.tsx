"use client";

import { FormEvent, useCallback, useMemo, useRef, useState, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Loader2, Lock, MessageCircle, Search, Send, User, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { useChatContext } from "./chat-context";
import { authFetch } from "@/lib/auth/authFetch";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "@/hooks/use-toast";

const suggestedQuestions = [
  "What is a PDA and why does Solana use it?",
  "How do signers and writable accounts work?",
  "How should I think about Anchor account constraints?",
  "What changes when I build clients with @solana/kit?",
];

function getMessageText(message: any) {
  if (typeof message.content === "string") return message.content;
  if (!Array.isArray(message.parts)) return "";

  return message.parts
    .filter((part: any) => part.type === "text" && typeof part.text === "string")
    .map((part: any) => part.text)
    .join("");
}

function SearchToolStatus({ message }: { message: any }) {
  const parts = Array.isArray(message.parts) ? message.parts : [];
  const hasTool = parts.some((part: any) => String(part.type || "").includes("searchDocumentation"));

  if (!hasTool && !message.toolInvocations) return null;

  return (
    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#a9ff2f]/20 bg-[#a9ff2f]/10 px-2.5 py-1 text-[11px] font-medium text-[#d8ff98]">
      <Search className="h-3 w-3" />
      Searching learn.sol docs
    </div>
  );
}

export default function DocsChat() {
  const { isOpen, setIsOpen } = useChatContext();
  const { ready, authenticated, login } = useAuth();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const authPromptInFlightRef = useRef(false);
  const lastAuthToastAtRef = useRef(0);

  const promptForAssistantLogin = useCallback(
    async (message = "Login is required to use the assistant.") => {
      const now = Date.now();
      const shouldToast = now - lastAuthToastAtRef.current > 2500;

      if (shouldToast) {
        toast({
          title: "Login required",
          description: message,
        });
        lastAuthToastAtRef.current = now;
      }

      if (authPromptInFlightRef.current) return;

      authPromptInFlightRef.current = true;
      try {
        await login();
      } finally {
        authPromptInFlightRef.current = false;
      }
    },
    [login]
  );

  const chatTransport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        credentials: "include",
        fetch: async (request, init) => {
          const url =
            typeof request === "string" || request instanceof URL ? request.toString() : request.url;
          const response = await authFetch(url, init as any);

          if (response.status === 401) {
            await promptForAssistantLogin("Login is required to use the assistant.");
          }

          return response;
        },
      }),
    [promptForAssistantLogin]
  );

  const { messages, sendMessage, status, error, clearError } = useChat({
    transport: chatTransport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (!isOpen) return;
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isLoading, isOpen]);

  async function submitQuestion(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isLoading) return;

    clearError();

    if (!ready || !authenticated) {
      setInput(trimmed);
      await promptForAssistantLogin();
      return;
    }

    sendMessage({ text: trimmed });
    setInput("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submitQuestion(input);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full border border-[#a9ff2f]/35 bg-black shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_24px_70px_rgba(169,255,47,0.22)] transition hover:-translate-y-0.5 hover:border-[#a9ff2f]/70"
        aria-label={isOpen ? "Close LearnSol assistant" : "Open LearnSol assistant"}
      >
        {isOpen ? (
          <X className="h-5 w-5 text-[#a9ff2f]" />
        ) : (
          <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-[#a9ff2f]">
            <img src="/brand/learnsol-mark-lime.png" alt="" className="h-8 w-8 object-contain" />
            <MessageCircle className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-black p-0.5 text-[#a9ff2f]" />
          </span>
        )}
      </button>

      <div
        className={`fixed inset-0 z-40 bg-black/20 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <aside
        className={`fixed bottom-24 right-5 z-50 flex h-[min(720px,calc(100vh-8rem))] w-[min(440px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#050505]/92 text-white shadow-[0_28px_120px_rgba(0,0,0,0.62)] backdrop-blur-2xl transition-all duration-300 sm:right-6 ${
          isOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-4 scale-[0.98] opacity-0"
        }`}
        aria-label="LearnSol AI assistant"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(169,255,47,0.16),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_24%)]" />

        <header className="relative flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-[#a9ff2f]">
              <Bot className="h-5 w-5 text-black" />
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold tracking-tight">LearnSol Assistant</h2>
              <p className="truncate text-xs text-white/52">Source-grounded help from the docs</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 text-white/56 transition hover:bg-white/10 hover:text-white"
            aria-label="Close assistant"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div ref={scrollRef} className="relative flex-1 overflow-y-auto px-4 py-4">
          {messages.length === 0 ? (
            <div className="flex min-h-full flex-col justify-end gap-4">
              <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-4">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#a9ff2f]/20 bg-[#a9ff2f]/10 px-2.5 py-1 text-[11px] text-[#d8ff98]">
                  <Lock className="h-3 w-3" />
                  Login required to ask
                </div>
                <h3 className="text-lg font-semibold tracking-tight">Ask while you read.</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">
                  The assistant searches the learn.sol docs first, then answers with citations
                  back to the lesson pages.
                </p>
              </div>

              <div className="grid gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    onClick={() => void submitQuestion(question)}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-3 text-left text-sm leading-5 text-white/78 transition hover:border-[#a9ff2f]/30 hover:bg-[#a9ff2f]/10 hover:text-white"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message: any) => {
                const isUser = message.role === "user";
                const text = getMessageText(message);

                return (
                  <div key={message.id} className={`flex gap-2 ${isUser ? "justify-end" : ""}`}>
                    {!isUser && (
                      <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#a9ff2f] text-black">
                        <Bot className="h-3.5 w-3.5" />
                      </div>
                    )}
                    <div
                      className={`max-w-[86%] rounded-2xl border px-3.5 py-3 text-sm leading-6 ${
                        isUser
                          ? "border-[#a9ff2f]/25 bg-[#a9ff2f]/12 text-white"
                          : "border-white/10 bg-white/[0.045] text-white/84"
                      }`}
                    >
                      {!isUser && <SearchToolStatus message={message} />}
                      <div className="prose prose-invert max-w-none prose-p:my-2 prose-a:text-[#d8ff98] prose-code:rounded prose-code:bg-black/40 prose-code:px-1 prose-code:py-0.5 prose-code:text-[#d8ff98] prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/55">
                        <ReactMarkdown>{text}</ReactMarkdown>
                      </div>
                    </div>
                    {isUser && (
                      <div className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-white/10 text-white">
                        <User className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}

              {isLoading && (
                <div className="flex items-center gap-2 text-sm text-white/56">
                  <div className="grid h-7 w-7 place-items-center rounded-full bg-[#a9ff2f] text-black">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.045] px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-[#a9ff2f]" />
                    Reading the docs
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative border-t border-white/10 p-3">
          {error && (
            <div className="mb-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-3 py-2 text-xs text-red-100">
              The assistant could not answer. If you just signed in, try sending again.
            </div>
          )}
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder={authenticated ? "Ask about this lesson..." : "Login to ask the assistant..."}
              rows={1}
              className="max-h-32 min-h-11 flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm leading-5 text-white outline-none transition placeholder:text-white/36 focus:border-[#a9ff2f]/45 focus:ring-2 focus:ring-[#a9ff2f]/20"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#a9ff2f] text-black transition hover:bg-[#c8ff75] disabled:cursor-not-allowed disabled:opacity-45"
              aria-label={authenticated ? "Send question" : "Login to send question"}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
