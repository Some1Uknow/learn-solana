import { test } from "node:test";
import assert from "node:assert/strict";

import {
  createAgentNotFoundMarkdown,
  createHomepageMarkdown,
  mergeVaryHeader,
  negotiateRepresentation,
} from "../lib/agent-readiness";
import { createSiteStructuredData } from "../lib/site-structured-data";

test("prefers Markdown when the client lists it before HTML", () => {
  assert.equal(
    negotiateRepresentation("text/markdown, text/html;q=0.9"),
    "text/markdown",
  );
});

test("honors q-values when HTML is preferred", () => {
  assert.equal(
    negotiateRepresentation("text/html, text/markdown;q=0.1"),
    "text/html",
  );
});

test("does not select a representation explicitly assigned q=0", () => {
  assert.equal(
    negotiateRepresentation("text/markdown;q=0, text/html;q=0.5"),
    "text/html",
  );
});

test("returns no representation for an unsatisfiable Accept header", () => {
  assert.equal(negotiateRepresentation("application/json"), null);
});

test("merges Vary values without duplicating or dropping existing values", () => {
  assert.equal(
    mergeVaryHeader("rsc, next-router-state-tree", "Accept", "Accept-Encoding"),
    "rsc, next-router-state-tree, Accept, Accept-Encoding",
  );
});

test("the agent 404 body points to recovery indexes", () => {
  const body = createAgentNotFoundMarkdown("https://www.learnsol.site");

  assert.match(body, /^# Page not found/m);
  assert.match(body, /https:\/\/www\.learnsol\.site\/llms\.txt/);
  assert.match(body, /https:\/\/www\.learnsol\.site\/sitemap\.xml/);
  assert.match(body, /https:\/\/www\.learnsol\.site\/learn/);
});

test("the homepage Markdown representation describes the product and next steps", () => {
  const body = createHomepageMarkdown("https://www.learnsol.site");

  assert.match(body, /^# learn\.sol/m);
  assert.match(body, /Solana/);
  assert.match(body, /https:\/\/www\.learnsol\.site\/modules/);
  assert.match(body, /https:\/\/www\.learnsol\.site\/llms\.txt/);
});

test("the site identity schemas include a complete Organization and product schema", () => {
  const schemas = createSiteStructuredData("https://www.learnsol.site");
  const organization = schemas.find((schema) => schema["@type"] === "Organization");
  const application = schemas.find(
    (schema) => schema["@type"] === "SoftwareApplication",
  );

  assert.ok(organization);
  assert.equal(organization.url, "https://www.learnsol.site");
  assert.equal((organization.address as { "@type": string })["@type"], "PostalAddress");
  assert.equal(
    (organization.contactPoint as Array<{ email: string; contactType: string }>)[0]?.email,
    "raghav@learnsol.site",
  );
  assert.equal(
    (organization.contactPoint as Array<{ email: string; contactType: string }>)[0]?.contactType,
    "customer support",
  );

  assert.ok(application);
  assert.equal(application.applicationCategory, "DeveloperApplication");
  assert.equal(
    (application.offers as { price: string; priceCurrency: string }).price,
    "0",
  );
});
