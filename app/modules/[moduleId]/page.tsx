import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ModuleDetailPageClient from "./module-detail-page.client";
import { contentsData } from "@/data/contents-data";
import { createCanonical } from "@/lib/seo";

const modules = contentsData.modules;

type Props = {
  params: Promise<{ moduleId: string }>;
};

export async function generateStaticParams() {
  return modules.map((module) => ({
    moduleId: module.id,
  }));
}

// Module-specific keywords for SEO
const moduleKeywordsMap: Record<string, string[]> = {
  "solana-fundamentals": [
    "solana basics",
    "solana architecture",
    "blockchain fundamentals",
    "solana accounts",
    "solana transactions",
    "learn solana basics",
  ],
  "rust-essentials": [
    "rust programming",
    "rust for solana",
    "learn rust",
    "rust ownership",
    "rust borrowing",
    "rust basics",
  ],
  "anchor-development": [
    "anchor framework",
    "anchor solana",
    "solana smart contracts",
    "anchor pda",
    "anchor cpi",
    "solana program development",
  ],
  "frontend-integration": [
    "solana frontend",
    "wallet integration",
    "solana react",
    "web3 frontend",
    "solana dapp",
    "solana wallet adapter",
  ],
  "capstone-project": [
    "solana project",
    "build solana dapp",
    "solana portfolio",
    "fullstack solana",
    "solana deployment",
    "production solana",
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { moduleId } = await params;
  const module = modules.find((m) => m.id === moduleId);

  if (!module) {
    return {
      title: "Module Not Found",
    };
  }

  const title = `${module.title} | Learn Solana Course`;
  const description = module.description;
  
  // Get module-specific keywords or use defaults
  const keywords = moduleKeywordsMap[moduleId] || [
    "solana course",
    "solana tutorial",
    "learn solana",
    "solana development",
  ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: createCanonical(`/modules/${moduleId}`),
    },
    openGraph: {
      title,
      description,
      url: createCanonical(`/modules/${moduleId}`),
      images: [
        {
          url: "/og/modules",
          width: 1200,
          height: 630,
          alt: module.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og/modules"],
    },
  };
}

export default async function ModuleDetailPage({ params }: Props) {
  const { moduleId } = await params;
  const module = modules.find((m) => m.id === moduleId);

  if (!module) {
    notFound();
  }

  return <ModuleDetailPageClient module={module} />;
}
