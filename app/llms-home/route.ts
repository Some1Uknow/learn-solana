import { NextResponse } from "next/server";

import { createHomepageMarkdown } from "@/lib/agent-readiness";
import { siteUrl } from "@/lib/seo";

export const revalidate = false;

export async function GET() {
  return new NextResponse(createHomepageMarkdown(siteUrl), {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "vary": "Accept, Accept-Encoding",
      "x-robots-tag": "noindex, nofollow, noarchive",
    },
  });
}
