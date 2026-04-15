"use client";

import { useMemo, useState } from "react";
import {
  useCreateWallet,
  useExportWallet,
  useSignMessage,
  useWallets,
} from "@privy-io/react-auth/solana";
import { authFetch } from "@/lib/auth/authFetch";
import { useAuth } from "@/hooks/use-auth";

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function useAppWallet() {
  const { authenticated, walletAddress: authWalletAddress } = useAuth();
  const { ready, wallets } = useWallets();
  const { createWallet } = useCreateWallet();
  const { signMessage } = useSignMessage();
  const { exportWallet } = useExportWallet();
  const [isCreatingWallet, setIsCreatingWallet] = useState(false);
  const [isSigningMessage, setIsSigningMessage] = useState(false);
  const [isExportingWallet, setIsExportingWallet] = useState(false);

  const embeddedWallet = useMemo(() => {
    return (
      wallets.find((wallet: any) => {
        const connectorType = wallet?.connectorType ?? wallet?.connector_type;
        const walletClientType = wallet?.walletClientType ?? wallet?.wallet_client_type;
        const walletClient = wallet?.walletClient ?? wallet?.wallet_client;
        return (
          connectorType === "embedded" ||
          walletClientType === "privy" ||
          walletClient === "privy"
        );
      }) ??
      wallets.find((wallet: any) => wallet?.address === authWalletAddress) ??
      null
    );
  }, [authWalletAddress, wallets]);

  const syncWalletAddress = async (walletAddress: string | null | undefined) => {
    if (!walletAddress) return;

    const response = await authFetch("/api/auth/sync", {
      method: "POST",
      body: JSON.stringify({ walletAddress }),
    });

    if (!response.ok) {
      throw new Error(`wallet sync failed with status ${response.status}`);
    }
  };

  const createEmbeddedWallet = async () => {
    if (!authenticated) {
      throw new Error("Login required");
    }

    setIsCreatingWallet(true);
    try {
      const result: any = await createWallet();
      const wallet = result?.wallet ?? result;
      await syncWalletAddress(wallet?.address ?? null);
      return wallet;
    } finally {
      setIsCreatingWallet(false);
    }
  };

  const signWalletCheckMessage = async () => {
    const wallet = embeddedWallet;
    if (!wallet) {
      throw new Error("No embedded wallet available");
    }

    setIsSigningMessage(true);
    try {
      const message = new TextEncoder().encode(
        `learn.sol wallet check ${new Date().toISOString()}`
      );
      const result = await signMessage({
        wallet,
        message,
      });

      return {
        message: new TextDecoder().decode(message),
        signatureHex: bytesToHex(result.signature),
      };
    } finally {
      setIsSigningMessage(false);
    }
  };

  const exportEmbeddedWallet = async () => {
    const address = embeddedWallet?.address;
    if (!address) {
      throw new Error("No embedded wallet available");
    }

    setIsExportingWallet(true);
    try {
      await exportWallet({ address });
    } finally {
      setIsExportingWallet(false);
    }
  };

  return {
    walletsReady: ready,
    wallets,
    embeddedWallet,
    embeddedWalletAddress: embeddedWallet?.address ?? authWalletAddress ?? null,
    hasEmbeddedWallet: Boolean(embeddedWallet?.address),
    createEmbeddedWallet,
    signWalletCheckMessage,
    exportEmbeddedWallet,
    isCreatingWallet,
    isSigningMessage,
    isExportingWallet,
  };
}
