"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const PROTECTED_ROUTES = [
  "/jobs",
  "/projects",
  "/dashboard",
  "/admin",
];

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { ready, authenticated, login } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  const handleLogin = async () => {
    setIsConnecting(true);
    try {
      await login();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  if (isProtectedRoute && !ready) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-gray-900 via-slate-900 to-gray-900" />
        <div className="relative z-10 rounded-2xl border border-gray-700/50 bg-gray-900/40 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-center space-x-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-600 border-t-cyan-400" />
            <span className="text-sm font-medium text-gray-100">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!isProtectedRoute || authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-60 blur-sm">
        {children}
      </div>

      <div className="absolute inset-0 bg-linear-to-br from-gray-900/20 via-slate-900/15 to-gray-900/20" />

      <div className="relative z-50 flex min-h-screen items-center justify-center p-6 text-center">
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold text-white/95">Welcome back!</h1>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              onClick={handleLogin}
              disabled={isConnecting}
              className="flex h-12 items-center gap-2 rounded-xl border border-white/10 bg-linear-to-r from-teal-400 to-emerald-500 px-6 font-medium text-gray-900 shadow-lg transition-all duration-200 hover:from-teal-300 hover:to-emerald-400 hover:shadow-teal-400/25"
            >
              {isConnecting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-900/30 border-t-gray-900" />
                  Connecting...
                </div>
              ) : (
                <>
                  <User className="h-5 w-5" />
                  Sign Up / Login
                </>
              )}
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="ghost"
              className="h-12 rounded-xl border border-white/10 bg-white/5 px-6 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Button>
          </div>
          <p className="text-xs text-white/50">Sign in to access this protected area.</p>
        </div>
      </div>
    </div>
  );
}
