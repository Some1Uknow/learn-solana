"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
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

  return (
    <nav className="w-full max-w-7xl mx-auto relative z-20">
      <div className="flex items-center justify-between px-6 md:px-10 py-3">
        {/* Logo */}
        <NavbarBranding />

        {/* Centered navigation (desktop) */}
        <NavbarLinks />

        {/* CTA and GitHub (desktop) */}
        <div className="hidden md:flex items-center gap-3 min-w-[220px] justify-end">
          <NavbarGithub />
          <NavbarWalletButton />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/10 transition-colors duration-300 h-10 w-10 p-0 flex items-center justify-center"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 mt-2 mx-2 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg overflow-hidden z-30">
          <div className="flex flex-col p-4 space-y-2">
            <NavbarLinks isMobile={true} />
            <div className="pt-2 border-t border-white/10 space-y-2">
              {/* GitHub Button Mobile */}
              <NavbarGithub isMobile={true} />
              {/* Connect Wallet Button Mobile */}
              <NavbarWalletButton isMobile={true} />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}