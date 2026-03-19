import type { Metadata } from "next";
import { createCanonical } from "@/lib/seo";
import ProgramSimulatorClient from "./program-simulator.client";

const title = "Program Simulator | LearnSol";
const description =
  "No-code Anchor runner that simulates account checks, PDAs, and instruction execution step-by-step.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: createCanonical("/tools/program-simulator"),
  },
  openGraph: {
    title,
    description,
    url: createCanonical("/tools/program-simulator"),
    images: [
      {
        url: "/og/tools",
        width: 1200,
        height: 630,
        alt: "LearnSol Program Simulator",
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

export default function ProgramSimulatorPage() {
  return <ProgramSimulatorClient />;
}
