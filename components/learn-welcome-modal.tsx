"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bot, Sparkles, X } from "lucide-react";
import { useChatContext } from "@/components/chat-context";

export function LearnWelcomeModal() {
    const [open, setOpen] = useState(false);
    const { setIsOpen: setChatOpen } = useChatContext();

    useEffect(() => {
        // Check if we've shown the modal before
        const hasShown = sessionStorage.getItem("learn_welcome_shown");

        if (!hasShown) {
            // Show after a short delay
            const timer = setTimeout(() => {
                setOpen(true);
                sessionStorage.setItem("learn_welcome_shown", "true");
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleStartLearning = () => {
        setOpen(false);
        setChatOpen(true);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-sm translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/10 bg-black/80 backdrop-blur-xl p-0 shadow-2xl duration-200 sm:rounded-2xl overflow-hidden">
                {/* Animated Gradient Border Effect */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-2xl">
                    <div className="absolute -inset-[100%] animate-[spin_5s_linear_infinite] bg-[conic-gradient(from_0deg,transparent_0deg,transparent_140deg,rgba(34,211,238,0.5)_160deg,rgba(153,69,255,0.5)_200deg,transparent_220deg,transparent_360deg)] opacity-60" />
                </div>

                {/* Inner Content Background - slightly smaller to show border */}
                <div className="absolute inset-[1px] z-0 bg-[#07090c] rounded-[15px]" />

                <div className="relative z-10 flex flex-col p-6 items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 shrink-0 relative">
                        <Bot className="w-6 h-6 text-cyan-400" />
                        <div className="absolute -top-1 -right-1">
                            <Sparkles className="w-3 h-3 text-yellow-300 animate-pulse" />
                        </div>
                    </div>

                    <DialogTitle className="text-lg font-bold text-white mb-2">
                        Need Help Learning?
                    </DialogTitle>

                    <DialogDescription className="text-zinc-400 text-sm mb-6">
                        Our AI Assistant is trained on all the documentation. Ask questions, get code examples, and learn faster.
                    </DialogDescription>

                    <div className="flex flex-col gap-2 w-full">
                        <Button
                            onClick={handleStartLearning}
                            className="w-full h-10 bg-cyan-400 hover:bg-cyan-300 text-black font-medium rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(34,211,238,0.4)]"
                        >
                            Try AI Assistant
                        </Button>

                        <Button
                            onClick={() => setOpen(false)}
                            variant="ghost"
                            className="w-full h-10 text-zinc-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-xs"
                        >
                            No thanks, I'll read on my own
                        </Button>
                    </div>
                </div>

                {/* Close Button */}
                <button
                    onClick={() => setOpen(false)}
                    className="absolute right-4 top-4 p-2 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-colors z-20"
                >
                    <X className="w-4 h-4" />
                </button>
            </DialogContent>
        </Dialog>
    );
}
