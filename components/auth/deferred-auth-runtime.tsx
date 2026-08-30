"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

import { requestDeferredLogin } from "@/components/auth/auth-context";

type DeferredAuthRuntimeValue = {
  active: boolean;
  requestLogin: () => Promise<void>;
};

type DeferredPrivyProvider = ComponentType<{
  children: ReactNode;
  onReady?: () => void;
}>;

let privyProviderPromise: Promise<DeferredPrivyProvider> | null = null;

function loadPrivyProvider() {
  if (!privyProviderPromise) {
    privyProviderPromise = import("@/components/auth/privy-provider")
      .then(({ default: Provider }) => Provider)
      .catch((error) => {
        privyProviderPromise = null;
        throw error;
      });
  }

  return privyProviderPromise;
}

export function preloadDeferredAuth() {
  return loadPrivyProvider();
}

const defaultRuntimeValue: DeferredAuthRuntimeValue = {
  active: false,
  requestLogin: requestDeferredLogin,
};

const DeferredAuthRuntimeContext = createContext(defaultRuntimeValue);

export function useDeferredAuthRuntime() {
  return useContext(DeferredAuthRuntimeContext);
}

export default function DeferredAuthRuntime({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [shouldLoad, setShouldLoad] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [PrivyProvider, setPrivyProvider] = useState<DeferredPrivyProvider | null>(null);

  const requestLogin = useCallback(() => {
    setShouldLoad(true);
    return requestDeferredLogin();
  }, []);

  useEffect(() => {
    const hasExistingSession = document.cookie
      .split(";")
      .some(
        (cookie) =>
          cookie.trim().startsWith("privy-token=") ||
          cookie.trim().startsWith("privy_token=")
      );

    if (pathname !== "/" || hasExistingSession) {
      setShouldLoad(true);
      return;
    }

    // Give the public landing page its first paint before restoring auth state.
    const timeoutId = window.setTimeout(() => setShouldLoad(true), 10000);
    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  useEffect(() => {
    if (!shouldLoad || PrivyProvider) return;

    let mounted = true;

    void loadPrivyProvider()
      .then((Provider) => {
        if (mounted) {
          setPrivyProvider(() => Provider);
        }
      })
      .catch((error) => {
        if (mounted) {
          console.error("[auth] failed to load Privy", error);
        }
      });

    return () => {
      mounted = false;
    };
  }, [PrivyProvider, shouldLoad]);

  const handleAuthReady = useCallback(() => {
    setAuthReady(true);
  }, []);

  const runtimeValue = useMemo(
    () => ({ active: authReady, requestLogin }),
    [authReady, requestLogin]
  );

  const content = PrivyProvider ? (
    <PrivyProvider onReady={handleAuthReady}>{children}</PrivyProvider>
  ) : (
    children
  );

  return (
    <DeferredAuthRuntimeContext.Provider value={runtimeValue}>
      {content}
    </DeferredAuthRuntimeContext.Provider>
  );
}
