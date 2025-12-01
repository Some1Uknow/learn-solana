import type { Metadata } from "next";
import HomePageClient from "./home-page.client";
import {
  courseKeywords,
  createCanonical,
  defaultOpenGraphImage,
  defaultTwitterImage,
} from "@/lib/seo";

const title = "Learn Solana | Free Solana Development Course & Tutorials";
const description =
  "Learn Solana development from scratch with our free course. Master Solana programming, smart contracts, Rust & Anchor through interactive tutorials, games, and coding challenges.";

const homeKeywords = [
  ...courseKeywords,
  "solana for beginners",
  "blockchain development course",
  "web3 development tutorial",
  "learn blockchain programming",
];

export const metadata: Metadata = {
  title,
  description,
  keywords: homeKeywords,
  alternates: {
    canonical: createCanonical("/"),
  },
  openGraph: {
    title,
    description,
    url: createCanonical("/"),
    type: "website",
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [defaultTwitterImage],
  },
};

export default function Home() {
  return <HomePageClient />;
}
