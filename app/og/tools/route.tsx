import { generateLearnSolOgImage } from "@/lib/og/learnsol";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export async function GET() {
  return generateLearnSolOgImage({
    eyebrow: "tools",
    title: "Interactive\nSolana tools",
    subtitle:
      "Runtime Lab and Visual Builder for developers learning Solana by interacting with the system directly.",
    bullets: [
      "Runtime flow breakdowns",
      "Visual program composition",
    ],
    footer: "learn.sol",
  });
}
