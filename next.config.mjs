import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

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
    ],
  },
};

export default withMDX(nextConfig);
