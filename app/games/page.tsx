import type { Metadata } from "next";
import GamesPageClient from "./games-page.client";
import {
  createCanonical,
  defaultOpenGraphImage,
  defaultTwitterImage,
} from "@/lib/seo";

const title = "Solana Learning Games";
const description =
  "Play interactive Solana games that reward learning with NFTs and tracked progression.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: createCanonical("/games"),
  },
  openGraph: {
    title,
    description,
    url: createCanonical("/games"),
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [defaultTwitterImage],
  },
};

export default function GamesPage() {
  return <GamesPageClient />;
}
 
