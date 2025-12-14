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

  return {
    title,
    description,
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
