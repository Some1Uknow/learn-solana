"use client";

import { useWeb3AuthConnect, useWeb3Auth as useWeb3AuthCore } from "@web3auth/modal/react";

export function useWeb3Auth() {
  const { connect, isConnected, loading } = useWeb3AuthConnect();
  const { web3Auth } = useWeb3AuthCore();

  const login = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  return {
    login,
    isLoggedIn: isConnected,
    isLoading: loading,
    web3Auth
  };
}
