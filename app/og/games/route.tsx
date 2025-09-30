import { generateLearnSolOgImage } from "@/lib/og/learnsol";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export async function GET() {
  return generateLearnSolOgImage({
    eyebrow: "games",
    title: "Play-to-learn Solana games",
    subtitle: "Level up your instincts with Phaser quests, NFTs, and on-chain tooling drops.",
    bullets: [
      "Hands-on mechanics",
      "Devnet loot",
      "Metaplex NFT rewards",
      "Speedrun challenges",
    ],
    footer: "learn.sol",
  });
}
