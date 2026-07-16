"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { NavbarBranding } from "./navbar/branding";
import { NavbarLinks, OpportunityNavbarLinks } from "./navbar/links";
import { NavbarGithub } from "./navbar/github";
import { NavbarWalletButton } from "./navbar/wallet-button";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();

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

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  return (
    <>
      <nav data-site-nav className="fixed inset-x-0 top-0 z-50 hidden border-b border-white/[0.06] bg-[#070809]/92 backdrop-blur-xl lg:block">
        <div className="relative mx-auto flex min-h-20 w-[min(1240px,calc(100vw-64px))] items-center justify-between gap-4">
          <div className="flex shrink-0 items-center gap-3">
            <NavbarBranding />
            <NavbarGithub />
          </div>

          <div className="absolute left-1/2 flex -translate-x-1/2 items-center gap-1">
            <NavbarLinks />
            <span className="mx-1 h-4 w-px bg-white/[0.1]" aria-hidden="true" />
            <OpportunityNavbarLinks />
          </div>

          <div className="shrink-0">
            <NavbarWalletButton />
          </div>
        </div>
      </nav>

      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.04] bg-[linear-gradient(180deg,rgba(4,4,4,0.94),rgba(4,4,4,0.82))] backdrop-blur-xl lg:hidden">
        <div className="mx-auto w-[min(100vw-28px,1240px)]">
          <div className="flex min-h-[76px] items-center justify-between">
            <NavbarBranding />

            <Button
              variant="ghost"
              className="h-10 w-10 rounded-full border border-white/[0.08] bg-white/[0.02] p-0 text-white/70 hover:bg-white/[0.05] hover:text-white"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-site-navigation"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
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
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
              id="mobile-site-navigation"
              className="max-h-[calc(100dvh-76px)] overflow-y-auto border-t border-white/[0.08] bg-[#070809]/98 backdrop-blur-xl"
            >
              <div className="mx-auto w-[min(100vw-28px,1240px)] py-3">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-3">
                  <nav aria-label="Primary navigation" className="grid grid-cols-2 gap-1">
                    <NavbarLinks isMobile onNavigate={() => setIsMenuOpen(false)} />
                  </nav>
                  <div className="mt-3 border-t border-white/[0.08] pt-3">
                    <p className="px-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a9ff2f]/80">Opportunities</p>
                    <nav aria-label="Opportunity navigation" className="mt-2 grid grid-cols-2 gap-1">
                      <OpportunityNavbarLinks isMobile onNavigate={() => setIsMenuOpen(false)} />
                    </nav>
                  </div>
                  <div className="mt-3 border-t border-white/[0.08] pt-3">
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
