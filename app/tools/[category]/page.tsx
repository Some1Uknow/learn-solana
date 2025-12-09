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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category: categoryId } = await params;
  const category = getToolCategory(categoryId);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  const title = `${category.name} - Solana Tools`;
  const description = category.description;

  return {
    title,
    description,
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
