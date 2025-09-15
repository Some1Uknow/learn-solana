// Unified authenticated fetch with Web3Auth token resolution + single retry on 401.
export interface AuthFetchOptions extends RequestInit {
  retryOn401?: boolean;
  waitForTokenMs?: number;
}

function getTokenSync(): string | null {
  return (typeof window !== 'undefined' && (window as any).__WEB3AUTH_ID_TOKEN) || null;
}

async function waitForToken(timeoutMs: number): Promise<string | null> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const t = getTokenSync();
    if (t) return t;
    await new Promise(r => setTimeout(r, 150));
  }
  return getTokenSync();
}

export async function authFetch(input: string, init: AuthFetchOptions = {}) {
  const { retryOn401 = true, waitForTokenMs = 4000, headers, ...rest } = init;
  let token = getTokenSync() || await waitForToken(waitForTokenMs);
  const mergedHeaders: Record<string,string> = {
    'Content-Type': 'application/json',
    ...(headers as any || {})
  };
  if (token && !('authorization' in Object.keys(mergedHeaders).reduce((a,k)=>{a[k.toLowerCase()]=k;return a;},{} as Record<string,string>))) {
    mergedHeaders['Authorization'] = `Bearer ${token}`;
  }
  let res = await fetch(input, { ...rest, headers: mergedHeaders });
  if (res.status === 401 && retryOn401) {
    // Force another wait & attempt (token may have just appeared)
    token = await waitForToken(2000);
    if (token) {
      mergedHeaders['Authorization'] = `Bearer ${token}`;
      res = await fetch(input, { ...rest, headers: mergedHeaders });
    }
  }
  return res;
}