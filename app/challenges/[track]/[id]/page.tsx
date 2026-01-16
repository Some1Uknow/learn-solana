import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ChallengePageWorkspace from "@/components/challenges/ChallengePageWorkspace";
import { getChallenge, getTrackCount, toMdxSlug, type TrackId } from "@/lib/challenges/registry";
import { createCanonical, defaultOpenGraphImage, defaultTwitterImage } from "@/lib/seo";

type Params = Promise<{ track: string; id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { track: trackParam, id: idParam } = await params;
  const track = trackParam as TrackId;
  const id = Number(idParam);
  const c = getChallenge(track, id);
  if (!c) return { title: "Challenge" };

  const title = `${c.title} · ${c.track.toUpperCase()} Challenge`;
  const canonical = createCanonical(`/challenges/${track}/${id}`);

  // Generate keywords from challenge tags and track
  const trackKeywords = track === "rust" 
    ? ["rust programming", "rust exercises", "learn rust"]
    : ["anchor framework", "solana smart contracts", "anchor tutorial"];
  
  const tagKeywords = c.tags.map((tag: string) => tag.toLowerCase());
  const keywords = [
    ...tagKeywords,
    ...trackKeywords,
    "coding challenge",
    "solana development",
    c.difficulty.toLowerCase(),
  ];

  return {
    title,
    description: c.description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description: c.description,
      url: canonical,
      siteName: "learn.sol",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: c.description,
      images: [defaultTwitterImage],
    },
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
