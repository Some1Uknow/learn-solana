import { opportunityCategories, opportunityPages } from "../data/opportunity-resources";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const errors: string[] = [];

for (const category of opportunityCategories) {
  const page = opportunityPages[category];

  if (!page) {
    errors.push(`Missing page definition for ${category}.`);
    continue;
  }

  if (page.sources.length === 0) {
    errors.push(`${category} has no cited sources.`);
  }

  for (const source of page.sources) {
    if (!source.publisher || !source.title || !source.summary || !source.logo.src || !source.logo.alt) {
      errors.push(`${category} has a source with incomplete citation copy.`);
    }

    try {
      const url = new URL(source.sourceUrl);
      if (url.protocol !== "https:") errors.push(`${source.title} must use HTTPS.`);
    } catch {
      errors.push(`${source.title} has an invalid source URL.`);
    }

    if (!datePattern.test(source.lastVerified) || Number.isNaN(Date.parse(`${source.lastVerified}T00:00:00Z`))) {
      errors.push(`${source.title} has an invalid lastVerified date.`);
    }
  }
}

if (errors.length) {
  console.error("Opportunity resource validation failed:");
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(`Validated ${opportunityCategories.length} opportunity categories and their cited sources.`);
