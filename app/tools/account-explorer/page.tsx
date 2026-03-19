import type { Metadata } from "next";
import { createCanonical } from "@/lib/seo";
import AccountExplorerClient from "./account-explorer.client";

const title = "Account Explorer | LearnSol";
const description =
  "Beginner-friendly account inspector for Solana accounts, owners, lamports, and data fields.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: createCanonical("/tools/account-explorer"),
  },
  openGraph: {
    title,
    description,
    url: createCanonical("/tools/account-explorer"),
    images: [
      {
        url: "/og/tools",
        width: 1200,
        height: 630,
        alt: "LearnSol Account Explorer",
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

export default function AccountExplorerPage() {
  return <AccountExplorerClient />;
}
