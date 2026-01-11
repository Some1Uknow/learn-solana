import type { Metadata } from "next";
import PartnerPageClient from "./partner-page.client";
import {
  createCanonical,
  defaultOpenGraphImage,
  defaultTwitterImage,
} from "@/lib/seo";

const title = "Partner with LearnSol - Featured Partner Opportunities";
const description =
  "Become a Featured Partner on LearnSol. Showcase your Solana developer tools to thousands of developers with premium placement, AI assistant recommendations, and tutorial mentions.";

const partnerKeywords = [
  "solana partnership",
  "blockchain sponsorship",
  "web3 developer marketing",
  "solana tool promotion",
  "blockchain education sponsor",
];

export const metadata: Metadata = {
  title,
  description,
  keywords: partnerKeywords,
  alternates: {
    canonical: createCanonical("/partner"),
  },
  openGraph: {
    title,
    description,
    url: createCanonical("/partner"),
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [defaultTwitterImage],
  },
};

export default function PartnerPage() {
  return <PartnerPageClient />;
}
