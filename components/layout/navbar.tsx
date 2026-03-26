"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavbarBranding } from "./navbar/branding";
import { NavbarLinks } from "./navbar/links";
import { NavbarGithub } from "./navbar/github";
import { NavbarWalletButton } from "./navbar/wallet-button";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isMenuOpen]);

  return (
    <>
      {/* Desktop Navbar - Floating Pill */}
      <nav
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 z-50",
          "hidden md:block",
          "w-[calc(100%-2rem)] max-w-4xl",
          "rounded-full",
          "bg-neutral-950/70 backdrop-blur-xl",
          "border border-white/[0.08]",
          "shadow-[0_4px_30px_rgba(0,0,0,0.3),inset_0_0_0_1px_rgba(255,255,255,0.03)]"
        )}
      >
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-14 px-5">
          {/* Left: Logo + GitHub */}
          <div className="justify-self-start flex items-center gap-3">
            <NavbarBranding />
            <NavbarGithub />
          </div>

          {/* Center: Links (true visual center) */}
          <div className="flex items-center">
            <NavbarLinks />
          </div>

          {/* Right: Wallet Button */}
          <div className="justify-self-end">
            <NavbarWalletButton />
          </div>
        </div>
      </nav>

      {/* Mobile Navbar - Fixed Top Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 md:hidden border-b border-white/[0.08] bg-black/80 backdrop-blur-xl">
        <div className="px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Left: Logo */}
            <NavbarBranding />

            {/* Right: Menu Toggle */}
            <Button
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-white/5 h-9 w-9 p-0"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-white/[0.08] bg-black/95 backdrop-blur-xl"
            >
              <div className="px-4 py-4 space-y-4">
                <nav className="flex flex-col gap-1">
                  <NavbarLinks isMobile onNavigate={() => setIsMenuOpen(false)} />
                </nav>
                <div className="pt-2 border-t border-white/[0.08]">
                  <NavbarWalletButton isMobile />
                </div>
                <div>
                  <NavbarGithub isMobile />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
