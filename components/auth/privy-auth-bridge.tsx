"use client";

import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useCallback, useEffect, useMemo, useRef, type ReactNode } from "react";

import {
  AuthContextProvider,
  registerDeferredLoginHandler,
} from "@/components/auth/auth-context";
import {
  getPrivyDisplayName,
  getPrivyEmail,
  getPrivyProfileImage,
  getPrivyWalletAddress,
} from "@/lib/auth/privy-user";
import { authFetch } from "@/lib/auth/authFetch";

export function PrivyAuthBridge({
  children,
  onReady,
}: {
  children: ReactNode;
  onReady?: () => void;
}) {
  const { login } = useLogin();
  const { ready, authenticated, user, logout, connectWallet } = usePrivy();
  const lastSyncedRef = useRef<string | null>(null);
  const loginRef = useRef(login);
  const onReadyRef = useRef(onReady);

  loginRef.current = login;
  onReadyRef.current = onReady;

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
    if (!ready) return;

    const unregisterLoginHandler = registerDeferredLoginHandler(() => {
      loginRef.current();
    });
    onReadyRef.current?.();

    return unregisterLoginHandler;
  }, [ready]);

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

  const loginWithPrivy = useCallback(async () => {
    loginRef.current();
  }, []);

  const value = useMemo(
    () => ({
      ready,
      authenticated,
      user,
      userInfo,
      walletAddress: userInfo?.walletAddress ?? null,
      login: loginWithPrivy,
      logout,
      connectWallet: async () => {
        if (connectWallet) {
          return connectWallet();
        }
      },
      isLoading: !ready,
    }),
    [authenticated, connectWallet, loginWithPrivy, logout, ready, user, userInfo]
  );

  return <AuthContextProvider value={value}>{children}</AuthContextProvider>;
}
