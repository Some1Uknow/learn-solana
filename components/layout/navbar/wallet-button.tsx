"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { LogOut, Copy, ExternalLink, UserPlus, Wallet } from "lucide-react";
import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3Auth,
} from "@web3auth/modal/react";

interface NavbarWalletButtonProps {
  isMobile?: boolean;
}

export function NavbarWalletButton({ isMobile = false }: NavbarWalletButtonProps) {
  const [userAddress, setUserAddress] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [dropdownUserInfo, setDropdownUserInfo] = useState<any>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);

  // Web3Auth hooks
  const { connect, isConnected, loading: connectLoading } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect();
  const { provider, web3Auth } = useWeb3Auth();

  const isLoading = connectLoading || disconnectLoading;

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get address when connected
  useEffect(() => {
    if (isConnected && provider && !userAddress) {
      getAddress();
    } else if (!isConnected) {
      setUserAddress("");
      setDropdownUserInfo(null);
    }
  }, [isConnected, provider, userAddress]);

  const getAddress = async () => {
    try {
      const accounts = await provider?.request({
        method: "getAccounts",
        params: {},
      });
      
      const address = Array.isArray(accounts) ? accounts[0] : accounts;
      if (address) setUserAddress(address);
    } catch (error) {
      console.error("Failed to get address:", error);
    }
  };

  // Fetch user info only when dropdown opens
  const fetchUserInfoForDropdown = async () => {
    if (!web3Auth || dropdownUserInfo || isLoadingUserInfo) return;
    
    setIsLoadingUserInfo(true);
    try {
      const userInfo = await web3Auth.getUserInfo();
      setDropdownUserInfo(userInfo);
    } catch (error) {
      console.error("Failed to get user info:", error);
    } finally {
      setIsLoadingUserInfo(false);
    }
  };

  const handleConnect = () => isConnected ? disconnect() : connect();
  
  const copyAddress = () => navigator.clipboard.writeText(userAddress);
  
  const openExplorer = () => 
    window.open(`https://explorer.solana.com/address/${userAddress}?cluster=devnet`, "_blank");

  const truncateAddress = (addr: string) => 
    addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : "";

  // Don't render until client-side
  if (!isClient) return null;

  // Loading state
  if (isLoading || (isConnected && !userAddress)) {
    return (
      <Button disabled className={`bg-yellow-500 text-black ${isMobile ? "w-full" : ""}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2" />
        Loading...
      </Button>
    );
  }

  // Connected state
  if (isConnected && userAddress) {
    if (isMobile) {
      return (
        <div className="space-y-2">
          <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Wallet size={16} />
              <span className="text-sm font-medium text-green-500">Connected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-gray-800 px-2 py-1 rounded">
                {truncateAddress(userAddress)}
              </span>
              <Button size="sm" variant="ghost" onClick={copyAddress} className="h-6 w-6 p-0">
                <Copy size={12} />
              </Button>
              <Button size="sm" variant="ghost" onClick={openExplorer} className="h-6 w-6 p-0">
                <ExternalLink size={12} />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleConnect}
            disabled={isLoading}
            variant="outline"
            className="w-full text-red-500 border-red-500/20 hover:bg-red-500/10"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      );
    }

    return (
      <DropdownMenu onOpenChange={(open) => open && fetchUserInfoForDropdown()}>
        <DropdownMenuTrigger asChild>
          <Button className="bg-green-500 hover:bg-green-600 text-white">
            <Wallet size={18} className="mr-2" />
            {truncateAddress(userAddress)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end">
          {isLoadingUserInfo ? (
            <DropdownMenuLabel className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />
              Loading user info...
            </DropdownMenuLabel>
          ) : (
            <DropdownMenuLabel className="flex items-center gap-2">
              {dropdownUserInfo?.profileImage ? (
                <img
                  src={dropdownUserInfo.profileImage}
                  alt="Profile"
                  className="w-4 h-4 rounded-full object-cover"
                />
              ) : (
                <Wallet size={16} />
              )}
              <div>
                <div className="text-sm">
                  {dropdownUserInfo?.email || dropdownUserInfo?.name || "Wallet User"}
                </div>
                <div className="text-xs text-gray-400">Web3Auth</div>
              </div>
            </DropdownMenuLabel>
          )}
          
          <DropdownMenuSeparator />
          
          <div className="px-2 py-1">
            <div className="text-xs text-gray-400 mb-1">Address</div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-gray-800 px-2 py-1 rounded flex-1 truncate text-gray-200">
                {userAddress}
              </span>
              <Button size="sm" variant="ghost" onClick={copyAddress} className="h-6 w-6 p-0">
                <Copy size={12} />
              </Button>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={openExplorer}>
            <ExternalLink size={16} className="mr-2" />
            Explorer
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleConnect} className="text-red-600">
            <LogOut size={16} className="mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Disconnected state
  return (
    <Button
      onClick={handleConnect}
      disabled={isLoading}
      className={`bg-[#14F195] hover:bg-[#12d182] text-black ${isMobile ? "w-full" : ""}`}
    >
      <UserPlus size={18} className="mr-2" />
      Sign Up / Login
    </Button>
  );
}