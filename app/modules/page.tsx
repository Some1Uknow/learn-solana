import type { Metadata } from "next";
import ModulesPageClient from "./modules-page.client";
import {
  createCanonical,
  defaultOpenGraphImage,
  defaultTwitterImage,
} from "@/lib/seo";

const title = "Solana Modules Library";
const description =
  "Browse structured Solana learning modules spanning fundamentals, tooling, and on-chain program design.";

export const metadata: Metadata = {
  title,
  description,
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
