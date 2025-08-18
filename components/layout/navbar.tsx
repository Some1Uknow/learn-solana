"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { Menu, X, Github, Star, LogOut, Copy, ExternalLink, UserPlus, UserCheck } from "lucide-react";
import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
  useWeb3Auth,
} from "@web3auth/modal/react";
import { SolanaWallet } from "@web3auth/solana-provider";
import { PublicKey } from "@solana/web3.js";

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
  owner: "Some1Uknow",
  fullRepoName: "learn.sol-main",
  url: "https://github.com/Some1Uknow/learn.sol-main",
};

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [githubStars, setGithubStars] = useState<number | null>(null);
  const [userAddress, setUserAddress] = useState<string>("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  // WORKAROUND for Web3Auth SSR bug: Store recovered userInfo
  const [recoveredUserInfo, setRecoveredUserInfo] = useState<any>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Web3Auth hooks
  const {
    connect,
    isConnected,
    loading: connectLoading,
  } = useWeb3AuthConnect();
  
  const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect();
  const { userInfo } = useWeb3AuthUser();
  const { provider, web3Auth } = useWeb3Auth();

  const solanaWallet = useMemo(() => {
    if (provider) {
      return new SolanaWallet(provider);
    }
    return null;
  }, [provider]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle client-side hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Manual userInfo recovery for SSR bug
  useEffect(() => {
    if (isHydrated && isConnected && !userInfo && web3Auth) {
      const recoverUserInfo = async () => {
        try {
          const manualUserInfo = await web3Auth.getUserInfo();
          setRecoveredUserInfo(manualUserInfo);
          
          if (manualUserInfo && !userAddress && !isLoadingAddress) {
            getSolanaAddressFromWeb3Auth();
          }
        } catch (error) {
          console.log("Failed to recover userInfo:", error);
        }
      };
      
      const timer = setTimeout(recoverUserInfo, 1000);
      return () => clearTimeout(timer);
    }
  }, [isHydrated, isConnected, userInfo, web3Auth, userAddress, isLoadingAddress]);

  // Handle wallet connection
  const handleWalletConnect = async () => {
    if (isConnected) {
      await disconnect();
      setUserAddress("");
      setIsLoadingAddress(false);
    } else {
      setIsLoadingAddress(false);
      await connect();
    }
  };

 const getSolanaAddressFromWeb3Auth = async () => {
    try {
      setIsLoadingAddress(true);

      // Manual state recovery for SSR hydration issues
      let currentUserInfo = userInfo || recoveredUserInfo;
      let currentProvider = provider;
      
      // If hooks return null after hydration, try manual recovery
      if (!currentUserInfo && web3Auth && isConnected) {
        try {
          currentUserInfo = await web3Auth.getUserInfo();
          setRecoveredUserInfo(currentUserInfo);
        } catch (error) {
          // Silent fail
        }
      }
      
      if (!currentProvider && web3Auth && isConnected) {
        try {
          currentProvider = web3Auth.provider;
        } catch (error) {
          // Silent fail
        }
      }

      if (!currentProvider) {
        setIsLoadingAddress(false);
        return;
      }

      // First, try to extract the public key from userInfo (if available)
      if (currentUserInfo && typeof currentUserInfo === "object") {
        const userInfoObj = currentUserInfo as any;

        if (userInfoObj.wallets && Array.isArray(userInfoObj.wallets)) {
          const solanaWalletInfo = userInfoObj.wallets.find(
            (w: any) => w.curve === "ed25519" || w.type === "web3auth_app_key"
          );

          if (solanaWalletInfo && solanaWalletInfo.public_key) {
            try {
              let publicKeyBytes;
              if (solanaWalletInfo.public_key.startsWith("0x")) {
                const hexString = solanaWalletInfo.public_key.slice(2);
                publicKeyBytes = new Uint8Array(Buffer.from(hexString, "hex"));
              } else {
                publicKeyBytes = new Uint8Array(
                  Buffer.from(solanaWalletInfo.public_key, "hex")
                );
              }

              const publicKey = new PublicKey(publicKeyBytes);
              const address = publicKey.toBase58();

              setUserAddress(address);
              setIsLoadingAddress(false);
              return;
            } catch (conversionError) {
              // Continue to next method
            }
          }
        }
      }

      // Try getAccounts method
      try {
        const publicKey = await currentProvider.request({
          method: "getAccounts",
          params: {},
        });

        if (publicKey) {
          let address: string;
          if (Array.isArray(publicKey) && publicKey.length > 0) {
            address = publicKey[0];
          } else if (typeof publicKey === "string") {
            address = publicKey;
          } else {
            throw new Error("Unexpected public key format");
          }

          setUserAddress(address);
          setIsLoadingAddress(false);
          return;
        }
      } catch (getAccountsError) {
        // Try SolanaWallet method
        if (solanaWallet) {
          try {
            const walletAccounts = await solanaWallet.requestAccounts();
            if (walletAccounts && walletAccounts.length > 0) {
              const address = walletAccounts[0];
              setUserAddress(address);
              setIsLoadingAddress(false);
              return;
            }
          } catch (walletError) {
            // Silent fail
          }
        }
      }
    } catch (error) {
      // Silent fail - will retry automatically
    } finally {
      setIsLoadingAddress(false);
    }
  };


  // Get address when connected
  useEffect(() => {
    if (!isHydrated) return;
    
    if (!isConnected) {
      setIsLoadingAddress(false);
      return;
    }
    
    if (isConnected && !userAddress && !isLoadingAddress) {
      const hasProviderOrUserInfo = !!(provider || userInfo || recoveredUserInfo);
      
      if (hasProviderOrUserInfo) {
        getSolanaAddressFromWeb3Auth();
      } else {
        const retryTimer = setTimeout(() => {
          if (isConnected && !userAddress && !isLoadingAddress) {
            getSolanaAddressFromWeb3Auth();
          }
        }, 2000);
        
        return () => clearTimeout(retryTimer);
      }
    }
  }, [isHydrated, isConnected, provider, userInfo, recoveredUserInfo, userAddress, isLoadingAddress]);

  // Clear address when disconnected
  useEffect(() => {
    if (!isConnected && (userAddress || isLoadingAddress)) {
      setUserAddress("");
      setIsLoadingAddress(false);
    }
  }, [isConnected, userAddress, isLoadingAddress]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if the click is outside the dropdown and the trigger button
      if (showUserMenu && target) {
        // Find the dropdown container and button
        const dropdown = target.closest('[data-dropdown-menu]');
        const button = target.closest('[data-dropdown-trigger]');
        
        // Only close if clicking outside both the dropdown and trigger button
        if (!dropdown && !button) {
          setShowUserMenu(false);
        }
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
      setGithubStars(42); // Fallback number
    }
  };

  // Helper function to truncate address
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const copyAddress = async () => {
    if (userAddress) {
      try {
        await navigator.clipboard.writeText(userAddress);
      } catch (error) {
        // Silent fail
      }
    }
  };

  // Open Solana Explorer
  const openExplorer = () => {
    if (userAddress) {
      const explorerUrl = `https://explorer.solana.com/address/${userAddress}?cluster=devnet`;
      window.open(explorerUrl, "_blank");
    }
  };

  // Render user avatar or icon
  const renderUserAvatar = (size = 18) => {
    const currentUserInfo = recoveredUserInfo || userInfo;
    if (currentUserInfo?.profileImage) {
      return (
        <img
          src={currentUserInfo.profileImage}
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
    const currentUserInfo = recoveredUserInfo || userInfo;
    
    // Show loading state until hydrated or while loading address
    if (!isHydrated || (isConnected && !userAddress) || isLoadingAddress) {
      return (
        <Button
          disabled={true}
          className={`relative overflow-hidden bg-yellow-500 text-black font-semibold flex items-center gap-2 h-10 px-6 rounded-full opacity-75 ${
            isMobile ? "w-full justify-center" : ""
          }`}
        >
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
          <span className="relative z-10">Loading...</span>
        </Button>
      );
    }
    
    // If connected and we have a wallet address, show connected state
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
                {currentUserInfo?.email || currentUserInfo?.name || "Anonymous User"}
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
            data-dropdown-trigger
            className="relative overflow-hidden bg-green-500 hover:bg-green-600 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25 flex items-center gap-2 h-10 px-4 rounded-full"
          >
            {renderUserAvatar(18)}
            <span className="relative z-10">
              {truncateAddress(userAddress)}
            </span>
          </Button>

          {/* Dropdown menu */}
          {showUserMenu && (
            <div 
              data-dropdown-menu
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 mt-2 w-64 bg-black/90 backdrop-blur-md border border-white/10 rounded-lg shadow-lg z-[9999] pointer-events-auto"
            >
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                  {renderUserAvatar(16)}
                  <div>
                    <div className="text-sm font-medium">
                      {currentUserInfo?.email || currentUserInfo?.name || "Anonymous User"}
                    </div>
                    <div className="text-xs text-gray-400">
                      Connected via Web3Auth
                    </div>
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
                      onClick={(e) => {
                        e.stopPropagation();
                        copyAddress();
                      }}
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
                    onClick={(e) => {
                      e.stopPropagation();
                      openExplorer();
                    }}
                    className="flex-1 h-8 text-xs"
                  >
                    <ExternalLink size={12} className="mr-1" />
                    Explorer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleWalletConnect();
                    }}
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
    
    // Disconnected state (not connected)
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