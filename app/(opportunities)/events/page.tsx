import { createOpportunityMetadata, OpportunityRoute } from "@/components/opportunities/opportunity-route";

export const metadata = createOpportunityMetadata("events");

export default function EventsPage() {
  return <OpportunityRoute category="events" />;
}
