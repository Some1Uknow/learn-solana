import { createOpportunityMetadata, OpportunityRoute } from "@/components/opportunities/opportunity-route";

export const metadata = createOpportunityMetadata("community");

export default function CommunityPage() {
  return <OpportunityRoute category="community" />;
}
