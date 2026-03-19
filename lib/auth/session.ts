"use client";

export function persistClientAuthToken(token: string | null | undefined) {
  if (typeof window === "undefined" || !token) return;

  try {
    (window as any).__WEB3AUTH_ID_TOKEN = token;
  } catch {}

  try {
    const parts = [
      `web3auth_token=${token}`,
      "Path=/",
      "SameSite=Lax",
      "Max-Age=604800",
    ];
    if (window.location?.protocol === "https:") {
      parts.push("Secure");
    }
    document.cookie = parts.join("; ");
  } catch {}
}

export function clearClientAuthState() {
  if (typeof window === "undefined") return;

  try {
    delete (window as any).__WEB3AUTH_ID_TOKEN;
  } catch {}

  try {
    document.cookie = "web3auth_token=; Path=/; Max-Age=0; SameSite=Lax";
  } catch {}
}
