"use client";

import { ArrowRight, Code, MessageSquare, Zap, Check, Terminal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import AIAnimation from "@/components/ai-animation";
import { useState, useEffect } from "react";

export default function Home() {
  const [betaModalOpen, setBetaModalOpen] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState<number>(0);

  // Fetch waitlist count
  // useEffect(() => {
  //   fetch('/api/beta-signup')
  //     .then(res => res.json())
  //     .then(data => {
  //       if (data.count !== undefined) {
  //         setWaitlistCount(data.count);
  //       }
  //     })
  //     .catch(console.error);
  // }, []);

  return (
    <div className="min-h-screen bg-[#0c0c10] text-white">
      {/* Gradient background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[30%] -right-[10%] w-[50%] h-[70%] bg-[#14F195]/20 blur-[120px] rounded-full" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[60%] bg-[#9945FF]/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[10%] right-[20%] w-[30%] h-[40%] bg-[#00C2FF]/20 blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <nav className="container mx-auto py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold font-space-grotesk">learn.sol</span>
          <div className="h-2 w-2 rounded-full bg-[#14F195] animate-pulse" />
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Button variant="ghost" className="text-white/80 hover:text-white">About</Button>
          <Button variant="ghost" className="text-white/80 hover:text-white">Features</Button>
          <Button variant="ghost" className="text-white/80 hover:text-white">Docs</Button>
          <Button className="bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black">
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto py-12 md:py-32 px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold leading-tight font-space-grotesk mb-6">
              Learn. Build. Ship.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14F195] to-[#9945FF]">
                Faster.
              </span>
            </h1>
            <p className="text-lg text-white/70 mb-8">
              The ultimate AI-powered platform for Solana developers. Learn, code, and
              deploy with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black h-12 px-8"
                onClick={() => {
                  window.location.href = '/chat';
                }}
              >
                Get Started
              </Button>
              <Button 
                variant="outline" 
                className="border-white/10 h-12 px-8"
                onClick={() => {
                  window.location.href = '/learning';
                }}
              >
                View Learning Path <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <AIAnimation />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative py-32">
        {/* AI Chat Assistant */}
        <div className="container mx-auto px-4 mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-2xl blur-lg opacity-30"></div>
                <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                  <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                    <MessageSquare className="h-5 w-5 text-[#14F195]" />
                    <span className="text-sm font-medium">AI Assistant</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-r from-[#9945FF] to-[#14F195] text-black">AI</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-white/5 rounded-lg p-3">
                        <p className="text-sm">How do I implement a custom SPL token with metadata support?</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black">AI</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-white/5 rounded-lg p-3">
                        <p className="text-sm text-white/90">I'll help you create a custom SPL token with metadata. First, you'll need to:</p>
                        <pre className="mt-2 bg-black/30 p-2 rounded text-xs overflow-x-auto">
                          <code className="text-[#14F195]">anchor init token-metadata --javascript</code>
                        </pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-space-grotesk">AI-Powered Chat Assistant</h2>
              <p className="text-lg text-white/70 mb-6">Get instant answers to your Solana development questions. Our AI assistant is trained on the latest documentation and best practices.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#14F195]/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#14F195]" />
                  </div>
                  <span className="text-white/90">Real-time code suggestions</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#14F195]/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#14F195]" />
                  </div>
                  <span className="text-white/90">Debug assistance</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#14F195]/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#14F195]" />
                  </div>
                  <span className="text-white/90">Best practices guidance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Smart Contract IDE */}
        <div className="container mx-auto px-4 mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-space-grotesk">Smart Contract IDE</h2>
              <p className="text-lg text-white/70 mb-6">Write, test, and deploy Solana programs directly in your browser. Built-in support for Anchor framework and real-time compilation.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#9945FF]/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#9945FF]" />
                  </div>
                  <span className="text-white/90">Integrated Anchor framework</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#9945FF]/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#9945FF]" />
                  </div>
                  <span className="text-white/90">Real-time error checking</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#9945FF]/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#9945FF]" />
                  </div>
                  <span className="text-white/90">One-click deployment</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#9945FF] to-[#00C2FF] rounded-2xl blur-lg opacity-30"></div>
                <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 p-4">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-[#FF5F57]"></div>
                      <div className="h-3 w-3 rounded-full bg-[#FFBD2E]"></div>
                      <div className="h-3 w-3 rounded-full bg-[#28C840]"></div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-white/40" />
                      <span className="text-xs text-white/40">main.rs</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <pre className="text-sm">
                      <code>
                        <span className="text-[#9945FF]">use</span>{" "}
                        <span className="text-[#14F195]">anchor_lang::prelude::*;</span>{"\n\n"}
                        <span className="text-[#9945FF]">declare_id!</span>
                        <span className="text-white">(</span>
                        <span className="text-[#00C2FF]">"Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS"</span>
                        <span className="text-white">);</span>{"\n\n"}
                        <span className="text-[#9945FF]">#[program]</span>{"\n"}
                        <span className="text-[#14F195]">pub mod</span> basic_1{" "}
                        <span className="text-white">{"{"}</span>{"\n"}
                        <span className="text-white ml-4">// ...</span>{"\n"}
                        <span className="text-white">{"}"}</span>
                      </code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Learning */}
        <div className="container mx-auto px-4 mb-40">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#00C2FF] to-[#14F195] rounded-2xl blur-lg opacity-30"></div>
                <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium">Solana Developer Roadmap</h3>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#14F195] to-[#9945FF] flex items-center justify-center text-black font-medium text-sm">
                      25%
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-full bg-[#14F195]/10 flex items-center justify-center">
                          <Check className="h-4 w-4 text-[#14F195]" />
                        </div>
                        <div>
                          <h4 className="font-medium">Introduction to Solana</h4>
                          <p className="text-sm text-white/60">Architecture and unique features</p>
                        </div>
                      </div>
                      <div className="ml-11">
                        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-full bg-gradient-to-r from-[#14F195] to-[#9945FF]"></div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                          <Code className="h-4 w-4 text-[#9945FF]" />
                        </div>
                        <div>
                          <h4 className="font-medium">Smart Contract Development</h4>
                          <p className="text-sm text-white/60">Write your first Solana program</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-space-grotesk">Interactive Learning Path</h2>
              <p className="text-lg text-white/70 mb-6">Follow a structured learning path from beginner to advanced Solana developer. Complete interactive exercises and build real projects.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#00C2FF]/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#00C2FF]" />
                  </div>
                  <span className="text-white/90">Structured curriculum</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#00C2FF]/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#00C2FF]" />
                  </div>
                  <span className="text-white/90">Hands-on exercises</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#00C2FF]/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#00C2FF]" />
                  </div>
                  <span className="text-white/90">Progress tracking</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* dApp Builder */}
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-space-grotesk">dApp Builder</h2>
              <p className="text-lg text-white/70 mb-6">Generate full-stack Solana applications with AI. Choose your features and get production-ready code instantly.</p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#14F195]/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#14F195]" />
                  </div>
                  <span className="text-white/90">Smart contract generation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#14F195]/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#14F195]" />
                  </div>
                  <span className="text-white/90">Frontend scaffolding</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-[#14F195]/10 flex items-center justify-center">
                    <Check className="h-4 w-4 text-[#14F195]" />
                  </div>
                  <span className="text-white/90">Wallet integration</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-2xl blur-lg opacity-30"></div>
                <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <Terminal className="h-5 w-5 text-[#14F195] mb-2" />
                        <h4 className="text-sm font-medium mb-1">SPL Token</h4>
                        <p className="text-xs text-white/60">Create custom tokens</p>
                      </div>
                      <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                        <Code className="h-5 w-5 text-[#9945FF] mb-2" />
                        <h4 className="text-sm font-medium mb-1">NFT Collection</h4>
                        <p className="text-xs text-white/60">Launch NFT projects</p>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Generating dApp...</span>
                        <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full w-2/3 bg-gradient-to-r from-[#14F195] to-[#9945FF] animate-pulse"></div>
                        </div>
                      </div>
                      <pre className="text-xs">
                        <code>
                          <span className="text-[#14F195]">→</span> Scaffolding project structure...{"\n"}
                          <span className="text-[#14F195]">→</span> Generating smart contracts...{"\n"}
                          <span className="text-[#14F195]">→</span> Setting up frontend...
                        </code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto py-20 px-4 relative z-10">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#14F195] to-[#9945FF] rounded-2xl blur-lg opacity-20"></div>
          <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-space-grotesk">Ready to start building?</h2>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">Join {waitlistCount.toLocaleString()} developers building the future of web3 with learn.sol</p>
            <Button 
              className="bg-gradient-to-r from-[#14F195] to-[#9945FF] text-black h-12 px-8"
              onClick={() => window.location.href = '/chat'}
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
