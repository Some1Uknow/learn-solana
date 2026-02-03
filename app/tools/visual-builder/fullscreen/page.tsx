import type { Metadata } from "next";
import VisualBuilderClient from "../visual-builder.client";
import { createCanonical } from "@/lib/seo";

const title = "Visual Solana Builder (Fullscreen) | LearnSol";
const description =
  "Fullscreen visual builder for learning Solana with drag-and-drop blocks and Anchor export.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: createCanonical("/tools/visual-builder/fullscreen"),
  },
  openGraph: {
    title,
    description,
    url: createCanonical("/tools/visual-builder/fullscreen"),
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

export default function VisualBuilderFullscreenPage() {
  return <VisualBuilderClient fullscreen />;
}
