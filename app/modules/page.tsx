import type { Metadata } from "next";
import ModulesPageClient from "./modules-page.client";
import {
  createCanonical,
  defaultOpenGraphImage,
  defaultTwitterImage,
} from "@/lib/seo";

const title = "Free Solana Course | Learn Solana Development Step-by-Step";
const description =
  "Start your Solana developer journey with our structured course. Learn Solana fundamentals, Rust programming, Anchor framework, and build real dApps from scratch.";

const moduleKeywords = [
  "solana course",
  "solana courses",
  "free solana course",
  "solana development course",
  "learn solana online",
  "solana tutorial",
  "solana developer course",
  "solana programming course",
  "anchor framework course",
  "rust solana course",
];

export const metadata: Metadata = {
  title,
  description,
  keywords: moduleKeywords,
  alternates: {
    canonical: createCanonical("/modules"),
  },
  openGraph: {
    title,
    description,
    url: createCanonical("/modules"),
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [defaultTwitterImage],
  },
};

export default function ModulesPage() {
  return <ModulesPageClient />;
}
