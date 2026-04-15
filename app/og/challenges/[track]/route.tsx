import { generateLearnSolOgImage } from "@/lib/og/learnsol";
import { getTrackMeta, listExercisesByTrack } from "@/lib/challenges/exercises";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

type Params = { track: string };

export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { track } = await params;
  const exercises = listExercisesByTrack(track);
  if (exercises.length === 0) {
    return new Response("Track not found", { status: 404 });
  }

  const meta = getTrackMeta(track);

  return generateLearnSolOgImage({
    eyebrow: `${track} challenges`,
    title: `${meta.name}\nexercise track`,
    subtitle: meta.description,
    bullets: ["MDX-defined curriculum", "Progress saved by exercise slug"],
    footer: "learn.sol",
  });
}
