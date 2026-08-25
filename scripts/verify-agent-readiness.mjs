import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = process.env.AGENT_READINESS_PORT ?? "3210";
const baseUrl = process.env.AGENT_READINESS_BASE_URL ?? `http://127.0.0.1:${port}`;

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function fetchText(pathname, headers) {
  const response = await fetch(`${baseUrl}${pathname}`, { headers });
  return {
    response,
    body: await response.text(),
  };
}

function assertMarkdownResponse(result, expectedStatus = 200) {
  assert.equal(result.response.status, expectedStatus);
  assert.match(result.response.headers.get("content-type") ?? "", /^text\/markdown\b/);
  const vary = (result.response.headers.get("vary") ?? "").toLowerCase();
  assert.match(vary, /(^|,)\s*accept\s*(,|$)/);
  assert.match(vary, /(^|,)\s*accept-encoding\s*(,|$)/);
}

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt += 1) {
    try {
      await fetch(`${baseUrl}/`);
      return;
    } catch {
      await sleep(250);
    }
  }

  throw new Error(`Timed out waiting for Next.js at ${baseUrl}`);
}

async function runChecks() {
  const homepage = await fetchText("/");
  assert.equal(homepage.response.status, 200);
  assert.match(homepage.response.headers.get("content-type") ?? "", /^text\/html\b/);
  assert.match(homepage.body, /<h1[\s\S]*?Onboarding and education layer for Solana[\s\S]*?<\/h1>/);
  assert.match(homepage.body, /<h2[\s\S]*?Learn with your AI agent[\s\S]*?<\/h2>/);
  const visibleText = homepage.body
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  assert.ok(visibleText.length >= 500, `Expected at least 500 visible HTML characters, got ${visibleText.length}`);

  const jsonLd = [...homepage.body.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
    .map((match) => JSON.parse(match[1]));
  const organization = jsonLd.find((schema) => schema["@type"] === "Organization");
  const application = jsonLd.find((schema) => schema["@type"] === "SoftwareApplication");
  assert.ok(organization, "Homepage must expose Organization JSON-LD in raw HTML");
  assert.equal(organization.address?.["@type"], "PostalAddress");
  assert.equal(organization.contactPoint?.[0]?.contactType, "customer support");
  assert.ok(organization.contactPoint?.[0]?.email);
  assert.ok(application, "Homepage must expose SoftwareApplication JSON-LD in raw HTML");
  assert.equal(application.offers?.price, "0");

  const homepageMarkdown = await fetchText("/", { Accept: "text/markdown" });
  assertMarkdownResponse(homepageMarkdown);
  assert.match(homepageMarkdown.body, /^# learn\.sol/m);
  assert.match(homepageMarkdown.body, /\/modules/);

  const lessonMarkdown = await fetchText("/learn/solana-foundations", { Accept: "text/markdown" });
  assertMarkdownResponse(lessonMarkdown);
  assert.match(lessonMarkdown.body, /^# /m);

  const htmlPreferred = await fetchText("/", {
    Accept: "text/html, text/markdown;q=0",
  });
  assert.equal(htmlPreferred.response.status, 200);
  assert.match(htmlPreferred.response.headers.get("content-type") ?? "", /^text\/html\b/);

  const notFound = await fetchText("/not-a-real-agent-readiness-path-2026");
  assert.equal(notFound.response.status, 404);
  assert.match(notFound.body, /Page Not Found/);
  assert.match(notFound.body, /sitemap\.xml/);

  const markdownNotFound = await fetchText("/not-a-real-agent-readiness-path-2026", {
    Accept: "text/markdown",
  });
  assertMarkdownResponse(markdownNotFound, 404);
  assert.match(markdownNotFound.body, /^# Page not found/m);
  assert.match(markdownNotFound.body, /llms\.txt/);

  const llmsIndex = await fetchText("/llms.txt");
  assert.equal(llmsIndex.response.status, 200);
  assert.match(llmsIndex.response.headers.get("content-type") ?? "", /^text\/plain\b/);
  assert.match(llmsIndex.body, /^# learn\.sol/m);
  assert.match(llmsIndex.body, /Markdown:/);

  const fullLlms = await fetchText("/llms-full.txt");
  assert.equal(fullLlms.response.status, 200);
  assert.match(fullLlms.response.headers.get("content-type") ?? "", /^text\/plain\b/);
  assert.ok(fullLlms.body.length > 1000);

  const robots = await fetchText("/robots.txt");
  assert.equal(robots.response.status, 200);
  assert.match(robots.body, /sitemap\.xml/);

  const sitemap = await fetchText("/sitemap.xml");
  assert.equal(sitemap.response.status, 200);
  assert.match(sitemap.body, /<urlset/);
  assert.match(sitemap.body, /www\.learnsol\.site/);
}

const server = process.env.AGENT_READINESS_BASE_URL
  ? null
  : spawn("pnpm", ["exec", "next", "start", "-p", port], {
      cwd: root,
      env: process.env,
      stdio: ["ignore", "ignore", "pipe"],
    });
let serverDiagnostics = "";
server?.stderr.on("data", (chunk) => {
  serverDiagnostics += chunk.toString();
});

try {
  await waitForServer();
  await runChecks();
  console.log(`Agent-readiness checks passed for ${baseUrl}.`);
} catch (error) {
  if (serverDiagnostics) process.stderr.write(serverDiagnostics);
  throw error;
} finally {
  if (server && server.exitCode === null && !server.killed) {
    server.kill("SIGTERM");
    await once(server, "exit").catch(() => undefined);
  }
}
