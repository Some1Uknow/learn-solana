import type { Metadata } from "next";
import { createCanonical } from "@/lib/seo";
import VisualBuilderClient from "./visual-builder.client";

const title = "Visual Solana Builder | LearnSol";
const description =
  "Drag-and-drop Solana building blocks to learn how Anchor programs, accounts, and instructions fit together.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: createCanonical("/tools/visual-builder"),
  },
  openGraph: {
    title,
    description,
    url: createCanonical("/tools/visual-builder"),
    images: [
      {
        url: "/og/tools",
        width: 1200,
        height: 630,
        alt: "LearnSol Visual Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og/tools"],
  },
};

export default function VisualBuilderPage() {
  return <VisualBuilderClient />;
}
