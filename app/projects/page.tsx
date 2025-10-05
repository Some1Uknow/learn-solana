import type { Metadata } from "next";
import ProjectsPageClient from "./projects-page.client";
import {
  createCanonical,
  defaultOpenGraphImage,
  defaultTwitterImage,
} from "@/lib/seo";

const title = "Build Projects on Solana";
const description =
  "Explore hands-on Solana projects with guidance, courses, and progression tracking.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: createCanonical("/projects"),
  },
  openGraph: {
    title,
    description,
    url: createCanonical("/projects"),
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [defaultTwitterImage],
  },
};

export default function ProjectsPage() {
  return <ProjectsPageClient />;
}
