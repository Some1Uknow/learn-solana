import type { Metadata } from "next";
import ChallengesPageClient from "./challenges-page.client";
import {
  createCanonical,
  defaultOpenGraphImage,
  defaultTwitterImage,
} from "@/lib/seo";

const title = "Solana Coding Challenges";
const description =
  "Tackle a 30-day Solana and Rust challenge track with progressive prompts and upcoming interactive tooling.";

export const metadata: Metadata = {
  title,
  description,
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
