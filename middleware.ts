import { NextRequest, NextResponse } from "next/server";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";
import {
  canonicalHost,
  isLocalDevelopmentHost,
  legacySiteHosts,
} from "@/lib/seo";

const learnIndexRewrite = rewritePath("/learn", "/learn.mdx");
const learnPageRewrite = rewritePath("/learn/*path", "/llms.mdx/*path");

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

  if (!isMarkdownPreferred(request)) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/llms") ||
    pathname.endsWith(".mdx")
  ) {
    return NextResponse.next();
  }

  const rewrittenPath =
    learnIndexRewrite.rewrite(pathname) || learnPageRewrite.rewrite(pathname);

  if (!rewrittenPath) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = rewrittenPath;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\..*).*)",
    "/robots.txt",
    "/sitemap.xml",
  ],
};
