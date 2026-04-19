import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const canonicalOrigin = "https://www.learnsol.site";

const checks = [];

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function check(name, condition) {
  checks.push({ name, passed: Boolean(condition) });
}

function includes(source, value) {
  return source.includes(value);
}

function hasRouteObject(source, routePath) {
  return new RegExp(`path:\\s*["']${escapeRegex(routePath)}["']`).test(source);
}

function hasRedirect(source, from, to) {
  return new RegExp(
    `source:\\s*["']${escapeRegex(from)}["'][\\s\\S]{0,240}?destination:\\s*["']${escapeRegex(
      to
    )}["'][\\s\\S]{0,120}?permanent:\\s*true`
  ).test(source);
}

function hasCanonicalMetadata(source, canonicalExpression) {
  return includes(source, "alternates") && includes(source, canonicalExpression);
}

const seoSource = read("lib/seo.ts");
const sitemapSource = read("app/sitemap.ts");
const robotsSource = read("app/robots.ts");
const nextConfigSource = read("next.config.mjs");
const middlewareSource = read("middleware.ts");

check("canonical host is www.learnsol.site", includes(seoSource, 'const CANONICAL_HOST = "www.learnsol.site"'));
check("legacy apex host remains redirectable", includes(seoSource, 'new Set(["learnsol.site"])'));
check("site URL is derived from NEXT_PUBLIC_SITE_URL", includes(seoSource, "process.env.NEXT_PUBLIC_SITE_URL"));
check("metadata base uses normalized site URL", includes(seoSource, "export const metadataBase = new URL(siteUrl)"));

const sitemapRoutes = [
  "/",
  "/modules",
  "/challenges",
  "/tools",
  "/tools/runtime-lab",
  "/tools/visual-builder",
  "/branding",
  "/partner",
];

for (const route of sitemapRoutes) {
  check(`sitemap static route includes ${route}`, hasRouteObject(sitemapSource, route));
}

const forbiddenSitemapFragments = [
  "path: '/projects'",
  'path: "/projects"',
  "path: '/tools/visual-builder/fullscreen'",
  'path: "/tools/visual-builder/fullscreen"',
  "path: '/learn/week-",
  'path: "/learn/week-',
  "path: '/modules/week-",
  'path: "/modules/week-',
];

for (const fragment of forbiddenSitemapFragments) {
  check(`sitemap excludes redirected/noindex fragment ${fragment}`, !includes(sitemapSource, fragment));
}

check("sitemap uses canonical siteUrl helper", includes(sitemapSource, 'import { siteUrl } from "@/lib/seo"'));
check("sitemap static routes use source-backed mtimes", includes(sitemapSource, "getLatestProjectMtime(route.sourcePaths"));
check("sitemap excludes runtime lab detail pages", includes(sitemapSource, "Runtime Lab program detail pages are intentionally excluded"));

check("robots references canonical sitemap", includes(robotsSource, "sitemap: `${siteUrl}/sitemap.xml`"));
for (const disallowed of ["/api/", "/_next/", "/llms.txt", "/llms-full.txt", "/llms.mdx/", "/learn.mdx/", "/docs/"]) {
  check(`robots disallows ${disallowed}`, includes(robotsSource, `'${disallowed}'`) || includes(robotsSource, `"${disallowed}"`));
}

for (const [from, to] of [
  ["/projects", "/modules"],
  ["/projects/:path*", "/modules"],
  ["/learn/week-1", "/learn/solana-foundations"],
  ["/learn/week-2", "/learn/rust-foundations"],
  ["/learn/week-3", "/learn/anchor-programs"],
  ["/learn/week-4", "/learn/solana-kit-clients"],
  ["/modules/week-1", "/modules/solana-foundations"],
  ["/modules/week-2", "/modules/rust-foundations"],
  ["/modules/week-3", "/modules/anchor-programs"],
  ["/modules/week-4", "/modules/solana-kit-clients"],
  ["/:path+/", "/:path+"],
]) {
  check(`redirect ${from} -> ${to}`, hasRedirect(nextConfigSource, from, to));
}

check("middleware redirects legacy host only in production", includes(middlewareSource, 'process.env.NODE_ENV === "production"'));
check("middleware uses canonical host", includes(middlewareSource, "canonicalHost"));
check("middleware redirects with 308", includes(middlewareSource, "NextResponse.redirect(canonicalUrl, 308)"));

const publicRouteMetadata = [
  ["app/page.tsx", 'createCanonical("/")'],
  ["app/modules/page.tsx", 'createCanonical("/modules")'],
  ["app/modules/[moduleId]/page.tsx", "createCanonical(`/modules/${moduleId}`)"],
  ["app/challenges/page.tsx", 'createCanonical("/challenges")'],
  ["app/challenges/[track]/page.tsx", "createCanonical(`/challenges/${track}`)"],
  ["app/challenges/[track]/[slug]/page.tsx", "createCanonical(`/challenges/${track}/${exercise.slug}`)"],
  ["app/learn/[[...slug]]/page.tsx", "createCanonical(`/learn${slugPath ? `/${slugPath}` : ''}`)"],
  ["app/tools/page.tsx", 'createCanonical("/tools")'],
  ["app/tools/runtime-lab/page.tsx", 'createCanonical("/tools/runtime-lab")'],
  ["app/tools/visual-builder/page.tsx", 'createCanonical("/tools/visual-builder")'],
  ["app/branding/page.tsx", 'createCanonical("/branding")'],
  ["app/partner/page.tsx", 'createCanonical("/partner")'],
];

for (const [file, canonicalExpression] of publicRouteMetadata) {
  const source = read(file);
  check(`${file} has route canonical`, hasCanonicalMetadata(source, canonicalExpression));
  check(`${file} has Open Graph metadata`, includes(source, "openGraph"));
  check(`${file} has Twitter metadata`, includes(source, "twitter"));
}

for (const file of ["app/tools/runtime-lab/[programId]/page.tsx", "app/tools/visual-builder/fullscreen/page.tsx"]) {
  const source = read(file);
  check(`${file} is noindex`, includes(source, "robots") && includes(source, "index: false"));
  check(`${file} still allows follow`, includes(source, "follow: true"));
}

const failed = checks.filter((item) => !item.passed);

if (failed.length > 0) {
  console.error("SEO route checks failed:");
  for (const failure of failed) {
    console.error(`- ${failure.name}`);
  }
  process.exit(1);
}

console.log(`SEO route checks passed (${checks.length} checks) for ${canonicalOrigin}.`);
