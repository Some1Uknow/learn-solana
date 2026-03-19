'use client';

import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import {
  useIdentityToken,
  useWeb3Auth as useWeb3AuthCore,
  useWeb3AuthConnect,
  useWeb3AuthDisconnect,
  useWeb3AuthUser,
} from '@web3auth/modal/react';
import { useSolanaWallet } from '@web3auth/modal/react/solana';
import { WALLET_CONNECTORS } from '@web3auth/modal';
import { registerUserAfterLogin } from '@/lib/auth/registerUserAfterLogin';
import {
  clearClientAuthState,
  persistClientAuthToken,
} from '@/lib/auth/session';
import {
  connectBrowserWallet,
  getNativeWalletSession,
  getStoredNativeWalletSelection,
  listBrowserWallets,
  persistNativeWalletSession,
  restoreNativeWalletProvider,
  signBrowserWalletMessage,
  type BrowserWalletOption,
  type BrowserWalletSession,
} from '@/lib/auth/browserWallet';

interface SessionUserInfo {
  walletAddress: string | null;
  email?: string | null;
  name?: string | null;
  profileImage?: string | null;
  authMethod?: string | null;
  source?: string | null;
}

interface AuthStoreSnapshot {
  sessionUser: SessionUserInfo | null;
  sessionReady: boolean;
  nativeWalletSession: BrowserWalletSession | null;
  nativeLoginLoading: boolean;
  browserWallets: BrowserWalletOption[];
  globalAuthLoading: boolean;
}

const authStoreListeners = new Set<() => void>();
let authStoreSnapshot: AuthStoreSnapshot = {
  sessionUser: null,
  sessionReady: false,
  nativeWalletSession: null,
  nativeLoginLoading: false,
  browserWallets: [],
  globalAuthLoading: false,
};
let sessionLoadPromise: Promise<SessionUserInfo | null> | null = null;

function subscribeAuthStore(listener: () => void) {
  authStoreListeners.add(listener);
  return () => authStoreListeners.delete(listener);
}

function getAuthStoreSnapshot() {
  return authStoreSnapshot;
}

function updateAuthStore(partial: Partial<AuthStoreSnapshot>) {
  authStoreSnapshot = { ...authStoreSnapshot, ...partial };
  authStoreListeners.forEach((listener) => listener());
}

export function useWeb3Auth() {
  const { connectTo, isConnected, loading, error, connectorName } =
    useWeb3AuthConnect();
  const { disconnect, loading: disconnectLoading } = useWeb3AuthDisconnect();
  const {
    provider: web3AuthProvider,
    web3Auth,
    status,
    isAuthorized,
    isInitialized,
    isInitializing,
    initError,
  } = useWeb3AuthCore();
  const { userInfo: web3AuthUserInfo, getUserInfo } = useWeb3AuthUser();
  const { token } = useIdentityToken();
  const { accounts } = useSolanaWallet();
  const authState = useSyncExternalStore(
    subscribeAuthStore,
    getAuthStoreSnapshot,
    getAuthStoreSnapshot
  );
  const {
    sessionUser,
    sessionReady,
    nativeWalletSession,
    nativeLoginLoading,
    browserWallets,
    globalAuthLoading,
  } = authState;

  const walletAddress =
    accounts?.[0] ?? nativeWalletSession?.walletAddress ?? sessionUser?.walletAddress ?? null;

  const resolvedProvider = web3AuthProvider ?? nativeWalletSession?.provider ?? null;

  const resolvedUserInfo = useMemo(() => {
    if (web3AuthUserInfo) return web3AuthUserInfo;
    if (!sessionUser) return null;
    return {
      email: sessionUser.email ?? undefined,
      name: sessionUser.name ?? undefined,
      profileImage: sessionUser.profileImage ?? undefined,
    };
  }, [sessionUser, web3AuthUserInfo]);

  const resolvedConnected = Boolean(isConnected || sessionUser?.walletAddress);

  const refreshBrowserWallets = useCallback(() => {
    updateAuthStore({ browserWallets: listBrowserWallets() });
  }, []);

  useEffect(() => {
    refreshBrowserWallets();
  }, [refreshBrowserWallets]);

  useEffect(() => {
    if (token) {
      persistClientAuthToken(token);
    }
  }, [token]);

  const loadSession = useCallback(async () => {
    let nextUser: SessionUserInfo | null = null;
    try {
      const res = await fetch('/api/auth/verify', { cache: 'no-store' });
      if (!res.ok) {
        updateAuthStore({ sessionUser: null, sessionReady: true });
        return null;
      }

      const data = await res.json();
      nextUser = data?.authenticated
        ? {
            walletAddress: data?.user?.walletAddress ?? null,
            email: data?.user?.email ?? null,
            name: data?.user?.name ?? null,
            profileImage: data?.user?.profileImage ?? null,
            authMethod: data?.user?.authMethod ?? null,
            source: data?.user?.source ?? null,
          }
        : null;

      updateAuthStore({
        sessionUser: nextUser?.walletAddress ? nextUser : null,
        sessionReady: true,
      });

      if (nextUser?.authMethod === 'native_wallet' && nextUser.walletAddress) {
        const current = getNativeWalletSession();
        if (current?.walletAddress === nextUser.walletAddress) {
          updateAuthStore({ nativeWalletSession: current });
        } else {
          const stored = getStoredNativeWalletSelection();
          if (stored?.walletAddress === nextUser.walletAddress) {
            const restored = await restoreNativeWalletProvider(
              stored.walletId,
              stored.walletAddress
            );
            if (restored) {
              updateAuthStore({ nativeWalletSession: restored });
            }
          }
        }
      } else if (!nextUser) {
        updateAuthStore({ nativeWalletSession: getNativeWalletSession() });
      }

      return nextUser;
    } catch {
      updateAuthStore({ sessionUser: null, sessionReady: true });
      return null;
    }
  }, []);

  useEffect(() => {
    if (authStoreSnapshot.sessionReady) {
      return;
    }

    if (!sessionLoadPromise) {
      sessionLoadPromise = loadSession().finally(() => {
        sessionLoadPromise = null;
      });
    }
  }, [loadSession]);

  const finalizeLogin = async (connectedProvider: unknown) => {
    if (!connectedProvider || !web3Auth) {
      throw (
        error ??
        new Error(
          'Wallet login did not complete. The wallet modal may have been closed, blocked by the browser, or interrupted.'
        )
      );
    }

    try {
      const result = await registerUserAfterLogin(connectedProvider as any, web3Auth as any);
      if (result.success && result.user) {
        const nextUser = {
          walletAddress: result.user.walletAddress ?? null,
          email: result.user.email ?? null,
          name: result.user.name ?? null,
          profileImage: result.user.profileImage ?? null,
          authMethod: connectorName ?? 'social',
          source: 'web3auth',
        };
        updateAuthStore({ sessionUser: nextUser, sessionReady: true });
        await loadSession();
      } else if (!result.success) {
        console.warn('[useWeb3Auth] post-login registration failed:', result.error);
      }
    } catch (registrationError) {
      console.warn('[useWeb3Auth] post-login registration error:', registrationError);
    }

    return connectedProvider;
  };

  const login = async () => loginWithAuthConnection('google');

  const loginWithAuthConnection = async (authConnection: string) => {
    if (!web3Auth) {
      throw new Error('Web3Auth is not initialized yet.');
    }

    updateAuthStore({ globalAuthLoading: true });

    try {
      const connectedProvider = await connectTo(WALLET_CONNECTORS.AUTH, {
        authConnection: authConnection as any,
      });

      void finalizeLogin(connectedProvider).finally(() => {
        updateAuthStore({ globalAuthLoading: false });
      });

      return connectedProvider;
    } catch (loginError) {
      updateAuthStore({ globalAuthLoading: false });
      throw loginError;
    }
  };

  const loginWithNativeWallet = async (walletId: string) => {
    updateAuthStore({ nativeLoginLoading: true, globalAuthLoading: true });
    try {
      const previewWallets = listBrowserWallets();
      const selectedWallet = previewWallets.find((wallet) => wallet.id === walletId);
      if (!selectedWallet) {
        throw new Error('Selected wallet is not available.');
      }

      const connected = await connectBrowserWallet(walletId);

      const challengeRes = await fetch('/api/auth/wallet/challenge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: connected.walletAddress }),
      });

      if (!challengeRes.ok) {
        const text = await challengeRes.text();
        throw new Error(text || 'Failed to prepare wallet login challenge');
      }

      const challenge = await challengeRes.json();
      const signature = await signBrowserWalletMessage(walletId, challenge.message);

      const verifyRes = await fetch('/api/auth/wallet/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress: connected.walletAddress,
          signature,
          challengeToken: challenge.challengeToken,
          walletName: selectedWallet.name,
        }),
      });

      if (!verifyRes.ok) {
        const text = await verifyRes.text();
        throw new Error(text || 'Wallet login verification failed');
      }

      const data = await verifyRes.json();
      const nativeSession = {
        walletId: connected.walletId,
        walletName: connected.walletName,
        walletAddress: connected.walletAddress,
        provider: connected.provider,
      };
      persistNativeWalletSession(nativeSession);
      updateAuthStore({ nativeWalletSession: nativeSession });

      const nextUser = {
        walletAddress: data?.user?.walletAddress ?? connected.walletAddress,
        email: data?.user?.email ?? null,
        name: data?.user?.name ?? connected.walletName,
        profileImage: data?.user?.profileImage ?? null,
        authMethod: 'native_wallet',
        source: 'app_session',
      };
      updateAuthStore({ sessionUser: nextUser, sessionReady: true });
      await loadSession();
      return connected.provider;
    } finally {
      updateAuthStore({ nativeLoginLoading: false, globalAuthLoading: false });
    }
  };

  const logout = async () => {
    updateAuthStore({ globalAuthLoading: true });
    try {
      if (web3Auth && isConnected) {
        await disconnect({ cleanup: true });
      }
    } finally {
      persistNativeWalletSession(null);
      updateAuthStore({
        nativeWalletSession: null,
        sessionUser: null,
        sessionReady: true,
      });
      clearClientAuthState();
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (cleanupError) {
        console.warn('[useWeb3Auth] logout cleanup request failed:', cleanupError);
      }
      await loadSession();
      updateAuthStore({ globalAuthLoading: false });
    }
  };

  return {
    login,
    loginWithAuthConnection,
    loginWithNativeWallet,
    logout,
    browserWallets,
    refreshBrowserWallets,
    isLoggedIn: resolvedConnected,
    isConnected: resolvedConnected,
    isAuthorized,
    isInitialized,
    isInitializing,
    sessionReady,
    isLoading: loading || disconnectLoading || nativeLoginLoading || globalAuthLoading,
    error,
    initError,
    provider: resolvedProvider,
    web3Auth,
    status,
    connectorName,
    connectedConnectorName: web3Auth?.connectedConnectorName ?? null,
    walletAddress,
    userInfo: resolvedUserInfo,
    authMethod: sessionUser?.authMethod ?? connectorName ?? null,
    authSource: sessionUser?.source ?? (isConnected ? 'web3auth' : null),
    getUserInfo,
    identityToken: token,
    nativeWalletSession,
  };
}
