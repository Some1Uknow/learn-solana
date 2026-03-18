"use client";

export function clearClientAuthState() {
  if (typeof window === "undefined") return;

  try {
    delete (window as any).__WEB3AUTH_ID_TOKEN;
  } catch {}

  try {
    document.cookie = "web3auth_token=; Path=/; Max-Age=0; SameSite=Lax";
  } catch {}
}
