"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { LogOut, Copy, ExternalLink, UserPlus, UserCheck } from "lucide-react";
import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
  useWeb3Auth,
} from "@web3auth/modal/react";
import { SolanaWallet } from "@web3auth/solana-provider";

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

interface NavbarWalletButtonProps {
  isMobile?: boolean;
}

export function NavbarWalletButton({ isMobile = false }: NavbarWalletButtonProps) {
  const [userAddress, setUserAddress] = useState<string>("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);
  const [recoveredUserInfo, setRecoveredUserInfo] = useState<any>(null);

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

  // Handle client-side hydration - SIMPLIFIED
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Single optimized effect to handle all connection state
  useEffect(() => {
    if (!isHydrated) return;

    console.log("🔍 [Connection State]", {
      isConnected,
      hasUserInfo: !!userInfo,
      hasRecoveredUserInfo: !!recoveredUserInfo,
      hasUserAddress: !!userAddress,
      hasProvider: !!provider,
      isLoadingAddress
    });

    // If connected and missing userInfo, try to recover it ONCE
    if (isConnected && !userInfo && !recoveredUserInfo && web3Auth) {
      console.log("📞 [UserInfo Recovery] Attempting recovery...");
      const recoverUserInfo = async () => {
        try {
          const manualUserInfo = await web3Auth.getUserInfo();
          console.log("✅ [UserInfo Recovery] Success:", manualUserInfo);
          setRecoveredUserInfo(manualUserInfo);
        } catch (error) {
          console.log("❌ [UserInfo Recovery] Failed:", error);
        }
      };
      
      // Single timeout, no loops
      const timer = setTimeout(recoverUserInfo, 500);
      return () => clearTimeout(timer);
    }

    // If connected and missing address, get it ONCE  
    if (isConnected && !userAddress && !isLoadingAddress && provider) {
      console.log("🏠 [Address Recovery] Attempting recovery...");
      getSolanaAddressFromWeb3Auth();
    }

    // Clear states when disconnected
    if (!isConnected) {
      console.log("🧹 [Cleanup] Clearing states due to disconnection");
      setUserAddress("");
      setRecoveredUserInfo(null);
      setIsLoadingAddress(false);
    }
  }, [isHydrated, isConnected, userInfo, recoveredUserInfo, userAddress, isLoadingAddress, provider, web3Auth]);

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

      // Get the current provider - try hooks first, then manual recovery
      let currentProvider = provider;
      
      if (!currentProvider && web3Auth && isConnected) {
        try {
          currentProvider = web3Auth.provider;
        } catch (error) {
          console.error("Provider recovery failed:", error);
        }
      }

      if (!currentProvider) {
        console.error("No provider available");
        return;
      }

      // Use getAccounts method (this is the only reliable method)
      const accounts = await currentProvider.request({
        method: "getAccounts",
        params: {},
      });

      if (accounts) {
        let address: string;
        
        // Handle both array and string responses
        if (Array.isArray(accounts) && accounts.length > 0) {
          address = accounts[0];
        } else if (typeof accounts === "string") {
          address = accounts;
        } else {
          throw new Error("Invalid response format from getAccounts");
        }

        setUserAddress(address);
        return;
      }
      
      throw new Error("getAccounts returned no accounts");
      
    } catch (error) {
      console.error("Failed to get Solana address:", error);
    } finally {
      setIsLoadingAddress(false);
    }
  };

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
    const currentUserInfo = userInfo || recoveredUserInfo;
    
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
  const renderWalletButton = () => {
    const isLoading = connectLoading || disconnectLoading;
    const currentUserInfo = userInfo || recoveredUserInfo;
    
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

  return renderWalletButton();
}