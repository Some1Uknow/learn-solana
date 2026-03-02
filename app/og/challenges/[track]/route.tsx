import { generateLearnSolOgImage } from "@/lib/og/learnsol";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

type Params = { track: string };

const trackMeta: Record<string, { title: string; subtitle: string }> = {
  rust: {
    title: "30 Days of Rust\nchallenge track",
    subtitle:
      "Daily exercises to build Rust muscle memory for real Solana development.",
  },
  anchor: {
    title: "Anchor Deep Dive\nchallenge track",
    subtitle:
      "Hands-on PDAs, CPIs, and account validation drills for production-safe programs.",
  },
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { track } = await params;
  const meta = trackMeta[track];

  if (!meta) {
    return new Response("Track not found", { status: 404 });
  }

  return generateLearnSolOgImage({
    eyebrow: `${track} challenges`,
    title: meta.title,
    subtitle: meta.subtitle,
    bullets: ["Structured daily progression", "Skill checks for each milestone"],
    footer: "learn.sol",
  });
}
