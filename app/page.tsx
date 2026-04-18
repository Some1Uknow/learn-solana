import type { Metadata } from "next";
import HomePageClient from "./home-page.client";
import {
  courseKeywords,
  createCanonical,
  defaultOpenGraphImage,
  defaultTwitterImage,
} from "@/lib/seo";
import { brand } from "@/lib/brand";

const title = `${brand.name} | ${brand.tagline}`;

const description = brand.longDescription;

const homeKeywords = [
  ...courseKeywords,
  "solana for beginners",
  "solana onboarding",
  "solana developer education",
  "anchor rust solana course",
  "solana coding challenges",
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
