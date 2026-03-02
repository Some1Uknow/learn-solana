import type { MetadataRoute } from 'next'
import { siteUrl } from "@/lib/seo";

/**
 * Optimizes robots.txt for SEO:
 * 1. Allows all user agents (including AI bots) to discover and index content.
 * 2. Disallows technical paths that shouldn't be indexed (API, Internal Next.js paths).
 * 3. Points to the correct sitemap URL.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/static/',
          '/icon.ico',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
