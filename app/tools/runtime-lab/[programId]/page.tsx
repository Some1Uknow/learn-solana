import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { createCanonical } from "@/lib/seo";
import { getRuntimeLabProgram, runtimeLabPrograms } from "@/lib/runtime-lab/flows";
import { RuntimeLabProgramClient } from "./runtime-lab-program.client";

type Props = {
  params: Promise<{ programId: string }>;
};

export async function generateStaticParams() {
  return runtimeLabPrograms.map((program) => ({
    programId: program.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { programId } = await params;
  const program = getRuntimeLabProgram(programId);

  if (!program) {
    return {
      title: "Runtime Lab Program Not Found",
    };
  }

  const title = `${program.name} Runtime Lab | LearnSol`;
  const description = program.description;
  const canonical = createCanonical(`/tools/runtime-lab/${program.id}`);

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [
        {
          url: "/og/tools",
          width: 1200,
          height: 630,
          alt: `${program.name} Runtime Lab`,
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
}

export default async function RuntimeLabProgramPage({ params }: Props) {
  const { programId } = await params;
  const program = getRuntimeLabProgram(programId);

  if (!program) {
    notFound();
  }

  return <RuntimeLabProgramClient program={program} />;
}
