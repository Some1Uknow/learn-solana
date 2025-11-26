import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChallengePageWorkspace from "@/components/challenges/ChallengePageWorkspace";
import { getChallenge, getTrackCount, toMdxSlug, type TrackId } from "@/lib/challenges/registry";

type Params = Promise<{ track: string; id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { track: trackParam, id: idParam } = await params;
  const track = trackParam as TrackId;
  const id = Number(idParam);
  const c = getChallenge(track, id);
  if (!c) return { title: "Challenge" };
  return {
    title: `${c.title} · ${c.track.toUpperCase()} Challenge`,
    description: c.description,
  };
}

export default async function ChallengeRoute({ params }: { params: Params }) {
  const { track: trackParam, id: idParam } = await params;
  const track = trackParam as TrackId;
  const id = Number(idParam);
  const c = getChallenge(track, id);
  if (!c) return notFound();

  return (
    <ChallengePageWorkspace
      title={c.title}
      difficulty={c.difficulty}
      tags={c.tags}
      description={c.description}
      starterCode={c.starterCode}
      backHref={`/challenges/${track}`}
      mdxSlug={toMdxSlug(track, id)}
      currentIndex={id}
      totalCount={getTrackCount(track)}
      track={track}
      executor={c.executor}
    />
  );
}
