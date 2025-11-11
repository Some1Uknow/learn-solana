import { createMDX } from "fumadocs-mdx/next";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const withMDX = createMDX();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/docs/:path*.mdx",
        destination: "/llms.mdx/:path*",
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
