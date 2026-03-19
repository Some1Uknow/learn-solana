'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
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

const AUTH_STATE_EVENT = 'learnsol:auth-changed';
const AUTH_PENDING_EVENT = 'learnsol:auth-pending';

interface SessionUserInfo {
  walletAddress: string | null;
  email?: string | null;
  name?: string | null;
  profileImage?: string | null;
  authMethod?: string | null;
  source?: string | null;
}

function emitAuthState(user: SessionUserInfo | null) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(AUTH_STATE_EVENT, { detail: { user } }));
}

function emitAuthPending(isPending: boolean) {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(AUTH_PENDING_EVENT, { detail: { isPending } }));
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

  const [sessionUser, setSessionUser] = useState<SessionUserInfo | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [nativeWalletSession, setNativeWalletSession] = useState<BrowserWalletSession | null>(
    () => getNativeWalletSession()
  );
  const [nativeLoginLoading, setNativeLoginLoading] = useState(false);
  const [browserWallets, setBrowserWallets] = useState<BrowserWalletOption[]>([]);
  const [globalAuthLoading, setGlobalAuthLoading] = useState(false);

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
    setBrowserWallets(listBrowserWallets());
  }, []);

  useEffect(() => {
    refreshBrowserWallets();
  }, []);

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
        setSessionUser(null);
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

      setSessionUser(nextUser?.walletAddress ? nextUser : null);

      if (nextUser?.authMethod === 'native_wallet' && nextUser.walletAddress) {
        const current = getNativeWalletSession();
        if (current?.walletAddress === nextUser.walletAddress) {
          setNativeWalletSession(current);
        } else {
          const stored = getStoredNativeWalletSelection();
          if (stored?.walletAddress === nextUser.walletAddress) {
            const restored = await restoreNativeWalletProvider(
              stored.walletId,
              stored.walletAddress
            );
            if (restored) {
              setNativeWalletSession(restored);
            }
          }
        }
      }

      return nextUser;
    } catch {
      setSessionUser(null);
      return null;
    } finally {
      setSessionReady(true);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function hydrateSession() {
      try {
        const nextUser = await loadSession();
        if (cancelled) {
          return;
        }
        if (!nextUser) {
          setNativeWalletSession(getNativeWalletSession());
        }
      } catch {
        if (!cancelled) setSessionReady(true);
      }
    }

    hydrateSession();

    return () => {
      cancelled = true;
    };
  }, [loadSession]);

  useEffect(() => {
    const listener = (event: Event) => {
      const detail = (event as CustomEvent<{ user: SessionUserInfo | null }>).detail;
      setSessionUser(detail?.user ?? null);
      setNativeWalletSession(getNativeWalletSession());
    };

    const pendingListener = (event: Event) => {
      const detail = (event as CustomEvent<{ isPending: boolean }>).detail;
      setGlobalAuthLoading(Boolean(detail?.isPending));
    };

    window.addEventListener(AUTH_STATE_EVENT, listener as EventListener);
    window.addEventListener(AUTH_PENDING_EVENT, pendingListener as EventListener);
    return () => {
      window.removeEventListener(AUTH_STATE_EVENT, listener as EventListener);
      window.removeEventListener(AUTH_PENDING_EVENT, pendingListener as EventListener);
    };
  }, []);

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
        setSessionUser(nextUser);
        emitAuthState(nextUser);
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

    setGlobalAuthLoading(true);
    emitAuthPending(true);

    try {
      const connectedProvider = await connectTo(WALLET_CONNECTORS.AUTH, {
        authConnection: authConnection as any,
      });

      return await finalizeLogin(connectedProvider);
    } finally {
      setGlobalAuthLoading(false);
      emitAuthPending(false);
    }
  };

  const loginWithNativeWallet = async (walletId: string) => {
    setNativeLoginLoading(true);
    setGlobalAuthLoading(true);
    emitAuthPending(true);
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
      setNativeWalletSession(nativeSession);

      const nextUser = {
        walletAddress: data?.user?.walletAddress ?? connected.walletAddress,
        email: data?.user?.email ?? null,
        name: data?.user?.name ?? connected.walletName,
        profileImage: data?.user?.profileImage ?? null,
        authMethod: 'native_wallet',
        source: 'app_session',
      };
      setSessionUser(nextUser);
      emitAuthState(nextUser);
      await loadSession();
      return connected.provider;
    } finally {
      setNativeLoginLoading(false);
      setGlobalAuthLoading(false);
      emitAuthPending(false);
    }
  };

  const logout = async () => {
    setGlobalAuthLoading(true);
    emitAuthPending(true);
    try {
      if (web3Auth && isConnected) {
        await disconnect({ cleanup: true });
      }
    } finally {
      persistNativeWalletSession(null);
      setNativeWalletSession(null);
      setSessionUser(null);
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
      emitAuthState(null);
      await loadSession();
      setGlobalAuthLoading(false);
      emitAuthPending(false);
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
