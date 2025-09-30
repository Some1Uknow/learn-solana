import { generateLearnSolOgImage } from "@/lib/og/learnsol";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export async function GET() {
  return generateLearnSolOgImage({
    eyebrow: "modules",
    title: "Solana learning modules",
    subtitle: "Guided tracks spanning fundamentals, Rust, Anchor, and full-stack devnet builds.",
    bullets: [
      "Interactive curriculum",
      "Devnet-ready examples",
      "Progressive pathways",
      "Mentor-approved best practices",
    ],
    footer: "learn.sol",
  });
}
