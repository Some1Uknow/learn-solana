import { createMDX } from "fumadocs-mdx/next";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const withMDX = createMDX();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  // SEO: Enforce consistent URL structure (no trailing slashes)
  // This prevents duplicate content and canonical/redirect mismatches
  trailingSlash: false,
  async rewrites() {
    return [
      {
        source: "/learn.mdx",
        destination: "/llms.mdx",
      },
      {
        source: "/learn/:path*.mdx",
        destination: "/llms.mdx/:path*",
      },
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/:path*",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/learn/week-1",
        destination: "/learn/solana-foundations",
        permanent: true,
      },
      {
        source: "/learn/week-1/:path*",
        destination: "/learn/solana-foundations/:path*",
        permanent: true,
      },
      {
        source: "/learn/week-2",
        destination: "/learn/rust-foundations",
        permanent: true,
      },
      {
        source: "/learn/week-2/:path*",
        destination: "/learn/rust-foundations/:path*",
        permanent: true,
      },
      {
        source: "/learn/week-2/day-1-rust-fundamentals",
        destination: "/learn/rust-foundations/rust-setup-and-core-syntax",
        permanent: true,
      },
      {
        source: "/learn/week-2/day-1-challenges",
        destination: "/learn/rust-foundations/rust-syntax-practice",
        permanent: true,
      },
      {
        source: "/learn/week-2/day-2-ownership-system",
        destination: "/learn/rust-foundations/ownership-and-borrowing",
        permanent: true,
      },
      {
        source: "/learn/week-2/day-2-challenges",
        destination: "/learn/rust-foundations/ownership-and-borrowing-practice",
        permanent: true,
      },
      {
        source: "/learn/week-2/day-3-data-structures",
        destination: "/learn/rust-foundations/structs-and-methods",
        permanent: true,
      },
      {
        source: "/learn/week-2/day-3-challenges",
        destination: "/learn/rust-foundations/structs-and-methods-practice",
        permanent: true,
      },
      {
        source: "/learn/week-2/mid-course-projects",
        destination: "/learn/rust-foundations/wallet-ledger-build",
        permanent: true,
      },
      {
        source: "/learn/week-2/day-4-enums-pattern-matching",
        destination: "/learn/rust-foundations/enums-and-pattern-matching",
        permanent: true,
      },
      {
        source: "/learn/week-2/day-4-challenges",
        destination: "/learn/rust-foundations/enums-and-pattern-matching-practice",
        permanent: true,
      },
      {
        source: "/learn/week-2/day-5-collections-strings",
        destination: "/learn/rust-foundations/collections-and-string-handling",
        permanent: true,
      },
      {
        source: "/learn/week-2/day-5-challenges",
        destination: "/learn/rust-foundations/collections-and-string-handling-practice",
        permanent: true,
      },
      {
        source: "/learn/week-3",
        destination: "/learn/anchor-programs",
        permanent: true,
      },
      {
        source: "/learn/week-3/:path*",
        destination: "/learn/anchor-programs/:path*",
        permanent: true,
      },
      {
        source: "/learn/week-4",
        destination: "/learn/solana-kit-clients",
        permanent: true,
      },
      {
        source: "/learn/week-4/:path*",
        destination: "/learn/solana-kit-clients/:path*",
        permanent: true,
      },
      {
        source: "/modules/week-1",
        destination: "/modules/solana-foundations",
        permanent: true,
      },
      {
        source: "/modules/week-2",
        destination: "/modules/rust-foundations",
        permanent: true,
      },
      {
        source: "/modules/week-3",
        destination: "/modules/anchor-programs",
        permanent: true,
      },
      {
        source: "/modules/week-4",
        destination: "/modules/solana-kit-clients",
        permanent: true,
      },
      // Redirect any trailing slash URLs to non-trailing slash versions
      // This ensures consistent URLs and prevents duplicate content
      {
        source: "/:path+/",
        destination: "/:path+",
        permanent: true,
      },
    ];
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    // Allow rendering local SVGs via next/image (we use public/solana-kit.svg for the Solana Kit Clients section).
    dangerouslyAllowSVG: true,
    domains: [
      "docs.solana.com",
      "rustacean.net",
      "foundation.rust-lang.org",
      "solana.com",
      "www.anchor-lang.com",
      "cdn.jsdelivr.net",
      "copper-gigantic-kite-657.mypinata.cloud",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "docs.solana.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "rustacean.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "foundation.rust-lang.org",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "solana.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "www.anchor-lang.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "copper-gigantic-kite-657.mypinata.cloud",
        pathname: "**",
      },
      { protocol: "https", hostname: "pbs.twimg.com" },
      { protocol: "https", hostname: "abs.twimg.com" },
    ],
  },
  webpack(config) {
    config.resolve ??= {};
    config.resolve.alias ??= {};
    config.resolve.alias["@react-native-async-storage/async-storage"] = resolve(
      __dirname,
      "stubs/asyncStorage.ts",
    );

    return config;
  },
};

export default withMDX(nextConfig);
