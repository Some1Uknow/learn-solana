import { createOpportunityMetadata, OpportunityRoute } from "@/components/opportunities/opportunity-route";

export const metadata = createOpportunityMetadata("hackathons");

export default function HackathonsPage() {
  return <OpportunityRoute category="hackathons" />;
}
