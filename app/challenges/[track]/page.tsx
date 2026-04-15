import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTrackMeta, listExercisesByTrack } from "@/lib/challenges/exercises";
import TrackChallengesClient from "./track-challenges.client";
import { createCanonical } from "@/lib/seo";

type Params = Promise<{ track: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { track: trackParam } = await params;
  const track = trackParam;
  const exercises = listExercisesByTrack(track);
  if (exercises.length === 0) return { title: "Challenges" };
  const meta = getTrackMeta(track);

  const canonical = createCanonical(`/challenges/${track}`);
  const ogImageUrl = createCanonical(`/og/challenges/${track}`);

  return {
    title: `${meta.name} - All Challenges`,
    description: meta.description,
    keywords: meta.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${meta.name} - Solana Coding Challenges`,
      description: meta.description,
      url: canonical,
      siteName: "learn.sol",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${meta.name} challenge track`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.name} - Solana Coding Challenges`,
      description: meta.description,
      images: [ogImageUrl],
    },
  };
}

export default async function TrackChallengesPage({ params }: { params: Params }) {
  const { track: trackParam } = await params;
  const track = trackParam;
  const meta = getTrackMeta(track);
  const trackChallenges = listExercisesByTrack(track);

  if (trackChallenges.length === 0) return notFound();

  return (
    <TrackChallengesClient
      track={track}
      trackName={meta.name}
      trackDescription={meta.description}
      challenges={trackChallenges}
    />
  );
}
