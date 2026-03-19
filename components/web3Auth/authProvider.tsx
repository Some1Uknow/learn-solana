"use client";

// IMP START - Setup Web3Auth Provider for Solana
import {
  Web3AuthProvider,
  type Web3AuthContextConfig,
} from "@web3auth/modal/react";
import { IWeb3AuthState, WEB3AUTH_NETWORK, UX_MODE } from "@web3auth/modal";
import React from "react";
// IMP END - Setup Web3Auth Provider

// IMP START - Dashboard Registration

const web3AuthClientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;

if (!web3AuthClientId) {
  throw new Error("Missing Web3Auth client ID");
}

const clientId = web3AuthClientId; // get from https://dashboard.web3auth.io

// IMP START - Simplified Web3Auth Modal Config for v10+
// Web3Auth Modal v10+ handles blockchain configuration via dashboard
// IMP START - SSR
export default function Provider({
  children,
  web3authInitialState,
  isBrave,
}: {
  children: React.ReactNode;
  web3authInitialState: IWeb3AuthState | undefined;
  isBrave?: boolean;
}) {
  const web3AuthContextConfig: Web3AuthContextConfig = {
    web3AuthOptions: {
      clientId,
      web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
      ssr: true,
      sessionTime: 86400 * 7,
      multiInjectedProviderDiscovery: false,
      uiConfig: {
        appName: "learn.sol",
        theme: {
          primary: "#7C4DFF",
        },
        mode: "dark",
        uxMode: isBrave ? UX_MODE.REDIRECT : UX_MODE.POPUP,
      },
    },
  };

  if (typeof window !== "undefined") {
    // Lightweight one-time diagnostic to ensure provider mount & network selection
    (window as any).__WEB3AUTH_PROVIDER_DEBUG = {
      network: web3AuthContextConfig.web3AuthOptions.web3AuthNetwork,
      uxMode: web3AuthContextConfig.web3AuthOptions.uiConfig?.uxMode,
      ts: Date.now(),
    };
    if (!("Web3AuthProviderMounted" in window)) {
      console.log(
        "[Web3AuthProvider] mounted with network",
        web3AuthContextConfig.web3AuthOptions.web3AuthNetwork
      );
      (window as any).Web3AuthProviderMounted = true;
    }
  }
  // IMP END - SSR
  return (
    // IMP START - Setup Web3Auth Provider for Solana
    // IMP START - SSR
    <Web3AuthProvider
      config={web3AuthContextConfig}
      initialState={web3authInitialState}
    >
      {children}
    </Web3AuthProvider>
    // IMP END - SSR
    // IMP END - Setup Web3Auth Provider
  );
}
