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
        className="ls-site-nav sticky top-3 z-50 my-3 hidden rounded-full border border-[#dedede] bg-[#f5f5f5]/95 backdrop-blur-lg min-[1180px]:block"
      >
        <div className="ls-site-nav-shell grid min-h-[72px] grid-cols-[1fr_auto_1fr] items-center gap-6">
          <div className="min-w-0 justify-self-start">
            <NavbarBranding />
          </div>

          <div className="flex min-w-0 items-center justify-center gap-1">
            <NavbarLinks />
            <OpportunityNavbarLinks />
          </div>

          <div className="flex shrink-0 items-center gap-2 justify-self-end">
            <NavbarGithub />
            <NavbarWalletButton />
          </div>
        </div>
      </nav>

      <nav
        aria-label="Mobile navigation"
        className={`ls-site-nav sticky top-3 z-50 my-3 border border-[#dedede] bg-[#f5f5f5]/95 backdrop-blur-lg min-[1180px]:hidden ${
          isMenuOpen ? "rounded-[28px] overflow-hidden" : "rounded-full"
        }`}
      >
        <div className="ls-site-nav-mobile-shell">
          <div className="flex min-h-16 items-center justify-between gap-4">
            <NavbarBranding />
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-site-navigation"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              className="ds-focus-ring inline-flex h-10 w-10 items-center justify-center rounded-[6px] border border-[#dedede] bg-white text-[#636363] transition-colors duration-150 hover:bg-[#efefef] hover:text-[#181818]"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div
            id="mobile-site-navigation"
            className="max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-[#dedede] bg-[#f5f5f5]"
          >
            <div className="ls-site-nav-mobile-shell grid gap-5 py-4">
              <NavbarLinks isMobile onNavigate={() => setIsMenuOpen(false)} />

              <div className="border-t border-[#dedede] pt-4">
                <p className="mb-2 px-3 font-mono text-[11px] uppercase tracking-[0.08em] text-[#636363]">
                  Opportunities
                </p>
                <OpportunityNavbarLinks isMobile onNavigate={() => setIsMenuOpen(false)} />
              </div>

              <div className="grid gap-2 border-t border-[#dedede] pt-4">
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
