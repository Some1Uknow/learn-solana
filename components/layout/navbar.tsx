"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NavbarBranding } from "./navbar/branding";
import { NavbarGithub } from "./navbar/github";
import { NavbarLinks, OpportunityNavbarLinks } from "./navbar/links";
import { NavbarWalletButton } from "./navbar/wallet-button";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav
        data-site-nav
        aria-label="Primary navigation"
        className="fixed inset-x-0 top-0 z-50 hidden border-b border-[#292929] bg-[#060606]/95 backdrop-blur-sm lg:block"
      >
        <div className="ds-shell flex min-h-16 items-center gap-5">
          <div className="shrink-0">
            <NavbarBranding />
          </div>

          <div className="flex min-w-0 flex-1 items-center gap-1">
            <NavbarLinks />
            <OpportunityNavbarLinks />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <NavbarGithub />
            <NavbarWalletButton />
          </div>
        </div>
      </nav>

      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 top-0 z-50 border-b border-[#292929] bg-[#060606]/95 backdrop-blur-sm lg:hidden"
      >
        <div className="mx-auto w-[calc(100vw-32px)] max-w-[1200px]">
          <div className="flex min-h-16 items-center justify-between gap-4">
            <NavbarBranding />
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-site-navigation"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="ds-focus-ring inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#292929] bg-transparent text-[#a0a0a0] transition-colors duration-150 hover:bg-[#181818] hover:text-[#fcfcfc]"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div
            id="mobile-site-navigation"
            className="max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-[#292929] bg-[#060606]"
          >
            <div className="mx-auto grid w-[calc(100vw-32px)] max-w-[1200px] gap-5 py-4">
              <NavbarLinks isMobile onNavigate={() => setIsMenuOpen(false)} />

              <div className="border-t border-[#292929] pt-4">
                <p className="mb-2 px-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[#a0a0a0]">
                  Opportunities
                </p>
                <OpportunityNavbarLinks isMobile onNavigate={() => setIsMenuOpen(false)} />
              </div>

              <div className="grid gap-2 border-t border-[#292929] pt-4">
                <NavbarGithub isMobile />
                <NavbarWalletButton isMobile />
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
