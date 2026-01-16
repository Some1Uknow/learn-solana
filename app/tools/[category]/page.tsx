import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolCategoryClient from "./tool-category.client";
import {
  createCanonical,
  defaultOpenGraphImage,
  defaultTwitterImage,
} from "@/lib/seo";
import { getToolCategory, getAllCategoryIds } from "@/data/tools-data";

interface PageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return getAllCategoryIds().map((id) => ({
    category: id,
  }));
}

// Category-specific keywords for SEO
const categoryKeywordsMap: Record<string, string[]> = {
  rpc: [
    "solana rpc",
    "solana rpc providers",
    "solana node",
    "solana api",
    "blockchain rpc",
    "solana infrastructure",
  ],
  indexing: [
    "solana indexing",
    "solana data",
    "blockchain indexer",
    "solana analytics",
    "solana explorer",
    "on-chain data",
  ],
  wallets: [
    "solana wallets",
    "phantom wallet",
    "solflare",
    "solana wallet adapter",
    "web3 wallet",
    "crypto wallet",
  ],
  "dev-tools": [
    "solana developer tools",
    "solana sdk",
    "anchor cli",
    "solana playground",
    "solana testing",
    "blockchain development",
  ],
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categoryId } = await params;
  const category = getToolCategory(categoryId);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const title = `${category.name} - Solana Developer Tools`;
  const description = category.description;
  
  // Get category-specific keywords or use defaults
  const keywords = categoryKeywordsMap[categoryId] || [
    "solana tools",
    "solana development",
    "blockchain tools",
    "web3 infrastructure",
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: createCanonical(`/tools/${categoryId}`),
    },
    openGraph: {
      title,
      description,
      url: createCanonical(`/tools/${categoryId}`),
      images: [defaultOpenGraphImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultTwitterImage],
    },
  };
}

export default async function ToolCategoryPage({ params }: PageProps) {
  const { category: categoryId } = await params;
  const category = getToolCategory(categoryId);

  if (!category) {
    notFound();
  }

  return <ToolCategoryClient category={category} />;
}
