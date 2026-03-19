import type { Metadata } from "next";
import { createCanonical } from "@/lib/seo";
import TransactionVisualizerClient from "./transaction-visualizer.client";

const title = "Transaction Visualizer | LearnSol";
const description =
  "Arrange instructions, inspect signers and compute costs, and understand Solana transaction atomicity.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: createCanonical("/tools/transaction-visualizer"),
  },
  openGraph: {
    title,
    description,
    url: createCanonical("/tools/transaction-visualizer"),
    images: [
      {
        url: "/og/tools",
        width: 1200,
        height: 630,
        alt: "LearnSol Transaction Visualizer",
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

export default function TransactionVisualizerPage() {
  return <TransactionVisualizerClient />;
}
