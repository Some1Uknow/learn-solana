"use client";

import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3Auth as useWeb3AuthCore,
} from "@web3auth/modal/react";
import { registerUserAfterLogin } from "@/lib/auth/registerUserAfterLogin";
import { clearClientAuthState } from "@/lib/auth/session";

export function useWeb3Auth() {
  const { connect, isConnected, loading, error } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect();
  const { web3Auth } = useWeb3AuthCore();

  const login = async () => {
    if (!web3Auth) {
      throw new Error("Web3Auth is not initialized yet.");
    }

    const provider = await connect();

    if (!provider) {
      throw (
        error ??
        new Error(
          "Wallet login did not complete. The wallet modal may have been closed, blocked by the browser, or interrupted."
        )
      );
    }

    try {
      const result = await registerUserAfterLogin(provider as any, web3Auth as any);
      if (!result.success) {
        console.warn("[useWeb3Auth] post-login registration failed:", result.error);
      }
    } catch (registrationError) {
      console.warn("[useWeb3Auth] post-login registration error:", registrationError);
    }

    return provider;
  };

  const logout = async () => {
    try {
      await disconnect();
    } finally {
      clearClientAuthState();
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.warn("[useWeb3Auth] logout cleanup request failed:", error);
      }
    }
  };

  return {
    login,
    logout,
    isLoggedIn: isConnected,
    isLoading: loading || disconnectLoading,
    web3Auth
  };
}
