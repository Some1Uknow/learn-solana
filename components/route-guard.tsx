"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useWeb3Auth } from '@/hooks/use-web3-auth';
import { Button } from '@/components/ui/button';

const PROTECTED_ROUTES = [
  '/games',
  '/jobs', 
  '/modules',
  '/projects',
  '/test-auth',
  '/dashboard',
  '/admin'
];

const ROUTE_CONFIGS = {
  '/games': {
    title: "🎮 Games Hub",
    description: "Access interactive Solana games and challenges to test your skills.",
    icon: "🎮"
  },
  '/jobs': {
    title: "💼 Job Board",
    description: "Explore exclusive Solana development opportunities and career paths.",
    icon: "💼"
  },
  '/modules': {
    title: "🎓 Learning Modules",
    description: "Access our comprehensive 5-week Solana development curriculum.",
    icon: "🎓"
  },
  '/projects': {
    title: "🚀 Project Gallery",
    description: "Explore and contribute to innovative Solana projects.",
    icon: "🚀"
  },
  '/test-auth': {
    title: "🔐 Authentication Test",
    description: "This is a testing page that requires authentication.",
    icon: "🔐"
  },
  '/dashboard': {
    title: "📊 Your Dashboard",
    description: "View your personal dashboard with progress and stats.",
    icon: "📊"
  },
  '/admin': {
    title: "⚙️ Admin Panel",
    description: "Administrative access for authorized users only.",
    icon: "⚙️"
  }
};

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, isLoading, login } = useWeb3Auth();
  const [isConnecting, setIsConnecting] = useState(false);

  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname.startsWith(route)
  );

  const routeConfig = ROUTE_CONFIGS[pathname as keyof typeof ROUTE_CONFIGS] || {
    title: "🔒 Protected Area",
    description: "This page requires authentication to access.",
    icon: "🔒"
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
    router.push('/');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-white mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is logged in or route is not protected, show the actual content
  if (!isProtectedRoute || isLoggedIn) {
    return <>{children}</>;
  }

  // Show blocker screen for protected routes when user is not logged in
  return (
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
            radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
            radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
            radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
            #000000
          `,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <div className="text-center max-w-2xl mx-auto">
          {/* Icon */}
          <div className="text-8xl mb-8 animate-pulse">
            {routeConfig.icon}
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            {routeConfig.title}
          </h1>
          
          {/* Description */}
          <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
            {routeConfig.description}
          </p>
          
          {/* Features Box */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-8 mb-8 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-4">✨ What you'll get:</h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span className="text-zinc-300">Secure wallet-based access</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span className="text-zinc-300">Personalized experience</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-zinc-300">Progress tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span className="text-zinc-300">Community features</span>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleLogin}
              disabled={isConnecting}
              size="lg"
              className="w-full md:w-auto px-12 py-4 text-lg bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              {isConnecting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Connecting...
                </>
              ) : (
                '🔐 Connect Wallet & Access'
              )}
            </Button>
            
            <div className="text-center">
              <Button
                onClick={handleGoBack}
                variant="outline"
                size="lg"
                className="px-8 py-3 border-zinc-600 text-zinc-300 hover:border-zinc-500 hover:text-white bg-transparent rounded-xl"
              >
                ← Back to Home
              </Button>
            </div>
          </div>
          
          {/* Info Text */}
          <p className="text-sm text-zinc-500 mt-6">
            New to Web3? No worries! We support Google, Facebook, Discord, and more.
          </p>
        </div>
      </div>
    </div>
  );
}
