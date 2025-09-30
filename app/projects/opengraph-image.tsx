import { generateLearnSolOgImage } from "@/lib/og/learnsol";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return generateLearnSolOgImage({
    eyebrow: "projects",
    title: "Ship Solana-ready product playbooks",
    subtitle:
      "Blueprints, dashboards, and mentor-reviewed milestones to take you from idea to launch.",
    bullets: [
      "Devnet deployment checklists",
      "Component templates for React + Anchor",
      "Realtime progress analytics",
      "Mentor office hours on demand",
    ],
    footer: "builder mode",
  });
}
