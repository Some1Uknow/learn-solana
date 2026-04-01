import type { Metadata } from "next";
import ToolsPageClient from "./tools-page.client";
import { createCanonical } from "@/lib/seo";

const title = "Interactive Solana Learning Tools | LearnSol";
const description =
  "Learn Solana through interactive labs and visual builders. Start with Runtime Lab to understand runtime checks, account diffs, and common failures.";

const toolsKeywords = [
  "solana learning tools",
  "solana runtime lab",
  "solana runtime visualizer",
  "solana visual builder",
  "anchor beginner lab",
  "solana account diffs",
  "blockchain learning tools",
  "web3 education tools",
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
