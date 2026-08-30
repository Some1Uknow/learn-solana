"use client";

import { createContext, useContext, type ReactNode } from "react";

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

type DeferredLoginHandler = () => Promise<void> | void;

let deferredLoginHandler: DeferredLoginHandler | null = null;
let loginRequestedBeforeProvider = false;

export function requestDeferredLogin() {
  if (!deferredLoginHandler) {
    loginRequestedBeforeProvider = true;
    return Promise.resolve();
  }

  try {
    return Promise.resolve(deferredLoginHandler());
  } catch (error) {
    return Promise.reject(error);
  }
}

export function registerDeferredLoginHandler(handler: DeferredLoginHandler) {
  deferredLoginHandler = handler;

  if (loginRequestedBeforeProvider) {
    loginRequestedBeforeProvider = false;
    void Promise.resolve(handler()).catch((error) => {
      console.error("[auth] deferred login failed", error);
    });
  }

  return () => {
    if (deferredLoginHandler === handler) {
      deferredLoginHandler = null;
    }
  };
}

const anonymousAuthValue: AuthContextValue = {
  ready: false,
  authenticated: false,
  user: null,
  userInfo: null,
  walletAddress: null,
  login: requestDeferredLogin,
  logout: async () => undefined,
  connectWallet: async () => undefined,
  isLoading: true,
};

const AuthContext = createContext<AuthContextValue>(anonymousAuthValue);

export function AuthContextProvider({
  value,
  children,
}: {
  value: AuthContextValue;
  children: ReactNode;
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
