"use client";

// IMP START - Setup Web3Auth Provider for Solana
import {
  Web3AuthProvider,
  type Web3AuthContextConfig,
} from "@web3auth/modal/react";
import { IWeb3AuthState, WEB3AUTH_NETWORK } from "@web3auth/modal";
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
const web3AuthContextConfig: Web3AuthContextConfig = {
  web3AuthOptions: {
    clientId,
    web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
    // IMP START - SSR
    ssr: true,
    // Enable session management for better state persistence
    sessionTime: 86400 * 7, // 7 days
    // IMP END - SSR
    uiConfig: {
      appName: "learn.sol",
      theme: {
        primary: "#7C4DFF",
      },
      mode: "dark",
      logoLight: "https://learnsol.site/opengraph-image.png",
      logoDark: "https://learnsol.site/opengraph-image.png",
    },
  },
};
// IMP END - Simplified Web3Auth Modal Config

// IMP START - SSR
export default function Provider({
  children,
  web3authInitialState,
}: {
  children: React.ReactNode;
  web3authInitialState: IWeb3AuthState | undefined;
}) {
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
