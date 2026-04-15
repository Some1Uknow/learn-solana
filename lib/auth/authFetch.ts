import { getAccessToken } from "@privy-io/react-auth";

// Unified authenticated fetch with Privy token resolution.
export interface AuthFetchOptions extends RequestInit {
  retryOn401?: boolean;
  attachBearerToken?: boolean;
  walletAddress?: string | null;
}

export async function authFetch(input: string, init: AuthFetchOptions = {}) {
  const {
    retryOn401 = true,
    attachBearerToken = true,
    walletAddress,
    headers,
    ...rest
  } = init;
  let token = attachBearerToken ? await getAccessToken() : null;
  const mergedHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...((headers as Record<string, string>) || {}),
  };
  if (walletAddress) {
    mergedHeaders["X-Wallet-Address"] = walletAddress;
  }
  if (
    token &&
    !("authorization" in
      Object.keys(mergedHeaders).reduce((acc, key) => {
        acc[key.toLowerCase()] = key;
        return acc;
      }, {} as Record<string, string>))
  ) {
    mergedHeaders.Authorization = `Bearer ${token}`;
  }

  let res = await fetch(input, {
    credentials: "include",
    ...rest,
    headers: mergedHeaders,
  });

  if (res.status === 401 && retryOn401) {
    token = attachBearerToken ? await getAccessToken() : null;
    if (token) {
      mergedHeaders.Authorization = `Bearer ${token}`;
      res = await fetch(input, {
        credentials: "include",
        ...rest,
        headers: mergedHeaders,
      });
    }
  }
  return res;
}
