import { createOpportunityMetadata, OpportunityRoute } from "@/components/opportunities/opportunity-route";

export const metadata = createOpportunityMetadata("accelerators");

export default function AcceleratorsPage() {
  return <OpportunityRoute category="accelerators" />;
}
