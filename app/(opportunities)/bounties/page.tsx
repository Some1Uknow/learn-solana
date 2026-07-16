import { createOpportunityMetadata, OpportunityRoute } from "@/components/opportunities/opportunity-route";

export const metadata = createOpportunityMetadata("bounties");

export default function BountiesPage() {
  return <OpportunityRoute category="bounties" />;
}
