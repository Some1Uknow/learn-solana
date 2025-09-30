import { generateLearnSolOgImage } from "@/lib/og/learnsol";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return generateLearnSolOgImage({
    eyebrow: "modules",
    title: "Curated Solana learning tracks",
    subtitle:
      "Progressive weeks packed with MDX lessons, deep dives, and devnet-ready code walkthroughs.",
    bullets: [
      "Foundational through advanced roadmaps",
      "AI-assisted docs & contextual snippets",
      "Hands-on Anchor + client labs",
      "Progress tracking that syncs via Web3Auth",
    ],
    footer: "week system",
  });
}
