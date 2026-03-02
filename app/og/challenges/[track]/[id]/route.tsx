import { generateLearnSolOgImage } from "@/lib/og/learnsol";
import { getChallenge, type TrackId } from "@/lib/challenges/registry";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

type Params = { track: string; id: string };

const truncate = (value: string, limit: number): string => {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 1).trimEnd()}...`;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { track, id } = await params;
  const challenge = getChallenge(track as TrackId, Number(id));

  if (!challenge) {
    return new Response("Challenge not found", { status: 404 });
  }

  const tags = (challenge.tags ?? []).slice(0, 2);
  const tagsLabel = tags.length > 0 ? tags.join(" • ") : "Core challenge skills";

  return generateLearnSolOgImage({
    eyebrow: `${challenge.track} challenge`,
    title: truncate(challenge.title, 54),
    subtitle: truncate(challenge.description, 170),
    bullets: [`Difficulty: ${challenge.difficulty ?? "Not set"}`, `Focus: ${tagsLabel}`],
    footer: "learn.sol",
  });
}
