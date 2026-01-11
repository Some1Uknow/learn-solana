import type { Metadata } from "next";
import ToolsPageClient from "./tools-page.client";
import { createCanonical } from "@/lib/seo";

const title = "Solana Developer Tools & Infrastructure";
const description =
  "Essential tools and infrastructure for Solana developers. Discover RPCs, wallets, explorers, dev tools, and more to build on Solana.";

const toolsKeywords = [
  "solana developer tools",
  "solana rpc providers",
  "solana wallets",
  "solana infrastructure",
  "solana dev tools",
  "blockchain developer tools",
  "web3 development tools",
];

export const metadata: Metadata = {
  title,
  description,
  keywords: toolsKeywords,
  alternates: {
    canonical: createCanonical("/tools"),
  },
  openGraph: {
    title,
    description,
    url: createCanonical("/tools"),
    images: [
      {
        url: "/og/tools",
        width: 1200,
        height: 630,
        alt: "learn.sol tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og/tools"],
  },
};

export default function ToolsPage() {
  return <ToolsPageClient />;
}
