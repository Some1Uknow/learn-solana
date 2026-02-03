import type { MetadataRoute } from 'next'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Enhanced sitemap for learn.sol with SEO optimizations:
 * - Priorities based on page importance
 * - Change frequencies for crawl optimization
 * - Only includes final resolved URLs (no redirects)
 * - Consistent URL format (no trailing slashes)
 * - Accurate lastModified dates from filesystem
 */

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL ?? 'https://www.learnsol.site').replace(/\/$/, '')
const CONTENT_DIR = path.join(process.cwd(), 'content')

/**
 * Normalizes URL to ensure consistency:
 * - No trailing slashes (except root)
 * - No double slashes
 * - Proper encoding
 */
function normalizeUrl(baseUrl: string, urlPath: string): string {
  // Remove trailing slash from path (except for root)
  const cleanPath = urlPath === '/' ? '' : urlPath.replace(/\/+$/, '')
  // Ensure path starts with /
  const normalizedPath = cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`
  // Combine and ensure no double slashes
  return `${baseUrl}${normalizedPath}`.replace(/([^:]\/)\/+/g, '$1')
}

// Static routes with SEO priorities - these are the canonical, final URLs
// NOTE: /tutorials removed as it returns 404 (tutorials are accessed via /tutorials/[slug])
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/modules', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/games', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/challenges', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/tools', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/tools/visual-builder', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/tools/visual-builder/fullscreen', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/partner', priority: 0.5, changeFrequency: 'monthly' },
]

// Tool categories that have actual pages
const TOOL_CATEGORIES = ['rpc', 'indexing', 'wallets', 'dev-tools']

// Module IDs that have actual pages (week-based structure)
// NOTE: Old IDs (solana-fundamentals, rust-essentials, etc.) were returning 404
// The actual module pages are at /modules/week-X which map to content/week-X
const MODULE_IDS = ['week-1', 'week-2', 'week-3', 'week-4', 'week-5']

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []
  const now = new Date()

  // Add static routes with priorities
  for (const route of STATIC_ROUTES) {
    entries.push({
      url: normalizeUrl(BASE_URL, route.path),
      priority: route.priority,
      changeFrequency: route.changeFrequency,
      lastModified: now,
    })
  }

  // Add tool category pages
  for (const category of TOOL_CATEGORIES) {
    entries.push({
      url: normalizeUrl(BASE_URL, `/tools/${category}`),
      priority: 0.6,
      changeFrequency: 'monthly',
      lastModified: now,
    })
  }

  // Add module detail pages
  for (const moduleId of MODULE_IDS) {
    entries.push({
      url: normalizeUrl(BASE_URL, `/modules/${moduleId}`),
      priority: 0.85,
      changeFrequency: 'weekly',
      lastModified: now,
    })
  }

  // Add week directories and their lesson files
  try {
    const weekDirs = fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => f.startsWith('week-'))
      .filter((f) => fs.statSync(path.join(CONTENT_DIR, f)).isDirectory())
      .sort()

    for (const week of weekDirs) {
      const weekPath = path.join(CONTENT_DIR, week)
      
      // Check if index.mdx exists for week landing page
      const indexPath = path.join(weekPath, 'index.mdx')
      let weekLastModified = now
      if (fs.existsSync(indexPath)) {
        try {
          weekLastModified = fs.statSync(indexPath).mtime
        } catch {
          // Use current date if stat fails
        }
      }
      
      // Week landing pages get high priority (course content)
      entries.push({
        url: normalizeUrl(BASE_URL, `/learn/${week}`),
        priority: 0.85,
        changeFrequency: 'weekly',
        lastModified: weekLastModified,
      })
      
      // Individual lesson files
      const files = fs
        .readdirSync(weekPath)
        .filter((f) => /\.mdx?$/.test(f) && f.toLowerCase() !== 'index.mdx')
        
      for (const file of files) {
        const slug = file.replace(/\.mdx?$/, '')
        const filePath = path.join(weekPath, file)
        let lastModified: Date = now
        try {
          lastModified = fs.statSync(filePath).mtime
        } catch {
          // Use current date if stat fails
        }
        entries.push({
          url: normalizeUrl(BASE_URL, `/learn/${week}/${slug}`),
          priority: 0.8,
          changeFrequency: 'monthly',
          lastModified,
        })
      }
    }

    // Add tutorials if they exist
    const tutorialsDir = path.join(CONTENT_DIR, 'tutorials')
    if (fs.existsSync(tutorialsDir)) {
      const tutorialFiles = fs
        .readdirSync(tutorialsDir)
        .filter((f) => /\.mdx?$/.test(f))
        
      for (const file of tutorialFiles) {
        const slug = file.replace(/\.mdx?$/, '')
        const filePath = path.join(tutorialsDir, file)
        let lastModified: Date = now
        try {
          lastModified = fs.statSync(filePath).mtime
        } catch {
          // Use current date if stat fails
        }
        entries.push({
          url: normalizeUrl(BASE_URL, `/tutorials/${slug}`),
          priority: 0.7,
          changeFrequency: 'monthly',
          lastModified,
        })
      }
    }

    // Add challenge tracks and individual challenges
    const challengesDir = path.join(CONTENT_DIR, 'challenges')
    if (fs.existsSync(challengesDir)) {
      const challengeTracks = fs.readdirSync(challengesDir).filter((f) =>
        fs.statSync(path.join(challengesDir, f)).isDirectory()
      )
      
      for (const track of challengeTracks) {
        // Track landing page
        entries.push({
          url: normalizeUrl(BASE_URL, `/challenges/${track}`),
          priority: 0.75,
          changeFrequency: 'weekly',
          lastModified: now,
        })

        // Individual challenges within track - sorted numerically
        const trackDir = path.join(challengesDir, track)
        const challengeFiles = fs
          .readdirSync(trackDir)
          .filter((f) => /\.mdx?$/.test(f))
          .sort((a, b) => {
            const numA = parseInt(a.replace(/\D/g, ''), 10) || 0
            const numB = parseInt(b.replace(/\D/g, ''), 10) || 0
            return numA - numB
          })
          
        for (const file of challengeFiles) {
          // Extract the challenge number from filename (e.g., "1.mdx" -> "1")
          const challengeNum = file.replace(/\.mdx?$/, '')
          const filePath = path.join(trackDir, file)
          let lastModified: Date = now
          try {
            lastModified = fs.statSync(filePath).mtime
          } catch {
            // Use current date if stat fails
          }
          entries.push({
            url: normalizeUrl(BASE_URL, `/challenges/${track}/${challengeNum}`),
            priority: 0.65,
            changeFrequency: 'monthly',
            lastModified,
          })
        }
      }
    }
  } catch {
    // If FS access fails (e.g., edge runtime), we still return static entries.
  }

  return entries
}
