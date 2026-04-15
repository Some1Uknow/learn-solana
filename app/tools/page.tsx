import type { Metadata } from "next";
import ToolsPageClient from "./tools-page.client";
import { createCanonical } from "@/lib/seo";

const title = "Solana Developer Tools | Runtime Lab & Visual Builder";
const description =
  "Use Runtime Lab to understand Solana runtime checks and Visual Builder to map accounts, instructions, and PDAs before you code.";

const toolsKeywords = [
  "solana developer tools",
  "solana runtime lab",
  "solana visual builder",
  "solana instruction flow",
  "solana runtime checks",
  "solana pda builder",
  "solana instruction visualizer",
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
