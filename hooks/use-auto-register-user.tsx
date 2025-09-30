"use client";
import { useEffect, useRef } from 'react';
import { useWeb3Auth, useWeb3AuthUser } from '@web3auth/modal/react';
import { SolanaWallet } from '@web3auth/solana-provider';
import { SIGN_MESSAGE_PREFIX } from '@/lib/solana/signature';

interface Options { onRegistered?: (user: any) => void }

function persistWeb3AuthToken(token: string | undefined | null) {
  if (!token || typeof window === 'undefined') return;
  try {
    (window as any).__WEB3AUTH_ID_TOKEN = token;
    const parts = [
      `web3auth_token=${token}`,
      'Path=/',
      'SameSite=Lax',
      'Max-Age=604800',
    ];
    if (window.location?.protocol === 'https:') {
      parts.push('Secure');
    }
    document.cookie = parts.join('; ');
  } catch (err) {
    console.warn('[useAutoRegisterUser] failed to persist token', err);
  }
}

export function useAutoRegisterUser(walletAddress: string | undefined, opts: Options = {}) {
  const { web3Auth, isConnected } = useWeb3Auth();
  const { userInfo } = useWeb3AuthUser();
  const attemptedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function attemptRegistration(attempt = 0) {
      if (!walletAddress || attemptedRef.current || cancelled) return;

      let idToken: string | undefined;
      let isExternalWallet = false;

      try {
        const connectedAdapter = (web3Auth as any)?.connectedAdapterName as string | undefined;
        if (connectedAdapter) {
          isExternalWallet = ['metamask', 'phantom', 'wallet-connect-v2', 'solflare', 'slope', 'sollet']
            .includes(connectedAdapter.toLowerCase());
        }
        // Try to get an idToken for social logins
        if (!isExternalWallet) {
          const tokenResult: any = await (web3Auth as any)?.authenticateUser?.();
          idToken = typeof tokenResult === 'string' ? tokenResult : tokenResult?.idToken || tokenResult?.token;
          if (!idToken && userInfo) {
            const possible = (userInfo as any).idToken || (userInfo as any).token;
            if (typeof possible === 'string') idToken = possible;
          }
          persistWeb3AuthToken(idToken);
        }
      } catch (e) {
        // ignore and continue
      }

      // Fallback heuristic: if no idToken after a couple retries, treat as external
      if (!idToken && attempt >= 2) {
        isExternalWallet = true;
      }

      // External wallet path (no idToken)
      if (!idToken && isExternalWallet) {
        try {
          const ts = Date.now();
          const message = `${SIGN_MESSAGE_PREFIX}${walletAddress}`;
          let signature: string | undefined;
          try {
            const provider: any = (web3Auth as any)?.provider;
            if (provider) {
              // Prefer SolanaWallet.signMessage for Solana
              const wallet = new SolanaWallet(provider);
              const sigBytes = await wallet.signMessage(new TextEncoder().encode(message));
              const { default: bs58 } = await import('bs58');
              signature = bs58.encode(sigBytes);
            }
          } catch (signErr) {
            console.warn('[useAutoRegisterUser] signMessage unavailable, proceeding without signature');
          }

          const res = await fetch('/api/user/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Wallet-Address': walletAddress,
              ...(signature ? { 'X-Wallet-Signature': signature } : {}),
            },
            body: JSON.stringify({
              walletAddress,
              authType: 'external_wallet',
              connectedAdapter: (web3Auth as any)?.connectedAdapterName,
              signature: signature || null,
              message,
              timestamp: ts,
              email: null,
              name: null,
              profileImage: null,
            })
          });
          if (!res.ok) {
            const txt = await res.text();
            console.error('[useAutoRegisterUser] external register failed', res.status, txt);
            if (res.status === 401 && attempt < 4) {
              const delay = 800 * Math.pow(2, attempt);
              setTimeout(() => attemptRegistration(attempt + 1), delay);
            }
            return;
          }
          const data = await res.json();
          if (cancelled) return;
          attemptedRef.current = true;
          opts.onRegistered?.(data.user);
          console.log('[useAutoRegisterUser] user registered (external)');
          return;
        } catch (err) {
          console.error('[useAutoRegisterUser] external registration error', err);
          if (attempt < 4) setTimeout(() => attemptRegistration(attempt + 1), 800 * Math.pow(2, attempt));
          return;
        }
      }

      // Social path
      if (!idToken) {
        // keep trying a few times for social tokens
        if (attempt < 6) {
          const delay = 500 * Math.pow(2, attempt);
          console.log('[useAutoRegisterUser] no token yet, retrying in', delay, 'ms');
          setTimeout(() => attemptRegistration(attempt + 1), delay);
        } else {
          console.error('[useAutoRegisterUser] token not available; stop retrying');
        }
        return;
      }

      try {
        persistWeb3AuthToken(idToken);
        const res = await fetch('/api/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            walletAddress,
            authType: 'social',
            email: (userInfo as any)?.email,
            name: (userInfo as any)?.name,
            profileImage: (userInfo as any)?.profileImage,
          })
        });
        if (!res.ok) {
          const txt = await res.text();
          console.error('[useAutoRegisterUser] social register failed', res.status, txt);
          if (res.status === 401 && attempt < 5) {
            const delay = 600 * Math.pow(2, attempt);
            setTimeout(() => attemptRegistration(attempt + 1), delay);
          }
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        attemptedRef.current = true;
        opts.onRegistered?.(data.user);
        console.log('[useAutoRegisterUser] user registered (social)');
      } catch (err) {
        console.error('[useAutoRegisterUser] social register network error', err);
        if (attempt < 5) setTimeout(() => attemptRegistration(attempt + 1), 600 * Math.pow(2, attempt));
      }
    }
    attemptRegistration();
    return () => { cancelled = true; };
  }, [walletAddress, isConnected, web3Auth, userInfo, opts]);
}
