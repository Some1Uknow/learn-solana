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
    keywords: string[];
  }
> = {
  rust: {
    name: "30 Days of Rust",
    description:
      "Master Rust programming with 30 daily coding challenges. Learn ownership, borrowing, lifetimes, and Solana program primitives through hands-on practice.",
    keywords: [
      "rust coding challenges",
      "learn rust",
      "rust programming exercises",
      "rust for solana",
      "rust ownership",
      "rust borrowing",
      "30 days of rust",
      "rust practice problems",
    ],
  },
  anchor: {
    name: "Anchor Deep Dive",
    description:
      "Master the Anchor framework for building secure Solana programs. Learn PDAs, CPIs, account validation, and smart contract patterns through practical challenges.",
    keywords: [
      "anchor framework tutorial",
      "anchor solana",
      "solana smart contracts",
      "anchor pda",
      "anchor cpi",
      "solana program development",
      "anchor challenges",
      "learn anchor",
    ],
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
    keywords: meta.keywords,
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
