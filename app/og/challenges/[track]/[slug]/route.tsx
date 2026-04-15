import { generateLearnSolOgImage } from "@/lib/og/learnsol";
import { getExercise } from "@/lib/challenges/exercises";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

type Params = { track: string; slug: string };

const truncate = (value: string, limit: number): string => {
  if (value.length <= limit) return value;
  return `${value.slice(0, limit - 1).trimEnd()}...`;
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { track, slug } = await params;
  const challenge = getExercise(track, slug);

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
