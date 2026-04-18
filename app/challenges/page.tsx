import type { Metadata } from "next";
import ChallengesPageClient from "./challenges-page.client";
import { brand } from "@/lib/brand";
import { createCanonical } from "@/lib/seo";
import { getTrackMeta, listExerciseTracks, listExercisesByTrack } from "@/lib/challenges/exercises";

const title = "Solana Coding Challenges | 30-Day Rust & Solana Practice";
const description =
  "Sharpen your Solana skills with hands-on Rust exercises. Work through an MDX-driven challenge track and save progress with Privy.";

const challengeKeywords = [
  "solana coding challenges",
  "solana practice",
  "rust solana exercises",
  "solana programming practice",
  "learn rust solana",
  "solana developer exercises",
  "blockchain coding challenges",
];

export const metadata: Metadata = {
  title,
  description,
  keywords: challengeKeywords,
  alternates: {
    canonical: createCanonical("/challenges"),
  },
  openGraph: {
    title,
    description,
    url: createCanonical("/challenges"),
    images: [
      {
        url: "/og/challenges",
        width: 1200,
        height: 630,
        alt: `${brand.name} challenges`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og/challenges"],
  },
};

export default function ChallengesPage() {
  const tracks = listExerciseTracks().map((track) => {
    const meta = getTrackMeta(track);
    const exercises = listExercisesByTrack(track);

    return {
      track,
      name: meta.name,
      description: meta.description,
      exerciseCount: exercises.length,
    };
  });

  return <ChallengesPageClient tracks={tracks} />;
}
