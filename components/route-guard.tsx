"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useWeb3Auth } from "@/hooks/use-web3-auth";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

const PROTECTED_ROUTES = [
  "/games",
  "/jobs",
  "/modules",
  "/projects",
  "/test-auth",
  "/dashboard",
  "/admin",
];

const ROUTE_CONFIGS = {
  "/games": {
    title: "🎮 Games Hub",
    description:
      "Access interactive Solana games and challenges to test your skills.",
    icon: "🎮",
  },
  "/jobs": {
    title: "💼 Job Board",
    description:
      "Explore exclusive Solana development opportunities and career paths.",
    icon: "💼",
  },
  "/modules": {
    title: "🎓 Learning Modules",
    description:
      "Access our comprehensive 5-week Solana development curriculum.",
    icon: "🎓",
  },
  "/projects": {
    title: "🚀 Project Gallery",
    description: "Explore and contribute to innovative Solana projects.",
    icon: "🚀",
  },
  "/test-auth": {
    title: "🔐 Authentication Test",
    description: "This is a testing page that requires authentication.",
    icon: "🔐",
  },
  "/dashboard": {
    title: "📊 Your Dashboard",
    description: "View your personal dashboard with progress and stats.",
    icon: "📊",
  },
  "/admin": {
    title: "⚙️ Admin Panel",
    description: "Administrative access for authorized users only.",
    icon: "⚙️",
  },
};

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, isLoading, login } = useWeb3Auth();
  const [isConnecting, setIsConnecting] = useState(false);

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const routeConfig = ROUTE_CONFIGS[pathname as keyof typeof ROUTE_CONFIGS] || {
    title: "🔒 Protected Area",
    description: "This page requires authentication to access.",
    icon: "🔒",
  };

  const handleLogin = async () => {
    setIsConnecting(true);
    try {
      await login();
      // After successful login, the component will re-render with isLoggedIn = true
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleGoBack = () => {
    router.push("/");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Dark background matching main page */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)]" />
        
        <div className="relative z-10 bg-gray-900/40 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-600 border-t-cyan-400"></div>
            <span className="text-gray-100 text-sm font-medium">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // If user is logged in or route is not protected, show the actual content
  if (!isProtectedRoute || isLoggedIn) {
    return <>{children}</>;
  }

  // Show the actual page content blurred in background with auth modal overlay
  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Blurred background content */}
      <div className="absolute inset-0 blur-sm opacity-60 pointer-events-none overflow-hidden">
        {children}
      </div>

      {/* Very light dark themed overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-slate-900/15 to-gray-900/20" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(6,182,212,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(14,165,233,0.05),transparent_50%)]" />

      {/* Centered content (no modal) */}
      <div className="relative z-50 min-h-screen p-6 flex items-center justify-center text-center">
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold text-white/95 drop-shadow-sm">Welcome back!</h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              onClick={handleLogin}
              disabled={isConnecting}
              className="h-12 px-6 bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-300 hover:to-emerald-400 text-gray-900 font-medium rounded-xl border border-white/10 shadow-lg transition-all duration-200 hover:shadow-teal-400/25 hover:scale-[1.02] disabled:hover:scale-100 flex items-center gap-2"
            >
              {isConnecting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-900/30 border-t-gray-900"></div>
                  Connecting...
                </div>
              ) : (
                <>
                  <Wallet className="w-5 h-5" />
                  Sign Up / Login
                </>
              )}
            </Button>
            <Button
              onClick={handleGoBack}
              variant="ghost"
              className="h-12 px-6 text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
            >
              Cancel
            </Button>
          </div>
          <p className="text-white/50 text-xs">New to Web3? We support multiple wallet providers</p>
        </div>
      </div>
    </div>
  );
}
