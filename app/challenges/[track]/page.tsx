import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { challenges, type TrackId } from "@/lib/challenges/registry";
import TrackChallengesClient from "./track-challenges.client";
import { createCanonical, defaultOpenGraphImage, defaultTwitterImage } from "@/lib/seo";

type Params = Promise<{ track: string }>;

const trackMeta: Record<
  TrackId,
  {
    name: string;
    description: string;
  }
> = {
  rust: {
    name: "30 Days of Rust",
    description:
      "Progressive daily Rust coding series—foundations → ownership depth → algorithms & concurrency → Solana program primitives.",
  },
  anchor: {
    name: "Anchor Deep Dive",
    description:
      "Master the Anchor framework for building secure and efficient Solana programs.",
  },
};

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { track: trackParam } = await params;
  const track = trackParam as TrackId;
  const meta = trackMeta[track];
  if (!meta) return { title: "Challenges" };

  const canonical = createCanonical(`/challenges/${track}`);

  return {
    title: `${meta.name} - All Challenges`,
    description: meta.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${meta.name} - Solana Coding Challenges`,
      description: meta.description,
      url: canonical,
      siteName: "learn.sol",
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${meta.name} - Solana Coding Challenges`,
      description: meta.description,
      images: [defaultTwitterImage],
    },
  };
}

export default async function TrackChallengesPage({ params }: { params: Params }) {
  const { track: trackParam } = await params;
  const track = trackParam as TrackId;
  const meta = trackMeta[track];

  if (!meta) return notFound();

  const trackChallenges = challenges.filter((c) => c.track === track);

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
