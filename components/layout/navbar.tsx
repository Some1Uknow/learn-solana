"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X, Wallet, Github, Star } from "lucide-react";

// Navigation data
const navigationItems = [
  { label: "Learn", href: "/learn" },
  { label: "Games", href: "/games" },
  { label: "Projects", href: "/projects" },
  { label: "Jobs", href: "/jobs" },
];

// Logo configuration
const logoConfig = {
  text: "learn.sol",
  href: "/",
  showPulse: true,
  pulseColor: "bg-[#14F195]",
};

// Button configuration
const walletButtonConfig = {
  text: "Connect Wallet",
  icon: Wallet,
  gradientFrom: "#14F195",
  gradientTo: "#9945FF",
};

// GitHub configuration
const githubConfig = {
  repoName: "learn.sol-main",
  owner: "your-username", // Replace with actual GitHub username
  fullRepoName: "learn.sol-main",
  url: "https://github.com/your-username/learn.sol-main", // Replace with actual repo URL
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [githubStars, setGithubStars] = useState<number | null>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleWalletConnect = () => {
    // TODO: Implement wallet connection logic
    console.log("Connecting wallet...");
  };

  // Fetch GitHub stars (optional - you can replace with static number)
  const fetchGithubStars = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/repos/${githubConfig.owner}/${githubConfig.repoName}`
      );
      const data = await response.json();
      setGithubStars(data.stargazers_count || 0);
    } catch (error) {
      console.error("Error fetching GitHub stars:", error);
      setGithubStars(42); // Fallback number
    }
  };
  // Fetch stars on component mount
  useEffect(() => {
    fetchGithubStars();
  }, []);  const renderNavButton = (
    item: (typeof navigationItems)[0],
    isMobile = false
  ) => {
    if (item.href.startsWith("#")) {
      return (
        <Button
          key={item.label}
          variant="ghost"
          onClick={() =>
            document
              .querySelector(item.href)
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className={`text-white/80 hover:text-white hover:bg-transparent transition-all duration-300 relative group h-10 px-4 ${
            isMobile ? "w-full justify-start" : ""
          }`}
        >
          <span className="relative z-10">{item.label}</span>
          {!isMobile && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-[#14F195] to-[#9945FF] group-hover:w-full transition-all duration-300" />
          )}
        </Button>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href}
        className={isMobile ? "w-full" : ""}
      >
        <Button
          variant="ghost"
          className={`text-white/80 hover:text-white hover:bg-transparent transition-all duration-300 relative group h-10 px-4 ${
            isMobile ? "w-full justify-start" : ""
          }`}
        >
          <span className="relative z-10">{item.label}</span>
          {!isMobile && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-[#14F195] to-[#9945FF] group-hover:w-full transition-all duration-300" />
          )}
        </Button>
      </Link>
    );
  };

  return (
    <nav className="w-full max-w-7xl mx-auto relative z-20">
      <div className="flex items-center justify-between px-6 md:px-10 py-3">
        {/* Logo (unchanged) */}
        <Link
          href={logoConfig.href}
          className="flex items-center gap-2 group min-w-[120px]"
        >
          <span className="text-xl font-bold font-grotesk">
            {logoConfig.text}
          </span>
          {logoConfig.showPulse && (
            <div
              className={`h-2 w-2 rounded-full ${logoConfig.pulseColor} animate-pulse`}
            />
          )}
        </Link>

        {/* Centered navigation (desktop) */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex items-center gap-2">
            {navigationItems.map((item) => (
              <div key={item.label} className="relative group">
                {renderNavButton(item)}
              </div>
            ))}
          </div>
        </div>

        {/* CTA and GitHub (desktop) */}
        <div className="hidden md:flex items-center gap-3 min-w-[220px] justify-end">
          <Link
            href={githubConfig.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="flex items-center gap-2 h-10 px-4 rounded-full"
            >
              <Github size={16} />
              <div className="flex items-center gap-1">
                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-semibold">
                  {githubStars || "..."}
                </span>
              </div>
            </Button>
          </Link>
          <Button
            onClick={handleWalletConnect}
            className="relative overflow-hidden bg-[#14F195] hover:bg-[#12d182] text-black font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#14F195]/25 flex items-center gap-2 h-10 px-6 rounded-full"
          >
            <walletButtonConfig.icon size={18} className="relative z-10" />
            <span className="relative z-10">{walletButtonConfig.text}</span>
          </Button>
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
            {navigationItems.map((item) => (
              <div key={item.label} className="relative group">
                {renderNavButton(item, true)}
              </div>
            ))}
            <div className="pt-2 border-t border-white/10 space-y-2">
              {/* GitHub Button Mobile */}
              <Link
                href={githubConfig.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 h-10"
                >
                  <Github size={16} />
                  <div className="flex items-center gap-1">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-semibold">
                      {githubStars || "..."}
                    </span>
                  </div>
                </Button>
              </Link>
              {/* Connect Wallet Button Mobile */}
              <Button
                onClick={handleWalletConnect}
                className="w-full bg-[#14F195] hover:bg-[#12d182] text-black font-semibold hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 h-10 rounded-full"
              >
                <walletButtonConfig.icon size={18} />
                {walletButtonConfig.text}
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
