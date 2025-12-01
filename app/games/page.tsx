import type { Metadata } from "next";
import GamesPageClient from "./games-page.client";
import {
  createCanonical,
  defaultOpenGraphImage,
  defaultTwitterImage,
} from "@/lib/seo";

const title = "Learn Solana Through Games | Interactive Blockchain Tutorials";
const description =
  "Master Solana concepts through fun, interactive games. Learn blockchain, transactions, accounts, and smart contracts while playing. Earn NFTs as you progress.";

const gamesKeywords = [
  "solana games",
  "learn solana games",
  "blockchain learning games",
  "interactive solana tutorial",
  "solana education games",
  "web3 learning games",
  "gamified blockchain learning",
];

export const metadata: Metadata = {
  title,
  description,
  keywords: gamesKeywords,
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
 
