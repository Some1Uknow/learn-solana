"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useWeb3Auth } from "@/hooks/use-web3-auth";

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.2 2.9-7.1 0-.7-.1-1.5-.2-2.2H12Z"
      />
      <path
        fill="#34A853"
        d="M12 22c2.6 0 4.8-.9 6.4-2.5l-3.1-2.4c-.9.6-2 .9-3.3.9-2.5 0-4.6-1.7-5.3-4H3.5v2.5A10 10 0 0 0 12 22Z"
      />
      <path
        fill="#FBBC05"
        d="M6.7 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.5H3.5A10 10 0 0 0 2.4 12c0 1.6.4 3.1 1.1 4.5L6.7 14Z"
      />
      <path
        fill="#4285F4"
        d="M12 6c1.4 0 2.7.5 3.7 1.4l2.8-2.8C16.8 3 14.6 2 12 2a10 10 0 0 0-8.5 5.5L6.7 10c.7-2.3 2.8-4 5.3-4Z"
      />
    </svg>
  );
}

function WalletIcon({
  name,
  icon,
}: {
  name: string;
  icon?: string;
}) {
  if (icon) {
    return (
      <img
        src={icon}
        alt=""
        className="h-5 w-5 rounded-sm object-contain"
      />
    );
  }

  const label = name.slice(0, 2).toUpperCase();

  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-white/10 text-[10px] font-medium text-zinc-300">
      {label}
    </div>
  );
}

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
  description = "Choose how you want to continue.",
}: LoginRequiredModalProps) {
  const {
    loginWithAuthConnection,
    loginWithNativeWallet,
    logout,
    browserWallets,
    refreshBrowserWallets,
  } = useWeb3Auth();

  const [isConnecting, setIsConnecting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [pendingWalletId, setPendingWalletId] = useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      refreshBrowserWallets();
      setLoginError(null);
      setPendingWalletId(null);
      setIsConnecting(false);
    }
  }, [open, refreshBrowserWallets]);

  const handleGoogleLogin = async () => {
    setIsConnecting(true);
    setLoginError(null);

    try {
      await loginWithAuthConnection("google");
      onOpenChange(false);
    } catch (error) {
      console.error("Google login failed:", error);
      setLoginError("Google sign-in did not finish. Try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleNativeWalletLogin = async (walletId: string) => {
    setIsConnecting(true);
    setPendingWalletId(walletId);
    setLoginError(null);

    try {
      await loginWithNativeWallet(walletId);
      onOpenChange(false);
    } catch (error) {
      console.error(`Native wallet login failed for ${walletId}:`, error);
      setLoginError("Wallet sign-in did not finish. Try again.");
    } finally {
      setIsConnecting(false);
      setPendingWalletId(null);
    }
  };

  const handleResetSession = async () => {
    setIsConnecting(true);
    setLoginError(null);
    try {
      await logout();
    } catch (error) {
      console.error("Session reset failed:", error);
      setLoginError("Session reset failed. Refresh and try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed left-[50%] top-[50%] z-50 w-[calc(100%-1.5rem)] max-w-xl translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-2xl border border-white/10 bg-[#080a0d] p-0 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-none duration-200">
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

          <div className="space-y-4">
            <section className="rounded-xl border border-white/10 bg-[#0d1014] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-white">Google</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    Fastest setup. Good if you just want to get started.
                  </p>
                </div>
              </div>

              <Button
                onClick={handleGoogleLogin}
                disabled={isConnecting}
                variant="outline"
                className="mt-4 h-11 w-full justify-center rounded-lg border-white/10 bg-white text-black hover:bg-zinc-100 hover:text-black"
              >
                <span className="inline-flex items-center gap-2">
                  <GoogleIcon />
                  {isConnecting && !pendingWalletId ? "Opening Google..." : "Continue with Google"}
                </span>
              </Button>
            </section>

            <section className="rounded-xl border border-white/10 bg-[#0d1014] p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-sm font-medium text-white">Wallet</h3>
                  <p className="mt-1 text-sm text-zinc-400">
                    Sign in with your Solana wallet directly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetSession}
                  disabled={isConnecting}
                  className="shrink-0 text-xs text-zinc-500 transition-colors hover:text-zinc-300 disabled:opacity-50"
                >
                  Reset
                </button>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {browserWallets.length > 0 ? (
                  browserWallets.map((wallet) => {
                    const isPending = pendingWalletId === wallet.id;
                    return (
                      <Button
                        key={wallet.id}
                        onClick={() => handleNativeWalletLogin(wallet.id)}
                        disabled={isConnecting}
                        variant="outline"
                        className="h-11 justify-between rounded-lg border-white/10 bg-transparent px-4 text-white hover:bg-white/5"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <WalletIcon name={wallet.name} icon={wallet.icon} />
                          <span className="truncate">{wallet.name}</span>
                        </span>
                        <span className="text-xs text-zinc-500">
                          {isPending ? "..." : "Open"}
                        </span>
                      </Button>
                    );
                  })
                ) : (
                  <div className="sm:col-span-2 rounded-lg border border-white/10 bg-[#0a0d11] px-4 py-3 text-sm text-zinc-400">
                    No wallet detected in this browser.
                  </div>
                )}
              </div>

              {pendingWalletId && (
                <p className="mt-3 text-sm text-zinc-500">Waiting for wallet approval...</p>
              )}
            </section>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}
