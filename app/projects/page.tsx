import type { Metadata } from "next";
import ProjectsPageClient from "./projects-page.client";
import {
  createCanonical,
  defaultOpenGraphImage,
  defaultTwitterImage,
} from "@/lib/seo";

const title = "Build Solana Projects | Hands-On Solana Development Tutorials";
const description =
  "Learn Solana by building real projects. Step-by-step tutorials for dApps, NFT marketplaces, DeFi protocols, and more. The best way to learn Solana development.";

const projectKeywords = [
  "solana projects",
  "build on solana",
  "solana dapp tutorial",
  "solana nft project",
  "solana defi tutorial",
  "solana project ideas",
  "hands-on solana",
  "solana portfolio projects",
];

export const metadata: Metadata = {
  title,
  description,
  keywords: projectKeywords,
  alternates: {
    canonical: createCanonical("/projects"),
  },
  openGraph: {
    title,
    description,
    url: createCanonical("/projects"),
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [defaultTwitterImage],
  },
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
