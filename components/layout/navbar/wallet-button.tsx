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
import { Copy, KeyRound, LogOut, PenSquare, User, UserPlus, Wallet } from "lucide-react";
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (!ready) {
    return (
      <Button
        disabled
        className={`rounded-full border border-white/[0.08] bg-white/[0.03] text-white ${isMobile ? "w-full" : ""}`}
      >
        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
        Loading...
      </Button>
    );
  }

  if (authenticated) {
    const label = userInfo?.name || userInfo?.email || "Account";
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
          <div className="rounded-2xl border border-[#a9ff2f]/20 bg-[linear-gradient(180deg,rgba(169,255,47,0.12),rgba(169,255,47,0.04))] p-4">
            <div className="mb-2 flex items-center gap-2">
              <User size={16} />
              <span className="text-sm font-medium text-[#a9ff2f]">Connected</span>
            </div>
            <div className="text-xs text-neutral-300">{label}</div>
            <div className="mt-2 text-[11px] text-neutral-400">
              {walletLabel ? `Solana wallet: ${walletLabel}` : "No embedded Solana wallet yet"}
            </div>
          </div>
          {hasEmbeddedWallet ? (
            <>
              <Button
                onClick={handleCopyWallet}
                variant="outline"
                className="w-full rounded-2xl border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.07]"
              >
                <Copy size={16} className="mr-2" />
                Copy Wallet
              </Button>
              <Button
                onClick={handleSignMessage}
                disabled={isSigningMessage}
                variant="outline"
                className="w-full rounded-2xl border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.07]"
              >
                <PenSquare size={16} className="mr-2" />
                {isSigningMessage ? "Signing..." : "Sign Test Message"}
              </Button>
              <Button
                onClick={handleExportWallet}
                disabled={isExportingWallet}
                variant="outline"
                className="w-full rounded-2xl border-white/[0.08] bg-white/[0.03] text-white hover:bg-white/[0.07]"
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
              className="w-full rounded-2xl border-[#a9ff2f]/20 bg-[#a9ff2f]/5 text-[#a9ff2f] hover:bg-[#a9ff2f]/10"
            >
              <Wallet size={16} className="mr-2" />
              {isCreatingWallet ? "Creating..." : "Create Solana Wallet"}
            </Button>
          )}
          <Button
            onClick={logout}
            variant="outline"
            className="w-full rounded-2xl border-red-500/20 bg-red-500/[0.03] text-red-400 hover:bg-red-500/10"
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
          <Button className="rounded-full border border-[#a9ff2f]/30 bg-[#a9ff2f] px-4 text-black hover:bg-[#98ea2a]">
            <User size={18} className="mr-2" />
            {label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-[18rem] rounded-[24px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(15,15,15,0.98),rgba(8,8,8,0.98))] p-2 text-white shadow-[0_24px_64px_rgba(0,0,0,0.42)]"
          align="end"
        >
          <DropdownMenuLabel className="flex items-center gap-2 rounded-2xl px-3 py-3">
            <User size={16} />
            <div>
              <div className="text-sm">{label}</div>
              <div className="text-xs text-gray-400">Signed in with Privy</div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <div className="px-2 py-2">
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] px-3 py-3">
              <div className="text-[11px] uppercase tracking-[0.2em] text-gray-500">
                Solana Wallet
              </div>
              <div className="mt-1 text-sm text-white">
                {walletLabel ?? "Not created yet"}
              </div>
            </div>
          </div>
          <DropdownMenuSeparator />
          {hasEmbeddedWallet ? (
            <>
              <DropdownMenuItem
                onClick={handleCopyWallet}
                className="rounded-xl px-3 py-2.5 text-white/85 focus:bg-white/[0.06] focus:text-white"
              >
                <Copy size={16} className="mr-2" />
                Copy wallet address
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleSignMessage}
                disabled={isSigningMessage}
                className="rounded-xl px-3 py-2.5 text-white/85 focus:bg-white/[0.06] focus:text-white"
              >
                <PenSquare size={16} className="mr-2" />
                {isSigningMessage ? "Signing..." : "Sign test message"}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleExportWallet}
                disabled={isExportingWallet}
                className="rounded-xl px-3 py-2.5 text-white/85 focus:bg-white/[0.06] focus:text-white"
              >
                <KeyRound size={16} className="mr-2" />
                {isExportingWallet ? "Opening export..." : "Export wallet"}
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem
              onClick={handleCreateWallet}
              disabled={isCreatingWallet}
              className="rounded-xl px-3 py-2.5 text-[#a9ff2f] focus:bg-[#a9ff2f]/10 focus:text-[#a9ff2f]"
            >
              <Wallet size={16} className="mr-2" />
              {isCreatingWallet ? "Creating wallet..." : "Create Solana wallet"}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={logout}
            className="rounded-xl px-3 py-2.5 text-red-400 focus:bg-red-500/10 focus:text-red-300"
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
      className={`rounded-full border border-[#a9ff2f]/30 bg-[#a9ff2f] text-black hover:bg-[#98ea2a] ${isMobile ? "w-full" : ""}`}
    >
      <UserPlus size={18} className="mr-2" />
      Login
    </Button>
  );
}
