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
      <div className="relative flex items-center justify-between px-6 md:px-10 py-3">
        {/* Left: Logo */}
        <div className="flex-shrink-0 z-20 flex-row flex">
          <NavbarBranding />
           <NavbarGithub />
        </div>

        {/* Center: Links (true centered, no overlap) */}
        <div className="absolute inset-x-0 flex justify-center pointer-events-none">
          <div className="hidden md:flex pointer-events-auto">
            <NavbarLinks />
          </div>
        </div>

        {/* Right: Buttons and Product Hunt */}
        <div className="hidden md:flex items-center gap-2 min-w-[220px] justify-end z-20">
         
          <NavbarWalletButton />
          <a
            href="https://www.producthunt.com/products/learn-sol"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
            aria-label="View learn.sol on Product Hunt"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1022706&theme=dark"
              alt="learn.sol - Learn Solana Development with ease | Product Hunt"
              width="185"
              height="40"
              className="h-10 w-[185px]"
            />
          </a>
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
    </nav>
  );
}
