"use client";

import {
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3Auth as useWeb3AuthCore,
} from "@web3auth/modal/react";
import { WALLET_CONNECTORS } from "@web3auth/modal";
import { registerUserAfterLogin } from "@/lib/auth/registerUserAfterLogin";
import { clearClientAuthState } from "@/lib/auth/session";

export function useWeb3Auth() {
  const { connect, connectTo, isConnected, loading, error } = useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect();
  const { web3Auth } = useWeb3AuthCore();

  const finalizeLogin = async (provider: unknown) => {
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

  const login = async () => {
    if (!web3Auth) {
      throw new Error("Web3Auth is not initialized yet.");
    }

    const provider = await connect();
    return finalizeLogin(provider);
  };

  const loginWithAuthConnection = async (authConnection: string) => {
    if (!web3Auth) {
      throw new Error("Web3Auth is not initialized yet.");
    }

    const provider = await connectTo(WALLET_CONNECTORS.AUTH, {
      authConnection: authConnection as any,
    });

    return finalizeLogin(provider);
  };

  const logout = async () => {
    try {
      await disconnect({ cleanup: true });
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
    loginWithAuthConnection,
    logout,
    isLoggedIn: isConnected,
    isLoading: loading || disconnectLoading,
    web3Auth
  };
}
