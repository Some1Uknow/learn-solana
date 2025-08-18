"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { Menu, X, Wallet, Github, Star, LogOut, User, Copy, ExternalLink, UserPlus, UserCheck, Shield } from "lucide-react";
import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
  useWeb3Auth,
} from "@web3auth/modal/react";
import { SolanaWallet } from "@web3auth/solana-provider";
import { PublicKey } from "@solana/web3.js";
import { isValidSolanaAddress } from "@/lib/solana-utils";

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
  const [addressFetchAttempts, setAddressFetchAttempts] = useState(0);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

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

  const solanaWallet = useMemo(() => {
    if (provider) {
      return new SolanaWallet(provider);
    }
    return null;
  }, [provider]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle wallet connection
  const handleWalletConnect = async () => {
    if (isConnected) {
      // If connected, disconnect
      console.log("🔄 Disconnecting...");
      await disconnect();
      setUserAddress("");
      setIsLoadingAddress(false);
      setAddressFetchAttempts(0);
      console.log("✅ Disconnected and cleared user state");
    } else {
      // If not connected, connect
      console.log("🔄 Connecting...");
      setIsLoadingAddress(false); // Reset loading state before connecting
      setAddressFetchAttempts(0); // Reset attempts
      await connect();
    }
  };

  // Get Solana address when connected - ENHANCED WITH LOADING STATE AND RETRY
  const getSolanaAddressFromWeb3Auth = async () => {
    console.log("🚀 Getting Solana address...", { 
      provider: !!provider, 
      isConnected, 
      userInfo: !!userInfo, 
      attempt: addressFetchAttempts + 1 
    });
    
    setIsLoadingAddress(true);
    setAddressFetchAttempts(prev => prev + 1);
    
    try {
      if (!isConnected) {
        console.log("❌ Not connected to Web3Auth");
        return;
      }

      if (!userInfo) {
        console.log("❌ User info not available - please connect first");
        return;
      }

      console.log("🔍 Getting Solana address from Web3Auth...");

      // PRIMARY METHOD: Extract from userInfo.wallets (Web3Auth v10+ approach)
      if (userInfo && typeof userInfo === 'object') {
        const userInfoObj = userInfo as any;
        
        // Log the full userInfo structure to understand it better
        console.log("📋 Full user info structure:", JSON.stringify(userInfoObj, null, 2));

        // Check for wallets in userInfo
        if (userInfoObj.wallets && Array.isArray(userInfoObj.wallets)) {
          console.log("👛 Found wallets in user info:", userInfoObj.wallets);
          
          // Look for Solana wallet (ed25519 curve)
          const solanaWalletInfo = userInfoObj.wallets.find((w: any) => 
            w.curve === 'ed25519' || w.type === 'web3auth_app_key'
          );
          
          if (solanaWalletInfo && solanaWalletInfo.public_key) {
            try {
              console.log("🔑 Found Solana wallet info:", solanaWalletInfo);
              
              // Try to create PublicKey from the hex string
              let publicKeyBytes;
              if (solanaWalletInfo.public_key.startsWith('0x')) {
                const hexString = solanaWalletInfo.public_key.slice(2);
                publicKeyBytes = new Uint8Array(Buffer.from(hexString, 'hex'));
              } else {
                publicKeyBytes = new Uint8Array(Buffer.from(solanaWalletInfo.public_key, 'hex'));
              }
              
              const publicKey = new PublicKey(publicKeyBytes);
              const address = publicKey.toBase58();
              
              setUserAddress(address);
              console.log("✅ SUCCESS: Solana Address derived from user info:", address);
              setIsLoadingAddress(false);
              return;
              
            } catch (conversionError) {
              console.error("❌ Failed to convert public key from user info:", conversionError);
            }
          }
        }
      }

      // If user info method fails, try provider methods
      if (!provider) {
        console.log("❌ No provider available");
        return;
      }

      try {
        // Method 1: For Web3Auth Modal v10+, get accounts using the provider
        const accounts = await provider.request({
          method: "requestAccounts",
          params: {},
        });

        console.log("Provider requestAccounts result:", accounts);

        if (accounts && Array.isArray(accounts) && accounts.length > 0) {
          const address = accounts[0];
          setUserAddress(address);
          setIsLoadingAddress(false);
          console.log("✅ SUCCESS: Solana Address from provider:", address);
          return;
        }

        throw new Error("No accounts returned from provider");

      } catch (requestAccountsError) {
        console.log("❌ requestAccounts failed:", requestAccountsError);

        // Method 2: Try alternative method for getting accounts
        try {
          const publicKey = await provider.request({
            method: "getAccounts",
            params: {},
          });

          console.log("Provider getAccounts result:", publicKey);

          if (publicKey) {
            let address: string;
            if (Array.isArray(publicKey) && publicKey.length > 0) {
              address = publicKey[0];
            } else if (typeof publicKey === 'string') {
              address = publicKey;
            } else {
              throw new Error("Unexpected public key format");
            }

            setUserAddress(address);
            setIsLoadingAddress(false);
            console.log("✅ SUCCESS: Solana Address from getAccounts:", address);
            return;
          }

        } catch (getAccountsError) {
          console.log("❌ getAccounts failed:", getAccountsError);

          // Method 3: Use SolanaWallet if available
          if (solanaWallet) {
            try {
              console.log("Trying SolanaWallet.requestAccounts...");
              const walletAccounts = await solanaWallet.requestAccounts();
              console.log("SolanaWallet accounts result:", walletAccounts);

              if (walletAccounts && walletAccounts.length > 0) {
                const address = walletAccounts[0];
                setUserAddress(address);
                setIsLoadingAddress(false);
                console.log("✅ SUCCESS: Solana Address from SolanaWallet:", address);
                return;
              }

            } catch (walletError) {
              console.log("❌ SolanaWallet.requestAccounts failed:", walletError);
            }
          }

          throw new Error("All methods failed to get Solana address");
        }
      }

    } catch (error) {
      console.error("❌ Final error getting Solana address:", error);
      console.log("💡 Next steps to try:");
      console.log("1. Check Web3Auth configuration for Solana in dashboard");
      console.log("2. Try disconnecting and reconnecting");
      console.log("3. Check browser console for more details");
      
      setIsLoadingAddress(false);
      
      // If this was the first few attempts, try again after a short delay
      if (addressFetchAttempts < 3) {
        console.log(`🔄 Will retry in 2 seconds (attempt ${addressFetchAttempts + 1}/3)`);
        setTimeout(() => {
          if (isConnected && !userAddress) {
            getSolanaAddressFromWeb3Auth();
          }
        }, 2000);
      } else {
        console.error("🛑 Maximum retry attempts reached. Address fetch failed.");
      }
    }
  };

  // Get address when connected - ENHANCED WITH LOADING STATE AND RETRY
  useEffect(() => {
    console.log("🔍 Auth Debug:", { 
      isConnected, 
      provider: !!provider, 
      userInfo: !!userInfo, 
      userAddress,
      isLoadingAddress,
      attempts: addressFetchAttempts
    });
    
    // Reset loading and attempts when connection state changes
    if (!isConnected) {
      setIsLoadingAddress(false);
      setAddressFetchAttempts(0);
      return;
    }
    
    // Only try to fetch address if connected, have provider/userInfo, and don't already have an address
    if (isConnected && (provider || userInfo) && !userAddress && !isLoadingAddress) {
      console.log("🔄 Conditions met, fetching address...");
      getSolanaAddressFromWeb3Auth();
    } else {
      console.log("⏹️ Skipping address fetch:", { 
        isConnected, 
        hasProviderOrUserInfo: !!(provider || userInfo), 
        alreadyHasAddress: !!userAddress,
        isCurrentlyLoading: isLoadingAddress
      });
    }
  }, [isConnected, provider, userInfo]); // CRITICAL FIX: Removed userAddress from dependencies

  // Clear address and loading states when disconnected
  useEffect(() => {
    if (!isConnected && (userAddress || isLoadingAddress)) {
      console.log("🧹 Clearing user state on disconnect");
      setUserAddress("");
      setIsLoadingAddress(false);
      setAddressFetchAttempts(0);
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
      console.error("Error fetching GitHub stars:", error);
      setGithubStars(42); // Fallback number
    }
  };
  // Helper function to truncate address
  const truncateAddress = (address: string) => {
    if (!address) return "";
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  // Debug function to log current state
  const debugCurrentState = () => {
    console.log("=== NAVBAR DEBUG STATE ===");
    console.log("isConnected:", isConnected);
    console.log("provider:", !!provider);
    console.log("userInfo:", userInfo);
    console.log("userAddress:", userAddress);
    console.log("isLoadingAddress:", isLoadingAddress);
    console.log("addressFetchAttempts:", addressFetchAttempts);
    console.log("solanaWallet:", !!solanaWallet);
    console.log("connectLoading:", connectLoading);
    console.log("disconnectLoading:", disconnectLoading);
    console.log("=========================");
  };
  const copyAddress = async () => {
    console.log("🔄 Copy address clicked");
    if (userAddress) {
      try {
        await navigator.clipboard.writeText(userAddress);
        console.log("✅ Address copied to clipboard:", userAddress);
        // You could add a toast notification here
      } catch (error) {
        console.error("❌ Failed to copy address:", error);
      }
    }
  };

  // Open Solana Explorer
  const openExplorer = () => {
    console.log("🔄 Open explorer clicked");
    if (userAddress) {
      const explorerUrl = `https://explorer.solana.com/address/${userAddress}?cluster=devnet`;
      console.log("🌐 Opening explorer:", explorerUrl);
      window.open(explorerUrl, "_blank");
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
    
    // If connected but no address yet or currently loading, show loading state
    if (isConnected && (!userAddress || isLoadingAddress)) {
      const loadingText = addressFetchAttempts > 0 
        ? `Loading wallet... (${addressFetchAttempts}/3)`
        : "Loading wallet...";
        
      // Show retry button if max attempts reached
      if (addressFetchAttempts >= 3 && !isLoadingAddress) {
        return (
          <Button
            onClick={() => {
              console.log("🔄 Manual retry triggered");
              setAddressFetchAttempts(0);
              getSolanaAddressFromWeb3Auth();
            }}
            className={`relative overflow-hidden bg-orange-500 hover:bg-orange-600 text-white font-semibold flex items-center gap-2 h-10 px-6 rounded-full ${
              isMobile ? "w-full justify-center" : ""
            }`}
          >
            <span className="relative z-10">
              Retry ({addressFetchAttempts}/3)
            </span>
          </Button>
        );
      }
        
      return (
        <Button
          disabled={true}
          className={`relative overflow-hidden bg-yellow-500 text-black font-semibold flex items-center gap-2 h-10 px-6 rounded-full opacity-75 ${
            isMobile ? "w-full justify-center" : ""
          }`}
        >
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
          <span className="relative z-10">
            {loadingText}
          </span>
        </Button>
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
