"use client";
import { useEffect, useRef } from 'react';
import { useWeb3Auth, useWeb3AuthUser } from '@web3auth/modal/react';

interface Options { onRegistered?: (user: any) => void; }

export function useAutoRegisterUser(walletAddress: string | undefined, opts: Options = {}) {
  const { web3Auth } = useWeb3Auth();
  const { userInfo } = useWeb3AuthUser();
  const attemptedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function attemptRegistration(attempt = 0) {
      if (!walletAddress || attemptedRef.current || cancelled) return;
      let idToken: string | undefined;
      try {
        const tokenResult: any = await web3Auth?.getIdentityToken?.();
        idToken = typeof tokenResult === 'string' ? tokenResult : tokenResult?.token;
        if (!idToken && (web3Auth as any)?.authenticateUser) {
          const authRes: any = await (web3Auth as any).authenticateUser();
          idToken = authRes?.idToken || authRes?.token || authRes;
        }
        if (!idToken && userInfo) {
          // Some SDK shapes expose idToken on userInfo directly
          const possible = (userInfo as any).idToken || (userInfo as any).token;
          if (typeof possible === 'string') idToken = possible;
        }
        if (userInfo && !(window as any).__WEB3AUTH_USERINFO_KEYS) {
          (window as any).__WEB3AUTH_USERINFO_KEYS = Object.keys(userInfo as any);
        }
        if (idToken) {
          (window as any).__WEB3AUTH_ID_TOKEN = idToken;
          document.cookie = `web3auth_token=${idToken}; path=/; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
        }
      } catch (e) {
        console.warn('[useAutoRegisterUser] getIdentityToken failed (attempt', attempt, '):', e);
      }

      if (!idToken) {
        if (attempt < 7) {
          const delay = 400 * Math.pow(2, attempt);
          console.log('[useAutoRegisterUser] no token yet, retrying in', delay, 'ms');
          setTimeout(() => attemptRegistration(attempt + 1), delay);
        } else {
          console.error('[useAutoRegisterUser] Exhausted token retries; giving up registration for now. window.__WEB3AUTH_DEBUG available');
          (window as any).__WEB3AUTH_DEBUG = {
            web3AuthStatus: (web3Auth as any)?.status,
            web3AuthKeys: web3Auth ? Object.keys(web3Auth) : null,
            isConnectedMaybe: (web3Auth as any)?.connected,
            walletAddress,
            userInfoKeys: userInfo ? Object.keys(userInfo as any) : null,
          };
        }
        return;
      }

      // 2. Perform registration with token
      try {
        const res = await fetch('/api/user/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            walletAddress,
            email: (userInfo as any)?.email,
            name: (userInfo as any)?.name,
            profileImage: (userInfo as any)?.profileImage,
          })
        });
        if (!res.ok) {
          const txt = await res.text();
          console.error('[useAutoRegisterUser] register failed status', res.status, txt);
          // If 401, maybe token not yet propagated; try again a limited number of times
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
        console.log('[useAutoRegisterUser] user registered');
      } catch (err) {
        console.error('[useAutoRegisterUser] network error', err);
        if (attempt < 5) setTimeout(() => attemptRegistration(attempt + 1), 600 * Math.pow(2, attempt));
      }
    }
    attemptRegistration();
    return () => { cancelled = true; };
  }, [walletAddress, web3Auth, userInfo, opts]);
}
