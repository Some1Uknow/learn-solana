"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  MessageSquare, 
  Code, 
  Terminal, 
  Layout, 
  Menu, 
  X 
} from "lucide-react";

import { Button } from "@/components/ui/button";

export default function AppNavigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    {
      name: "Chat",
      href: "/chat",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Roadmap",
      href: "/roadmap",
      icon: <Layout className="h-5 w-5" />,
    },
    {
      name: "IDE",
      href: "/ide",
      icon: <Terminal className="h-5 w-5" />,
    },
    {
      name: "dApp Builder",
      href: "/dapp-builder",
      icon: <Code className="h-5 w-5" />,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-64 border-r border-white/10 bg-[#0c0c10] p-4 md:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center gap-2 py-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold font-space-grotesk">learn.sol</span>
              <div className="h-2 w-2 rounded-full bg-[#14F195] animate-pulse" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-[#14F195]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile - Bottom */}
          <div className="mt-auto border-t border-white/10 pt-4">
            <div className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#14F195] to-[#9945FF]" />
              <div>
                <p className="text-sm font-medium text-white">Solana Dev</p>
                <p className="text-xs text-white/60">Beta User</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-30 border-b border-white/10 bg-[#0c0c10] p-4 md:hidden">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold font-space-grotesk">learn.sol</span>
            <div className="h-2 w-2 rounded-full bg-[#14F195] animate-pulse" />
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="border-white/20 hover:bg-white/5"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-sm md:hidden pt-16">
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-[#14F195]" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}