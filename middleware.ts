import { NextRequest, NextResponse } from "next/server";
import { rewritePath } from "fumadocs-core/negotiation";
import {
  canonicalHost,
  isLocalDevelopmentHost,
  legacySiteHosts,
} from "@/lib/seo";
import {
  mergeVaryHeader,
  negotiateRepresentation,
} from "@/lib/agent-readiness";

const learnIndexRewrite = rewritePath("/learn", "/learn.mdx");
const learnPageRewrite = rewritePath("/learn/*path", "/llms.mdx/*path");

const knownRoutePrefixes = [
  "/accelerators",
  "/ai",
  "/api",
  "/bounties",
  "/branding",
  "/build",
  "/challenges",
  "/community",
  "/ecosystem",
  "/events",
  "/games",
  "/grants",
  "/hackathons",
  "/jobs",
  "/learn",
  "/llms",
  "/modules",
  "/og",
  "/partner",
  "/tools",
  "/tutorials",
];

function isMarkdownCapablePath(pathname: string) {
  return (
    pathname === "/" ||
    pathname === "/learn" ||
    pathname.startsWith("/learn/") ||
    pathname.startsWith("/docs/") ||
    pathname.endsWith(".mdx")
  );
}

function isKnownRoutePath(pathname: string) {
  return (
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    knownRoutePrefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  );
}

function withNegotiationVary(response: NextResponse) {
  response.headers.set(
    "Vary",
    mergeVaryHeader(response.headers.get("Vary"), "Accept", "Accept-Encoding"),
  );
  return response;
}

export function middleware(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const requestHostHeader = forwardedHost ?? request.headers.get("host");
  const requestHost = requestHostHeader?.split(":")[0].toLowerCase() ?? request.nextUrl.hostname.toLowerCase();

  if (
    process.env.NODE_ENV === "production" &&
    !isLocalDevelopmentHost(requestHost) &&
    legacySiteHosts.includes(requestHost)
  ) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.protocol = "https";
    canonicalUrl.hostname = canonicalHost;
    canonicalUrl.port = "";

    return NextResponse.redirect(canonicalUrl, 308);
  }

  const { pathname } = request.nextUrl;
  const markdownCapable =
    isMarkdownCapablePath(pathname) || !isKnownRoutePath(pathname);
  const representation = markdownCapable
    ? negotiateRepresentation(request.headers.get("accept"))
    : null;

  if (representation !== "text/markdown") {
    const response = NextResponse.next();
    return markdownCapable ? withNegotiationVary(response) : response;
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/llms") ||
    pathname.endsWith(".mdx")
  ) {
    return withNegotiationVary(NextResponse.next());
  }

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/llms-home";
    return withNegotiationVary(NextResponse.rewrite(url));
  }

  if (!isKnownRoutePath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/llms-404";
    return withNegotiationVary(NextResponse.rewrite(url));
  }

  const rewrittenPath =
    learnIndexRewrite.rewrite(pathname) || learnPageRewrite.rewrite(pathname);

  if (!rewrittenPath) {
    return withNegotiationVary(NextResponse.next());
  }

  const url = request.nextUrl.clone();
  url.pathname = rewrittenPath;

  return withNegotiationVary(NextResponse.rewrite(url));
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\..*).*)",
    "/robots.txt",
    "/sitemap.xml",
  ],
};
