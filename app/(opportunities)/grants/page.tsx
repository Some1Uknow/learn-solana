import { createOpportunityMetadata, OpportunityRoute } from "@/components/opportunities/opportunity-route";

export const metadata = createOpportunityMetadata("grants");

export default function GrantsPage() {
  return <OpportunityRoute category="grants" />;
}
