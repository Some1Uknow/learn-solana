import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChallengePageWorkspace from "@/components/challenges/ChallengePageWorkspace";
import { getChallenge, getTrackCount, toMdxSlug } from "@/lib/challenges/registry";

type Params = { track: string; id: string };

export  function generateMetadata({ params }: { params: Params }): Metadata {
  const track =  params.track as any;
  const id =  Number(params.id);
  const c = getChallenge(track, id);
  if (!c) return { title: "Challenge" };
  return {
    title: `${c.title} · ${c.track.toUpperCase()} Challenge`,
    description: c.description,
  };
}

export default function ChallengeRoute({ params }: { params: Params }) {
  const track = params.track as any;
  const id = Number(params.id);
  const c = getChallenge(track, id);
  if (!c) return notFound();

  return (
    <ChallengePageWorkspace
      title={c.title}
      difficulty={c.difficulty}
      tags={c.tags}
      description={c.description}
      starterCode={c.starterCode}
      backHref="/challenges"
      mdxSlug={toMdxSlug(track, id)}
      currentIndex={id}
      totalCount={getTrackCount(track)}
      track={track}
      executor={c.executor}
    />
  );
}
