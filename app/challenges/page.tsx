import type { Metadata } from "next";
import ChallengesPageClient from "./challenges-page.client";
import {
  createCanonical,
  defaultOpenGraphImage,
  defaultTwitterImage,
} from "@/lib/seo";

const title = "Solana Coding Challenges | 30-Day Rust & Solana Practice";
const description =
  "Sharpen your Solana skills with daily coding challenges. 30-day tracks covering Rust, Anchor, and Solana smart contracts. Perfect for learning Solana programming.";

const challengeKeywords = [
  "solana coding challenges",
  "solana practice",
  "rust solana exercises",
  "anchor challenges",
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
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [defaultTwitterImage],
  },
};

export default function ChallengesPage() {
  return <ChallengesPageClient />;
}
