import { generateLearnSolOgImage } from "@/lib/og/learnsol";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

export async function GET() {
  return generateLearnSolOgImage({
    eyebrow: "projects",
    title: "Ship your Solana playbook",
    subtitle: "Blueprints, scaffolds, and battle-tested patterns to graduate from tutorials to live apps.",
    bullets: [
      "Mentor-curated briefs",
      "Devnet deployment flows",
      "Code review support",
      "Public launch prep",
    ],
    footer: "learn.sol",
  });
}
