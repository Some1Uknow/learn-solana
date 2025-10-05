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

export const courseKeywords = [
  "Solana",
  "Solana development",
  "Solana Course",
  "Web3 Course",
  "Rust smart contracts",
  "Anchor framework",
  "Web3 education",
  "Solana games",
];

export const createCanonical = (path: string) => {
  if (!path || path === "/") return siteUrl;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
};
