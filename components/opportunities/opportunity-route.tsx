import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { OpportunityPageView } from "@/components/opportunities/opportunity-page";
import { getOpportunityPage, type OpportunityCategory } from "@/data/opportunity-resources";
import { createCanonical } from "@/lib/seo";

export function createOpportunityMetadata(category: OpportunityCategory): Metadata {
  const page = getOpportunityPage(category);
  if (!page) return {};

  return {
    title: `${page.label} for Solana Builders | learn.sol`,
    description: page.description,
    alternates: { canonical: createCanonical(page.href) },
  };
}

export function OpportunityRoute({ category }: { category: OpportunityCategory }) {
  const page = getOpportunityPage(category);
  if (!page) notFound();
  return (
    <div className="ls-learn-shell">
      <Navbar />
      <OpportunityPageView page={page} />
      <Footer />
    </div>
  );
}
