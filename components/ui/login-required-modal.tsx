"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

interface LoginRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function LoginRequiredModal({
  open,
  onOpenChange,
  title = "Sign in",
  description = "Sign in to continue.",
}: LoginRequiredModalProps) {
  const { login } = useAuth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleLogin = async () => {
    setIsConnecting(true);
    setLoginError(null);
    try {
      await login();
    } catch (error) {
      console.error("Privy login failed:", error);
      setLoginError("Sign-in did not finish. Try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 w-[calc(100%-1.5rem)] max-w-xl translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-2xl border border-white/10 bg-[#080a0d] p-0 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
        <div className="border-b border-white/10 px-5 py-4 sm:px-6">
          <div className="pr-10">
            <DialogTitle className="text-left text-[1.05rem] font-semibold tracking-tight text-white sm:text-lg">
              {title}
            </DialogTitle>
            <DialogDescription className="mt-1 text-left text-sm text-zinc-400">
              {description}
            </DialogDescription>
          </div>
        </div>

        <div className="px-5 py-5 sm:px-6 sm:py-6">
          {loginError && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {loginError}
            </div>
          )}

          <div className="rounded-xl border border-white/10 bg-[#0d1014] p-4">
            <h3 className="text-sm font-medium text-white">Continue with Privy</h3>
            <p className="mt-1 text-sm text-zinc-400">
              Use email, Google, GitHub, or passkey.
            </p>

            <Button
              onClick={handleLogin}
              disabled={isConnecting}
              className="mt-4 h-11 w-full justify-center rounded-lg bg-[#a9ff2f] text-black hover:bg-[#8fe826]"
            >
              {isConnecting ? "Opening sign-in..." : "Continue"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
