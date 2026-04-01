import type { Metadata } from "next";
import { createCanonical } from "@/lib/seo";
import RuntimeLabClient from "./runtime-lab.client";

const title = "Runtime Lab | LearnSol";
const description =
  "Interactive Solana runtime lab for beginners. Predict what the runtime checks, inspect account diffs, and debug signer, owner, and PDA failures.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: createCanonical("/tools/runtime-lab"),
  },
  openGraph: {
    title,
    description,
    url: createCanonical("/tools/runtime-lab"),
    images: [
      {
        url: "/og/tools",
        width: 1200,
        height: 630,
        alt: "LearnSol Runtime Lab",
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

export default function RuntimeLabPage() {
  return <RuntimeLabClient />;
}
