const FALLBACK_SITE_URL = "https://learnsol.site";

const sanitized = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");

export const siteUrl = sanitized && sanitized.startsWith("http") ? sanitized : FALLBACK_SITE_URL;

export const metadataBase = new URL(siteUrl);

export const defaultOpenGraphImage = {
  url: "/opengraph-image.png",
  width: 1200,
  height: 630,
  alt: "learn.sol",
};

export const defaultTwitterImage = "/twitter-image.png";

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
  "solana games to learn",
  "solana developer bootcamp",
  "solana projects",
];

// Combined for metadata
export const courseKeywords = [
  ...primaryKeywords,
  ...secondaryKeywords,
  ...longTailKeywords,
];

export const createCanonical = (path: string) => {
  if (!path || path === "/") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
};
