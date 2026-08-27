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
import {
  Copy,
  KeyRound,
  LogOut,
  PenSquare,
  User,
  UserPlus,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAppWallet } from "@/hooks/use-app-wallet";
import { toast } from "@/hooks/use-toast";

interface NavbarWalletButtonProps {
  isMobile?: boolean;
}

function shortenAddress(address: string) {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export function NavbarWalletButton({ isMobile = false }: NavbarWalletButtonProps) {
  const { ready, authenticated, login, logout, userInfo } = useAuth();
  const {
    hasEmbeddedWallet,
    embeddedWalletAddress,
    createEmbeddedWallet,
    signWalletCheckMessage,
    exportEmbeddedWallet,
    isCreatingWallet,
    isSigningMessage,
    isExportingWallet,
  } = useAppWallet();
  const [isClient, setIsClient] = useState(false);
  const label = userInfo?.name || userInfo?.email || "Account";

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (!ready) {
    return (
      <Button
        disabled
        className={`border-[#dedede] bg-white text-[#636363] ${isMobile ? "w-full" : ""}`}
      >
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-[#dedede] border-t-[#636363]" />
        Loading...
      </Button>
    );
  }

  if (authenticated) {
    const walletLabel = embeddedWalletAddress ? shortenAddress(embeddedWalletAddress) : null;

    const handleCopyWallet = async () => {
      if (!embeddedWalletAddress) return;
      await navigator.clipboard.writeText(embeddedWalletAddress);
      toast({
        title: "Wallet address copied",
        description: embeddedWalletAddress,
      });
    };

    const handleCreateWallet = async () => {
      try {
        const wallet: any = await createEmbeddedWallet();
        toast({
          title: "Embedded wallet ready",
          description: wallet?.address ?? "Solana wallet created",
        });
      } catch (error) {
        console.error("Failed to create embedded wallet:", error);
        toast({
          title: "Could not create wallet",
          description: "Try again in a moment.",
          variant: "destructive",
        });
      }
    };

    const handleSignMessage = async () => {
      try {
        const result = await signWalletCheckMessage();
        await navigator.clipboard.writeText(result.signatureHex);
        toast({
          title: "Wallet signature created",
          description: "The signature hex has been copied to your clipboard.",
        });
      } catch (error) {
        console.error("Failed to sign test message:", error);
        toast({
          title: "Could not sign message",
          description: "Create or recover the embedded wallet first.",
          variant: "destructive",
        });
      }
    };

    const handleExportWallet = async () => {
      try {
        await exportEmbeddedWallet();
      } catch (error) {
        console.error("Failed to export wallet:", error);
        toast({
          title: "Could not export wallet",
          description: "Try again in a moment.",
          variant: "destructive",
        });
      }
    };

    if (isMobile) {
      return (
        <div className="space-y-3">
          <div className="rounded-xl border border-[#dedede] bg-white p-4">
            <div className="mb-2 flex items-center gap-2">
              <User size={16} />
              <span className="text-sm font-medium text-[#181818]">Connected</span>
            </div>
            <div className="text-xs text-[#181818]">{label}</div>
            <div className="mt-2 text-[11px] text-[#636363]">
              {walletLabel ? `Solana wallet: ${walletLabel}` : "No embedded Solana wallet yet"}
            </div>
          </div>
          {hasEmbeddedWallet ? (
            <>
              <Button
                onClick={handleCopyWallet}
                variant="outline"
                className="w-full border-[#dedede] bg-white text-[#181818] hover:bg-[#efefef]"
              >
                <Copy size={16} className="mr-2" />
                Copy Wallet
              </Button>
              <Button
                onClick={handleSignMessage}
                disabled={isSigningMessage}
                variant="outline"
                className="w-full border-[#dedede] bg-white text-[#181818] hover:bg-[#efefef]"
              >
                <PenSquare size={16} className="mr-2" />
                {isSigningMessage ? "Signing..." : "Sign Test Message"}
              </Button>
              <Button
                onClick={handleExportWallet}
                disabled={isExportingWallet}
                variant="outline"
                className="w-full border-[#dedede] bg-white text-[#181818] hover:bg-[#efefef]"
              >
                <KeyRound size={16} className="mr-2" />
                {isExportingWallet ? "Opening..." : "Export Wallet"}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleCreateWallet}
              disabled={isCreatingWallet}
              variant="outline"
              className="w-full border-[#dedede] bg-white text-[#181818] hover:bg-[#efefef]"
            >
              <Wallet size={16} className="mr-2" />
              {isCreatingWallet ? "Creating..." : "Create Solana Wallet"}
            </Button>
          )}
          <Button
            onClick={logout}
            variant="outline"
            className="w-full border-red-200 bg-white text-red-700 hover:bg-red-50"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="px-4">
            <User size={18} className="mr-2" />
            {label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[18rem] rounded-xl border border-[#dedede] bg-white p-2 text-[#181818] shadow-[0_24px_60px_-40px_rgba(0,0,0,0.35)]"
          align="end"
        >
          <DropdownMenuLabel className="flex items-center gap-3 rounded-lg px-3 py-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#dedede] bg-[#efefef] text-sm font-semibold text-[#181818]">
              <User size={16} />
            </span>
            <div>
              <div className="text-sm">{label}</div>
              <div className="text-xs text-[#636363]">
                {userInfo?.email ?? "Connected account"}
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-2 py-2">
            <div className="rounded-lg border border-[#dedede] bg-[#f5f5f5] px-3 py-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#636363]">
                Solana Wallet
              </div>
              <div className="mt-1 text-sm text-[#181818]">
                {walletLabel ?? "Not created yet"}
              </div>
            </div>
          </div>
          <DropdownMenuSeparator />
          {hasEmbeddedWallet ? (
            <>
              <DropdownMenuItem
                onClick={handleCopyWallet}
                className="rounded-lg px-3 py-2.5 text-[#636363] focus:bg-[#efefef] focus:text-[#181818]"
              >
                <Copy size={16} className="mr-2" />
                Copy wallet address
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignMessage}
                disabled={isSigningMessage}
                className="rounded-lg px-3 py-2.5 text-[#636363] focus:bg-[#efefef] focus:text-[#181818]"
              >
                <PenSquare size={16} className="mr-2" />
                {isSigningMessage ? "Signing..." : "Sign test message"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportWallet}
                disabled={isExportingWallet}
                className="rounded-lg px-3 py-2.5 text-[#636363] focus:bg-[#efefef] focus:text-[#181818]"
              >
                <KeyRound size={16} className="mr-2" />
                {isExportingWallet ? "Opening export..." : "Export wallet"}
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              onClick={handleCreateWallet}
              disabled={isCreatingWallet}
              className="rounded-lg px-3 py-2.5 text-[#46620b] focus:bg-[#efffd9] focus:text-[#2e4105]"
            >
              <Wallet size={16} className="mr-2" />
              {isCreatingWallet ? "Creating wallet..." : "Create Solana wallet"}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logout}
            className="rounded-lg px-3 py-2.5 text-red-700 focus:bg-red-50 focus:text-red-800"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <Button
      onClick={login}
      className={`bg-[var(--ds-accent-control)] text-[#172006] hover:bg-[var(--ds-accent-control-hover)] ${isMobile ? "w-full" : ""}`}
    >
      <UserPlus size={18} className="mr-2" />
      Login
    </Button>
  );
}
