import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://learnsol.site'


const AI_AGENTS = [
  'GPTBot',            // OpenAI
  'ChatGPT-User',
  'ChatGPT',
  'Google-Extended',   // Google data training opt-out
  'CCBot',             // Common Crawl
  'Claude-Web',        // Anthropic web scraper UA (may change)
  'anthropic-ai',
  'Bytespider',        // ByteDance
  'facebookexternalhit', // Meta (often for previews; decide if you want to allow)
  'Meta-ExternalAgent',
  'PerplexityBot',
  'Amazonbot',
  'YouBot',            // You.com
  'ImagesiftBot',
  'Diffbot',
  'DataForSeoBot',
  'KagiAPI',
]

export default function robots(): MetadataRoute.Robots {
  return {
    // Allow mainstream search engines & general indexing
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/'],
      },
      // Specific disallows for AI / LLM oriented crawlers
      ...AI_AGENTS.map((agent) => ({
        userAgent: agent,
        disallow: '/',
      })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}
