import { brand, brandKeywords } from "@/lib/brand";

const CANONICAL_HOST = "www.learnsol.site";
const CANONICAL_SITE_URL = `https://${CANONICAL_HOST}`;
const DEVELOPMENT_SITE_URL = "http://localhost:3000";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);
const LEGACY_HOSTS = new Set(["learnsol.site"]);

function normalizeConfiguredSiteUrl(rawValue: string | undefined): string {
  const sanitized = rawValue?.trim().replace(/\/$/, "");

  if (!sanitized) {
    return process.env.NODE_ENV === "production" ? CANONICAL_SITE_URL : DEVELOPMENT_SITE_URL;
  }

  const withProtocol = sanitized.startsWith("http") ? sanitized : `https://${sanitized}`;

  try {
    const url = new URL(withProtocol);
    const hostname = url.hostname.toLowerCase();

    if (process.env.NODE_ENV !== "production" && LOCAL_HOSTS.has(hostname)) {
      return url.origin;
    }

    if (LOCAL_HOSTS.has(hostname) || LEGACY_HOSTS.has(hostname) || hostname === CANONICAL_HOST) {
      return CANONICAL_SITE_URL;
    }

    if (process.env.NODE_ENV === "production") {
      return CANONICAL_SITE_URL;
    }

    return url.origin;
  } catch {
    return process.env.NODE_ENV === "production" ? CANONICAL_SITE_URL : DEVELOPMENT_SITE_URL;
  }
}

export const canonicalHost = CANONICAL_HOST;
export const canonicalSiteUrl = CANONICAL_SITE_URL;
export const legacySiteHosts = [...LEGACY_HOSTS];

export function isLocalDevelopmentHost(hostname: string): boolean {
  return LOCAL_HOSTS.has(hostname.toLowerCase());
}

export const siteUrl = normalizeConfiguredSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);

export const metadataBase = new URL(siteUrl);

export const defaultOpenGraphImage = {
  url: brand.assets.openGraph,
  width: 1200,
  height: 630,
  alt: `${brand.name} - ${brand.tagline}`,
};

export const defaultTwitterImage = brand.assets.twitter;

// Primary keywords (highest search volume)
export const primaryKeywords = [
  "learn solana",
  "solana course",
  "solana tutorial",
  "solana development course",
  "learn solana development",
  "learn rust solana"
];

// Secondary keywords (medium volume, high intent)
export const secondaryKeywords = [
  "solana developer tutorial",
  "solana blockchain course",
  "solana smart contracts",
  "anchor framework tutorial",
  "rust solana",
  "solana web3 course",
  "free solana course",
];

// Long-tail keywords (lower volume, high conversion)
export const longTailKeywords = [
  "how to learn solana",
  "solana development for beginners",
  "best solana course",
  "solana coding challenges",
  "solana onboarding platform",
  "solana developer bootcamp",
  "solana projects",
];

// Combined for metadata
export const courseKeywords = [
  ...brandKeywords,
  ...primaryKeywords,
  ...secondaryKeywords,
  ...longTailKeywords,
];

export const createCanonical = (path: string) => {
  if (!path || path === "/") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
};
