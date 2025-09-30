import { generateLearnSolOgImage } from "@/lib/og/learnsol";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export async function GET() {
  return generateLearnSolOgImage({
    eyebrow: "challenges",
    title: "Solana builder challenges",
    subtitle: "Weekly sprints from ecosystem teams with grants, mentorship, and on-chain badges.",
    bullets: [
      "Ecosystem sponsors",
      "Devnet deliverables",
      "Mentor office hours",
      "Exclusive NFTs",
    ],
    footer: "learn.sol",
  });
}
