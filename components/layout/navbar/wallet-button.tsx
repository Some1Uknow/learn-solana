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
import { useEffect, useState } from "react";
import { LogOut, Copy, ExternalLink, UserPlus, Wallet, Check } from "lucide-react";
import { useWeb3Auth } from "@/hooks/use-web3-auth";
import { LoginRequiredModal } from "@/components/ui/login-required-modal";

interface NavbarWalletButtonProps {
  isMobile?: boolean;
}

export function NavbarWalletButton({ isMobile = false }: NavbarWalletButtonProps) {
  const {
    logout,
    isConnected,
    isLoading,
    walletAddress,
    userInfo,
    authMethod,
    authSource,
    getUserInfo,
  } = useWeb3Auth();
  const [isClient, setIsClient] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [dropdownUserInfo, setDropdownUserInfo] = useState<any>(null);
  const [isLoadingUserInfo, setIsLoadingUserInfo] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setDropdownUserInfo(null);
    } else if (userInfo) {
      setDropdownUserInfo(userInfo);
    }
  }, [isConnected, userInfo]);

  const fetchUserInfoForDropdown = async () => {
    if (dropdownUserInfo || isLoadingUserInfo) return;
    setIsLoadingUserInfo(true);
    try {
      const nextUserInfo = await getUserInfo?.();
      if (nextUserInfo) {
        setDropdownUserInfo(nextUserInfo);
      }
    } catch (error) {
      console.error("Failed to get user info:", error);
    } finally {
      setIsLoadingUserInfo(false);
    }
  };

  const handleConnect = async () => {
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("[WalletButton] logout error", error);
    }
  };

  const copyAddress = () => {
    if (!walletAddress) return;
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openExplorer = () => {
    if (!walletAddress) return;
    window.open(
      `https://explorer.solana.com/address/${walletAddress}?cluster=devnet`,
      "_blank"
    );
  };

  const truncateAddress = (addr: string) =>
    addr ? `${addr.slice(0, 4)}...${addr.slice(-4)}` : "";

  if (!isClient) return null;

  if (isLoading || (isConnected && !walletAddress)) {
    const loadingLabel = isConnected && !walletAddress ? "Loading wallet..." : "Signing in...";
    return (
      <Button disabled className={`bg-yellow-500 text-black ${isMobile ? "w-full" : ""}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2" />
        {loadingLabel}
      </Button>
    );
  }

  if (isConnected && walletAddress) {
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
                {truncateAddress(walletAddress)}
              </span>
              <Button size="sm" variant="ghost" onClick={copyAddress} className="h-6 w-6 p-0">
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </Button>
              <Button size="sm" variant="ghost" onClick={openExplorer} className="h-6 w-6 p-0">
                <ExternalLink size={12} />
              </Button>
            </div>
          </div>
          <Button
            onClick={handleLogout}
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
      <>
        <DropdownMenu onOpenChange={(open) => open && fetchUserInfoForDropdown()}>
          <DropdownMenuTrigger asChild>
            <Button className="bg-green-500 hover:bg-green-600 text-white">
              <Wallet size={18} className="mr-2" />
              {truncateAddress(walletAddress)}
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
                <div className="text-xs text-gray-400">
                  {authMethod === "native_wallet"
                    ? "Standard Wallet"
                    : authSource === "web3auth"
                      ? "Web3Auth"
                      : "Authenticated"}
                </div>
              </div>
            </DropdownMenuLabel>
          )}

          <DropdownMenuSeparator />

          <div className="px-2 py-1">
            <div className="text-xs text-gray-400 mb-1">Address</div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-gray-800 px-2 py-1 rounded flex-1 truncate text-gray-200">
                {walletAddress}
              </span>
              <Button size="sm" variant="ghost" onClick={copyAddress} className="h-6 w-6 p-0">
                {copied ? <Check size={12} /> : <Copy size={12} />}
              </Button>
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={openExplorer}>
            <ExternalLink size={16} className="mr-2" />
            Explorer
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut size={16} className="mr-2" />
            Logout
          </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <LoginRequiredModal
          open={showAuthModal}
          onOpenChange={setShowAuthModal}
          title="Login"
          description="Choose how you want to authenticate."
        />
      </>
    );
  }

  return (
    <>
      <Button
        onClick={handleConnect}
        disabled={isLoading}
        className={`bg-[#14F195] hover:bg-[#12d182] text-black ${isMobile ? "w-full" : ""}`}
      >
        <UserPlus size={18} className="mr-2" />
        Login
      </Button>
      <LoginRequiredModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
        title="Login"
        description="Choose how you want to authenticate."
      />
    </>
  );
}
