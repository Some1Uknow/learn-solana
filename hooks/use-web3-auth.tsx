"use client";

import { useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";

export function useWeb3Auth() {
  const {
    ready,
    authenticated,
    user,
    userInfo,
    walletAddress,
    login,
    logout,
    connectWallet,
    isLoading,
  } = useAuth();

  const resolvedUserInfo = useMemo(() => {
    if (!userInfo) return null;

    return {
      email: userInfo.email ?? undefined,
      name: userInfo.name ?? undefined,
      profileImage: userInfo.profileImage ?? undefined,
    };
  }, [userInfo]);

  return {
    login,
    logout,
    isLoggedIn: authenticated,
    isConnected: authenticated,
    isLoading,
    isInitializing: !ready,
    sessionReady: ready,
    authPhase: "idle" as const,
    walletAddress,
    userInfo: resolvedUserInfo,
    authMethod: walletAddress ? "wallet" : "privy",
    authSource: authenticated ? "privy" : null,
    provider: null,
    browserWallets: [],
    refreshBrowserWallets: () => {},
    nativeWalletSession: null,
    sessionUser: userInfo
      ? {
          walletAddress: walletAddress ?? null,
          email: userInfo.email ?? null,
          name: userInfo.name ?? null,
          profileImage: userInfo.profileImage ?? null,
          authMethod: walletAddress ? "wallet" : "privy",
          source: "privy",
        }
      : null,
    getUserInfo: async () => resolvedUserInfo,
    loginWithAuthConnection: async () => {
      await login();
    },
    loginWithNativeWallet: async () => {
      if (typeof connectWallet === "function") {
        await connectWallet();
        return;
      }
      await login();
    },
    web3Auth: null,
    isAuthorized: authenticated,
    status: ready ? "ready" : "loading",
    user,
  };
}
