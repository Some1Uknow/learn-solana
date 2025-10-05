import type { Metadata } from "next";
import HomePageClient from "./home-page.client";
import {
  courseKeywords,
  createCanonical,
  defaultOpenGraphImage,
  defaultTwitterImage,
} from "@/lib/seo";

const title = "Learn Solana";
const description =
  "Master Solana development with curated courses, interactive games, and coding challenges at learn.sol.";

export const metadata: Metadata = {
  title,
  description,
  keywords: courseKeywords,
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
