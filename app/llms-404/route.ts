import { NextResponse } from "next/server";

import { createAgentNotFoundMarkdown } from "@/lib/agent-readiness";
import { siteUrl } from "@/lib/seo";

export const revalidate = false;

export async function GET() {
  return new NextResponse(createAgentNotFoundMarkdown(siteUrl), {
    status: 404,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "vary": "Accept, Accept-Encoding",
      "x-robots-tag": "noindex, nofollow, noarchive",
    },
  });
}

export function HEAD() {
  return new NextResponse(null, {
    status: 404,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
      "vary": "Accept, Accept-Encoding",
      "x-robots-tag": "noindex, nofollow, noarchive",
    },
  });
}

export const POST = GET;
export const PUT = GET;
export const PATCH = GET;
export const DELETE = GET;
