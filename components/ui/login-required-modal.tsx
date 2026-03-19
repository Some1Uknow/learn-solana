"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, X, Lock } from "lucide-react";
import { useWeb3Auth } from "@/hooks/use-web3-auth";

interface LoginRequiredModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
}

export function LoginRequiredModal({
    open,
    onOpenChange,
    title = "Authentication Required",
    description = "Please connect your wallet to access this feature.",
}: LoginRequiredModalProps) {
    const { login, loginWithAuthConnection, logout } = useWeb3Auth();
    const [isConnecting, setIsConnecting] = useState(false);
    const [loginError, setLoginError] = useState<string | null>(null);
    const [isBrave, setIsBrave] = useState(false);

    React.useEffect(() => {
        if (typeof navigator === "undefined") return;
        const ua = navigator.userAgent || "";
        const brave =
            /\bBrave\b/i.test(ua) ||
            typeof (navigator as any).brave !== "undefined";
        setIsBrave(brave);
    }, []);

    const handleLogin = async () => {
        setIsConnecting(true);
        setLoginError(null);

        try {
            await login();
            onOpenChange(false);
        } catch (error) {
            console.error("Login failed:", error);
            setLoginError(
                error instanceof Error
                    ? error.message
                    : "Wallet login failed. Try again, or disable Brave Shields for this site if the wallet modal appears blank."
            );
        } finally {
            setIsConnecting(false);
        }
    };

    const handleDirectAuthLogin = async (authConnection: string) => {
        setIsConnecting(true);
        setLoginError(null);

        try {
            await loginWithAuthConnection(authConnection);
            onOpenChange(false);
        } catch (error) {
            console.error(`Direct ${authConnection} login failed:`, error);
            setLoginError(
                error instanceof Error
                    ? error.message
                    : "Direct login failed. Try again or use Chrome for now."
            );
        } finally {
            setIsConnecting(false);
        }
    };

    const handleResetSession = async () => {
        setIsConnecting(true);
        setLoginError(null);
        try {
            await logout();
        } catch (error) {
            console.error("Session reset failed:", error);
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-black/80 backdrop-blur-xl p-0 shadow-2xl duration-200 sm:rounded-2xl overflow-hidden">
                {/* Animated Gradient Border Effect */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-2xl">
                    <div className="absolute -inset-[100%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_140deg,rgba(20,241,149,0.5)_160deg,rgba(153,69,255,0.5)_200deg,transparent_220deg,transparent_360deg)] opacity-60" />
                </div>

                {/* Inner Content Background - slightly smaller to show border */}
                <div className="absolute inset-[1px] z-0 bg-[#07090c] rounded-[15px]" />

                {/* Diagonal Light Effects */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_50%_50%,rgba(20,241,149,0.05),transparent_50%)]" />
                    <div className="absolute bottom-[-50%] right-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_50%_50%,rgba(153,69,255,0.05),transparent_50%)]" />
                </div>

                <div className="relative z-10 flex flex-col p-6 items-center text-center">
                    <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-5 shrink-0 relative group">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#14f195]/20 to-[#9945ff]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <Lock className="w-6 h-6 text-zinc-400 group-hover:text-white transition-colors" />
                    </div>

                    <DialogTitle className="text-xl font-bold bg-gradient-to-br from-white via-white to-zinc-400 bg-clip-text text-transparent mb-2">
                        {title}
                    </DialogTitle>

                    <DialogDescription className="text-zinc-400 text-sm mb-8 max-w-[90%]">
                        {description}
                    </DialogDescription>

                    <div className="flex flex-col gap-3 w-full">
                        {loginError && (
                            <div className="rounded-xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-left text-sm text-amber-200">
                                {loginError}
                            </div>
                        )}

                        {isBrave && (
                            <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 px-4 py-3 text-left text-sm text-blue-100">
                                Brave is intermittently breaking the Web3Auth modal UI. Use the direct sign-in option below if the modal opens blank.
                            </div>
                        )}

                        <Button
                            onClick={handleLogin}
                            disabled={isConnecting}
                            className="w-full h-11 relative overflow-hidden group bg-white text-black hover:bg-zinc-200 transition-all font-medium rounded-xl"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Wallet className="w-4 h-4" />
                                <span>{isConnecting ? "Opening Wallet..." : "Connect Wallet"}</span>
                            </div>
                        </Button>

                        {isBrave && (
                            <Button
                                onClick={() => handleDirectAuthLogin("google")}
                                disabled={isConnecting}
                                variant="outline"
                                className="w-full h-11 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10"
                            >
                                Continue with Google
                            </Button>
                        )}

                        {isBrave && (
                            <Button
                                onClick={handleResetSession}
                                disabled={isConnecting}
                                variant="ghost"
                                className="w-full h-11 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                            >
                                Reset Wallet Session
                            </Button>
                        )}

                        <Button
                            onClick={() => onOpenChange(false)}
                            variant="ghost"
                            className="w-full h-11 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                        >
                            Maybe later
                        </Button>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute right-4 top-4 p-2 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-colors z-20"
                >
                    <X className="w-4 h-4" />
                </button>
            </DialogContent>
        </Dialog>
    );
}
