import { generateLearnSolOgImage } from "@/lib/og/learnsol";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return generateLearnSolOgImage({
    eyebrow: "challenges",
    title: "Weekly Solana shipping sprints",
    subtitle:
      "Partner quests with ecosystem teams, live feedback loops, and high-signal rewards.",
    bullets: [
      "Grant-backed build briefs",
      "Governance, DeFi & NFT tracks",
      "Mentored code reviews + LLM assist",
      "Badge & funding unlocks when you ship",
    ],
    footer: "quest mode",
  });
}
