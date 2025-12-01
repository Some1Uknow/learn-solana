"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NavbarBranding } from "./navbar/branding";
import { NavbarLinks } from "./navbar/links";
import { NavbarGithub } from "./navbar/github";
import { NavbarWalletButton } from "./navbar/wallet-button";

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
    <nav className="w-full max-w-7xl mx-auto relative z-20">
      <div className="relative flex items-center justify-between px-6 md:px-10 py-3">
        {/* Left: Logo */}
        <div className="shrink-0 z-20 flex-row flex">
          <NavbarBranding />
           <NavbarGithub />
        </div>

        {/* Center: Links (true centered, no overlap) */}
        <div className="absolute inset-x-0 flex justify-center pointer-events-none">
          <div className="hidden md:flex pointer-events-auto">
            <NavbarLinks />
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="hidden md:flex items-center gap-2 justify-end z-20">
          <NavbarWalletButton />
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center z-20">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 transition-colors duration-300 h-10 w-10 p-0 flex items-center justify-center"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={toggleMenu} />
          {/* Sheet */}
          <div className="absolute top-0 left-0 right-0 bg-[#0d1117] border-b border-white/10 pt-16 pb-6 px-6">
            {/* Close button (in case backdrop is covered) */}
            <button
              aria-label="Close menu"
              onClick={toggleMenu}
              className="absolute top-3 right-4 h-10 w-10 grid place-items-center rounded-md hover:bg-white/10 text-white"
            >
              <X size={22} />
            </button>

            <div className="space-y-4">
              <nav className="flex flex-col gap-1">
                <NavbarLinks isMobile />
              </nav>
              <div>
                <NavbarWalletButton isMobile />
              </div>
              <div>
                <NavbarGithub isMobile />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
