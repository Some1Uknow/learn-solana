"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavbarBranding } from "./navbar/branding";
import { NavbarLinks } from "./navbar/links";
import { NavbarGithub } from "./navbar/github";
import { NavbarWalletButton } from "./navbar/wallet-button";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    setHasAnimated(true);
  }, []);

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
    <motion.nav
      initial={{ y: -100, opacity: 0, filter: "blur(10px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 20,
        duration: 0.8,
      }}
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-6xl z-50"
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
        className="relative flex items-center justify-between px-6 md:px-8 py-3 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-lg shadow-black/20"
      >
        {/* Left: Logo */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="shrink-0 z-20 flex-row flex"
        >
          <NavbarBranding />
           <NavbarGithub />
        </motion.div>

        {/* Center: Links (true centered, no overlap) */}
        <div className="absolute inset-x-0 flex justify-center pointer-events-none">
          <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
            className="hidden md:flex pointer-events-auto"
          >
            <NavbarLinks />
          </motion.div>
        </div>

        {/* Right: Buttons */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
          className="hidden md:flex items-center gap-2 justify-end z-20"
        >
          <NavbarWalletButton />
        </motion.div>

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
      </motion.div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60"
              onClick={toggleMenu}
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 left-0 right-0 bg-[#0d1117] border-b border-white/10 pt-16 pb-6 px-6"
            >
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
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </motion.nav>
  );
}
