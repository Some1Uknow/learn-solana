import { generateLearnSolOgImage } from "@/lib/og/learnsol";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return generateLearnSolOgImage({
    eyebrow: "games",
    title: "Interactive Solana game labs",
    subtitle:
      "Learn token mechanics, CPI flows, and wallets through fast-paced Phaser challenges.",
    bullets: [
      "Devnet leaderboards & speedruns",
      "Claimable NFTs for every victory",
      "Metaplex-powered reward flows",
      "Code-along breakdowns in every level",
    ],
    footer: "play to learn",
  });
}
