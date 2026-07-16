import { createOpportunityMetadata, OpportunityRoute } from "@/components/opportunities/opportunity-route";

export const metadata = createOpportunityMetadata("ecosystem");

export default function EcosystemPage() {
  return <OpportunityRoute category="ecosystem" />;
}
