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
    ],
  },
};

export default withMDX(nextConfig);
