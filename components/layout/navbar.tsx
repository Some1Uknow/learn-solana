"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Menu, X, Wallet, Github, Star, LogOut, User, Copy, ExternalLink, UserPlus, UserCheck, Shield } from "lucide-react";
import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
  useWeb3Auth,
} from "@web3auth/modal/react";
import { getSolanaKeypair, getSolanaAddress } from "@/lib/solana-utils";

// Navigation data
const navigationItems = [
  { label: "Learn", href: "/modules" },
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
const authButtonConfig = {
  login: {
    text: "Sign Up / Login",
    icon: UserPlus,
  },
  logout: {
    text: "Logout",
    icon: LogOut,
  },
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
  const [userAddress, setUserAddress] = useState<string>("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Web3Auth hooks
  const {
    connect,
    isConnected,
    loading: connectLoading,
    error: connectError,
  } = useWeb3AuthConnect();
  
  const {
    disconnect,
    loading: disconnectLoading,
  } = useWeb3AuthDisconnect();
  
  const { userInfo } = useWeb3AuthUser();
  const { provider } = useWeb3Auth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle wallet connection
  const handleWalletConnect = async () => {
    if (isConnected) {
      // If connected, disconnect
      await disconnect();
      setUserAddress("");
    } else {
      // If not connected, connect
      await connect();
    }
  };

  // Get Solana address when connected
  const getSolanaAddressFromWeb3Auth = async () => {
    console.log("🚀 Getting Solana address...", { provider: !!provider, isConnected });
    try {
      if (!provider || !isConnected) return;

      // Get Ed25519 private key from Web3Auth
      const ed25519PrivKey = await provider.request({
        method: "solanaPrivateKey",
      }) as string;

      console.log("✅ Got Ed25519 key length:", ed25519PrivKey?.length);

      if (ed25519PrivKey) {
        // Generate Solana keypair and address
        const keypair = getSolanaKeypair(ed25519PrivKey);
        const address = getSolanaAddress(keypair);
        console.log("🔑 Generated Solana address:", address);
        setUserAddress(address);
      } else {
        console.error("❌ No Ed25519 private key received");
      }
    } catch (error) {
      console.error("❌ Error getting Solana address:", error);
    }
  };

  // Get address when connected
  useEffect(() => {
    console.log("🔍 Auth Debug:", { isConnected, provider: !!provider, userAddress });
    if (isConnected && provider && !userAddress) {
      getSolanaAddressFromWeb3Auth();
    }
  }, [isConnected, provider, userAddress]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showUserMenu) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  // Fetch stars on component mount
  useEffect(() => {
    fetchGithubStars();
  }, []);

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
  // Helper function to truncate address
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Copy address to clipboard
  const copyAddress = async () => {
    if (userAddress) {
      try {
        await navigator.clipboard.writeText(userAddress);
        // You could add a toast notification here
        console.log("Address copied to clipboard");
      } catch (error) {
        console.error("Failed to copy address:", error);
      }
    }
  };

  // Open Solana Explorer
  const openExplorer = () => {
    if (userAddress) {
      window.open(
        `https://explorer.solana.com/address/${userAddress}?cluster=devnet`,
        "_blank"
      );
    }
  };

  // Render user avatar or icon
  const renderUserAvatar = (size = 18) => {
    if (userInfo?.profileImage) {
      return (
        <img
          src={userInfo.profileImage}
          alt="Profile"
          className={`w-${size === 18 ? '5' : '4'} h-${size === 18 ? '5' : '4'} rounded-full object-cover`}
        />
      );
    }
    return <UserCheck size={size} className="relative z-10" />;
  };

  // Render auth button based on connection status
  const renderWalletButton = (isMobile = false) => {
    const isLoading = connectLoading || disconnectLoading;
    
    if (isConnected && userAddress) {
      // Connected state
      if (isMobile) {
        return (
          <div className="space-y-2">
            {/* User info display for mobile */}
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                {renderUserAvatar(16)}
                <span className="text-sm font-medium text-green-500">Connected</span>
              </div>
              <div className="text-xs text-gray-400 mb-2">
                {userInfo?.email || userInfo?.name || "Anonymous User"}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono bg-gray-800 px-2 py-1 rounded">
                  {truncateAddress(userAddress)}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyAddress}
                  className="h-6 w-6 p-0"
                >
                  <Copy size={12} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={openExplorer}
                  className="h-6 w-6 p-0"
                >
                  <ExternalLink size={12} />
                </Button>
              </div>
            </div>
            <Button
              onClick={handleWalletConnect}
              disabled={isLoading}
              variant="outline"
              className="w-full flex items-center justify-center gap-2 h-10 text-red-500 border-red-500/20 hover:bg-red-500/10"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-500 border-t-transparent" />
              ) : (
                <authButtonConfig.logout.icon size={16} />
              )}
              <span>{isLoading ? "Logging out..." : authButtonConfig.logout.text}</span>
            </Button>
          </div>
        );
      }

      // Desktop connected state with dropdown
      return (
        <div className="relative">
          <Button
            onClick={() => setShowUserMenu(!showUserMenu)}
            disabled={isLoading}
            className="relative overflow-hidden bg-green-500 hover:bg-green-600 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2 h-10 px-4 rounded-full"
          >
            {renderUserAvatar(18)}
            <span className="relative z-10">
              {truncateAddress(userAddress)}
            </span>
          </Button>

          {/* Dropdown menu */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg z-50">
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  {renderUserAvatar(16)}
                  <div>
                    <div className="text-sm font-medium">
                      {userInfo?.email || userInfo?.name || "Anonymous User"}
                    </div>
                    <div className="text-xs text-gray-400">Connected via Web3Auth</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-400 mb-1">Solana Address</div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono bg-gray-800 px-2 py-1 rounded flex-1">
                      {userAddress}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={copyAddress}
                      className="h-6 w-6 p-0 hover:bg-white/10"
                    >
                      <Copy size={12} />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={openExplorer}
                    className="flex-1 h-8 text-xs"
                  >
                    <ExternalLink size={12} className="mr-1" />
                    Explorer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleWalletConnect}
                    disabled={isLoading}
                    className="flex-1 h-8 text-xs text-red-400 border-red-400/20 hover:bg-red-400/10"
                  >
                    <authButtonConfig.logout.icon size={12} className="mr-1" />
                    {isLoading ? "..." : authButtonConfig.logout.text}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // Disconnected state
    return (
      <Button
        onClick={handleWalletConnect}
        disabled={isLoading}
        className={`relative overflow-hidden bg-[#14F195] hover:bg-[#12d182] text-black font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#14F195]/25 flex items-center gap-2 h-10 px-6 rounded-full ${
          isMobile ? "w-full justify-center" : ""
        } ${isLoading ? "opacity-75" : ""}`}
      >
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
        ) : (
          <authButtonConfig.login.icon size={18} className="relative z-10" />
        )}
        <span className="relative z-10">
          {isLoading ? "Signing in..." : authButtonConfig.login.text}
        </span>
      </Button>
    );
  };

  // Fetch stars on component mount
  useEffect(() => {
    fetchGithubStars();
  }, []);

  const renderNavButton = (
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
          {renderWalletButton()}
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
              {renderWalletButton(true)}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
