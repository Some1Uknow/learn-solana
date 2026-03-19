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
import { authFetch } from '@/lib/auth/authFetch';
import {
  clearClientAuthState,
  persistClientAuthToken,
} from '@/lib/auth/session';
import { getPrimarySolanaAccount } from '@/lib/auth/web3auth-solana';
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

type AuthPhase = 'idle' | 'connecting' | 'social_finalizing' | 'signing_out';

interface AuthStoreSnapshot {
  sessionUser: SessionUserInfo | null;
  sessionReady: boolean;
  nativeWalletSession: BrowserWalletSession | null;
  nativeLoginLoading: boolean;
  browserWallets: BrowserWalletOption[];
  globalAuthLoading: boolean;
  authPhase: AuthPhase;
}

const authStoreListeners = new Set<() => void>();
let authStoreSnapshot: AuthStoreSnapshot = {
  sessionUser: null,
  sessionReady: false,
  nativeWalletSession: null,
  nativeLoginLoading: false,
  browserWallets: [],
  globalAuthLoading: false,
  authPhase: 'idle',
};
let sessionLoadPromise: Promise<SessionUserInfo | null> | null = null;
let pendingSocialProvider: unknown | null = null;
let socialFinalizePromise: Promise<unknown> | null = null;
let socialRecoveryAttemptKey: string | null = null;

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
    authPhase,
  } = authState;

  const walletAddress =
    accounts?.[0] ?? nativeWalletSession?.walletAddress ?? sessionUser?.walletAddress ?? null;

  const resolvedProvider = web3AuthProvider ?? nativeWalletSession?.provider ?? null;
  const connectedSocialConnector =
    (web3Auth?.connectedConnectorName ?? connectorName) === WALLET_CONNECTORS.AUTH;
  const hasFinalizedSocialSession =
    sessionUser?.source === 'app_session' && sessionUser?.authMethod === 'social';
  const isRecoveringSocialSession =
    connectedSocialConnector &&
    !nativeWalletSession &&
    (isConnected || status === 'connecting' || status === 'connected' || isInitializing) &&
    (!sessionReady || !hasFinalizedSocialSession);
  const effectiveAuthPhase =
    authPhase === 'idle' && isRecoveringSocialSession
      ? 'social_finalizing'
      : authPhase;
  const combinedLoading =
    loading ||
    disconnectLoading ||
    nativeLoginLoading ||
    globalAuthLoading ||
    isRecoveringSocialSession;

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
      const res = await authFetch('/api/auth/verify', {
        cache: 'no-store',
      });
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

  const finalizeLogin = useCallback(async (
    connectedProvider: unknown,
    resolvedWalletAddress?: string | null
  ) => {
    if (!connectedProvider || !web3Auth) {
      throw (
        error ??
        new Error(
          'Wallet login did not complete. The wallet modal may have been closed, blocked by the browser, or interrupted.'
        )
      );
    }

    try {
      const result = await registerUserAfterLogin(
        connectedProvider as any,
        web3Auth as any,
        undefined,
        8,
        resolvedWalletAddress
      );
      if (result.success && result.user?.walletAddress) {
        const syncedUser = await loadSession();
        const nextUser = syncedUser?.walletAddress
          ? syncedUser
          : {
              walletAddress: result.user.walletAddress ?? null,
              email: result.user.email ?? null,
              name: result.user.name ?? null,
              profileImage: result.user.profileImage ?? null,
              authMethod: connectorName ?? 'social',
              source: 'web3auth',
            };
        updateAuthStore({
          sessionUser: nextUser,
          sessionReady: true,
          authPhase: 'idle',
        });
        pendingSocialProvider = null;
      } else {
        throw new Error(result.error || 'Post-login registration did not complete.');
      }
    } catch (registrationError) {
      console.warn('[useWeb3Auth] post-login registration error:', registrationError);
      updateAuthStore({ authPhase: 'idle' });
      pendingSocialProvider = null;
      throw registrationError;
    }

    return connectedProvider;
  }, [error, web3Auth, connectorName]);

  useEffect(() => {
    if (
      authPhase !== 'social_finalizing' ||
      !pendingSocialProvider ||
      sessionUser?.walletAddress ||
      socialFinalizePromise
    ) {
      return;
    }

    socialFinalizePromise = (async () => {
      const resolvedWalletAddress =
        accounts?.[0] ??
        await getPrimarySolanaAccount(pendingSocialProvider as any);

      await finalizeLogin(pendingSocialProvider, resolvedWalletAddress);
    })().finally(() => {
      socialFinalizePromise = null;
    });
  }, [accounts, authPhase, finalizeLogin, sessionUser?.walletAddress]);

  useEffect(() => {
    if (!resolvedConnected) {
      socialRecoveryAttemptKey = null;
    }
  }, [resolvedConnected]);

  useEffect(() => {
    if (
      !sessionReady ||
      !connectedSocialConnector ||
      !resolvedProvider ||
      nativeWalletSession ||
      authPhase !== 'idle' ||
      socialFinalizePromise ||
      hasFinalizedSocialSession
    ) {
      return;
    }

    const recoveryWalletAddress =
      accounts?.[0] ?? sessionUser?.walletAddress ?? null;
    const recoveryKey = `${web3Auth?.connectedConnectorName ?? connectorName ?? 'auth'}:${
      recoveryWalletAddress ?? 'pending'
    }`;

    if (socialRecoveryAttemptKey === recoveryKey) {
      return;
    }

    socialRecoveryAttemptKey = recoveryKey;
    pendingSocialProvider = resolvedProvider;
    updateAuthStore({
      globalAuthLoading: true,
      authPhase: 'social_finalizing',
    });

    socialFinalizePromise = (async () => {
      try {
        const nextWalletAddress =
          recoveryWalletAddress ??
          (await getPrimarySolanaAccount(resolvedProvider as any));

        await finalizeLogin(resolvedProvider, nextWalletAddress);
      } catch (error) {
        socialRecoveryAttemptKey = null;
        console.warn('[useWeb3Auth] recovered social finalize failed:', error);
      } finally {
        socialFinalizePromise = null;
        updateAuthStore({ globalAuthLoading: false });
      }
    })();
  }, [
    accounts,
    authPhase,
    connectorName,
    finalizeLogin,
    nativeWalletSession,
    resolvedProvider,
    sessionReady,
    sessionUser?.authMethod,
    sessionUser?.source,
    sessionUser?.walletAddress,
    web3Auth?.connectedConnectorName,
  ]);

  const login = async () => loginWithAuthConnection('google');

  const loginWithAuthConnection = async (authConnection: string) => {
    if (!web3Auth) {
      throw new Error('Web3Auth is not initialized yet.');
    }

    updateAuthStore({ globalAuthLoading: true, authPhase: 'connecting' });

    try {
      const connectedProvider = await connectTo(WALLET_CONNECTORS.AUTH, {
        authConnection: authConnection as any,
      });

      pendingSocialProvider = connectedProvider;
      updateAuthStore({ authPhase: 'social_finalizing' });
      socialFinalizePromise = finalizeLogin(
        connectedProvider,
        accounts?.[0] ?? null
      ).finally(() => {
        socialFinalizePromise = null;
      });
      await socialFinalizePromise;
      updateAuthStore({ globalAuthLoading: false });

      return connectedProvider;
    } catch (loginError) {
      updateAuthStore({ globalAuthLoading: false, authPhase: 'idle' });
      throw loginError;
    }
  };

  const loginWithNativeWallet = async (walletId: string) => {
    updateAuthStore({
      nativeLoginLoading: true,
      globalAuthLoading: true,
      authPhase: 'connecting',
    });
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
      updateAuthStore({
        sessionUser: nextUser,
        sessionReady: true,
        authPhase: 'idle',
      });
      await loadSession();
      return connected.provider;
    } finally {
      updateAuthStore({
        nativeLoginLoading: false,
        globalAuthLoading: false,
        authPhase: 'idle',
      });
    }
  };

  const logout = async () => {
    updateAuthStore({ globalAuthLoading: true, authPhase: 'signing_out' });
    try {
      if (web3Auth && isConnected) {
        await disconnect({ cleanup: true });
      }
    } finally {
      pendingSocialProvider = null;
      socialFinalizePromise = null;
      socialRecoveryAttemptKey = null;
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
      updateAuthStore({ globalAuthLoading: false, authPhase: 'idle' });
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
    isLoading: combinedLoading,
    authPhase: effectiveAuthPhase,
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
