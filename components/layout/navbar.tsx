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
      <nav className="fixed inset-x-0 top-0 z-50 hidden md:block border-b border-white/[0.04] bg-[linear-gradient(180deg,rgba(4,4,4,0.92),rgba(4,4,4,0.72))] backdrop-blur-xl">
        <div className="mx-auto flex min-h-[84px] w-[min(1240px,calc(100vw-80px))] items-center justify-between gap-6">
          <div className="flex min-w-0 items-center gap-3">
            <NavbarBranding />
            <NavbarGithub />
          </div>

          <div className="flex flex-1 items-center justify-center">
            <NavbarLinks />
          </div>

          <div className="flex min-w-0 justify-end">
            <NavbarWalletButton />
          </div>
        </div>
      </nav>

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.04] bg-[linear-gradient(180deg,rgba(4,4,4,0.94),rgba(4,4,4,0.82))] backdrop-blur-xl md:hidden">
        <div className="mx-auto w-[min(100vw-28px,1240px)]">
          <div className="flex min-h-[76px] items-center justify-between">
            <NavbarBranding />

            <Button
              variant="ghost"
              className="h-10 w-10 rounded-full border border-white/[0.08] bg-white/[0.02] p-0 text-white/70 hover:bg-white/[0.05] hover:text-white"
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
              <div className="mx-auto w-[min(100vw-28px,1240px)] py-4">
                <div className="rounded-[28px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(15,15,15,0.98),rgba(8,8,8,0.98))] p-4 shadow-[0_24px_64px_rgba(0,0,0,0.42)]">
                <nav className="flex flex-col gap-1">
                  <NavbarLinks isMobile onNavigate={() => setIsMenuOpen(false)} />
                </nav>
                <div className="mt-4 border-t border-white/[0.08] pt-4">
                  <NavbarWalletButton isMobile />
                </div>
                <div className="mt-3">
                  <NavbarGithub isMobile />
                </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
