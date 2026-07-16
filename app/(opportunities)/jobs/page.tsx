import { createOpportunityMetadata, OpportunityRoute } from "@/components/opportunities/opportunity-route";

export const metadata = createOpportunityMetadata("jobs");

export default function JobsPage() {
  return <OpportunityRoute category="jobs" />;
}
