import { generateLearnSolOgImage } from "@/lib/og/learnsol";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export async function GET() {
  return generateLearnSolOgImage({
    eyebrow: "tools",
    title: "Battle-tested\nSolana tooling",
    subtitle:
      "Curated RPCs, explorers, wallets, and infra picks so you can ship prod-ready Solana apps faster.",
    bullets: [
      "Verified RPC + indexer providers",
      "CLI, wallet, and devtool breakdowns",
    ],
    footer: "learn.sol",
  });
}
