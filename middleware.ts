import { NextRequest, NextResponse } from "next/server";
import { isMarkdownPreferred, rewritePath } from "fumadocs-core/negotiation";

const learnIndexRewrite = rewritePath("/learn", "/learn.mdx");
const learnPageRewrite = rewritePath("/learn/*path", "/llms.mdx/*path");

export function middleware(request: NextRequest) {
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
  matcher: ["/learn", "/learn/:path*"],
};
