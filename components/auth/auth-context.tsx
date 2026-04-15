"use client";

import {
  createContext,
  useEffect,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import {
  getPrivyDisplayName,
  getPrivyEmail,
  getPrivyProfileImage,
  getPrivyWalletAddress,
} from "@/lib/auth/privy-user";
import { authFetch } from "@/lib/auth/authFetch";

type AuthUserInfo = {
  id: string;
  name: string | null;
  email: string | null;
  profileImage: string | null;
  walletAddress: string | null;
};

export type AuthContextValue = {
  ready: boolean;
  authenticated: boolean;
  user: any;
  userInfo: AuthUserInfo | null;
  walletAddress: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  connectWallet?: () => Promise<unknown>;
  isLoading: boolean;
};
const AuthContext = createContext<AuthContextValue | null>(null);

export function PrivyAuthBridge({ children }: { children: ReactNode }) {
  const { login } = useLogin();
  const { ready, authenticated, user, logout, connectWallet } = usePrivy();
  const lastSyncedRef = useRef<string | null>(null);

  const userInfo = useMemo(() => {
    if (!user) return null;

    return {
      id: user.id,
      name: getPrivyDisplayName(user),
      email: getPrivyEmail(user),
      profileImage: getPrivyProfileImage(user),
      walletAddress: getPrivyWalletAddress(user),
    };
  }, [user]);

  const syncKey = useMemo(() => {
    if (!authenticated || !userInfo) return null;
    return JSON.stringify({
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      profileImage: userInfo.profileImage,
      walletAddress: userInfo.walletAddress,
    });
  }, [authenticated, userInfo]);

  useEffect(() => {
    if (!authenticated) {
      lastSyncedRef.current = null;
    }
  }, [authenticated]);

  useEffect(() => {
    if (!ready || !authenticated || !userInfo || !syncKey) return;
    if (lastSyncedRef.current === syncKey) return;

    let cancelled = false;

    const sync = async () => {
      try {
        const response = await authFetch("/api/auth/sync", {
          method: "POST",
          body: JSON.stringify({
            email: userInfo.email,
            name: userInfo.name,
            profileImage: userInfo.profileImage,
            walletAddress: userInfo.walletAddress,
          }),
        });

        if (!response.ok) {
          throw new Error(`sync failed with status ${response.status}`);
        }

        if (!cancelled) {
          lastSyncedRef.current = syncKey;
        }
      } catch (error) {
        if (!cancelled) {
          console.error("[auth] failed to sync app user", error);
        }
      }
    };

    void sync();

    return () => {
      cancelled = true;
    };
  }, [authenticated, ready, syncKey, userInfo]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ready,
      authenticated,
      user,
      userInfo,
      walletAddress: userInfo?.walletAddress ?? null,
      login: async () => {
        login();
      },
      logout,
      connectWallet: async () => {
        if (connectWallet) {
          return connectWallet();
        }
      },
      isLoading: !ready,
    }),
    [authenticated, connectWallet, login, logout, ready, user, userInfo]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuthContext must be used within PrivyAuthBridge");
  }
  return value;
}
