import type { MetadataRoute } from 'next'
import fs from 'node:fs'
import path from 'node:path'
import { siteUrl } from "@/lib/seo";
import { contentsData } from "@/data/contents-data";
import { listExerciseTracks, listExercisesByTrack } from "@/lib/challenges/exercises";

/**
 * Enhanced sitemap for learn.sol with SEO optimizations:
 * - Priorities based on page importance
 * - Change frequencies for crawl optimization
 * - Only includes final resolved URLs (no redirects)
 * - Consistent URL format (no trailing slashes)
 * - Accurate lastModified dates from filesystem
 */

const BASE_URL = siteUrl.replace(/\/$/, '')
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
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/modules', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/challenges', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/tools', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/tools/runtime-lab', priority: 0.65, changeFrequency: 'monthly' },
  { path: '/tools/visual-builder', priority: 0.6, changeFrequency: 'monthly' },
  { path: '/tools/visual-builder/fullscreen', priority: 0.5, changeFrequency: 'monthly' },
  { path: '/partner', priority: 0.5, changeFrequency: 'monthly' },
]

// Module IDs that have actual pages
const MODULE_IDS = contentsData.modules.map((module) => module.id)

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

  // Add module detail pages
  for (const moduleId of MODULE_IDS) {
    entries.push({
      url: normalizeUrl(BASE_URL, `/modules/${moduleId}`),
      priority: 0.85,
      changeFrequency: 'weekly',
      lastModified: now,
    })
  }

  // Add curriculum section directories and their lesson files
  try {
    const sectionDirs = fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => f !== 'challenges')
      .filter((f) => fs.statSync(path.join(CONTENT_DIR, f)).isDirectory())
      .sort()

    for (const section of sectionDirs) {
      const sectionPath = path.join(CONTENT_DIR, section)
      
      // Check if index.mdx exists for section landing page
      const indexPath = path.join(sectionPath, 'index.mdx')
      let sectionLastModified = now
      if (fs.existsSync(indexPath)) {
        try {
          sectionLastModified = fs.statSync(indexPath).mtime
        } catch {
          // Use current date if stat fails
        }
      }
      
      // Section landing pages get high priority
      entries.push({
        url: normalizeUrl(BASE_URL, `/learn/${section}`),
        priority: 0.85,
        changeFrequency: 'weekly',
        lastModified: sectionLastModified,
      })
      
      // Individual lesson files
      const files = fs
        .readdirSync(sectionPath)
        .filter((f) => /\.mdx?$/.test(f) && f.toLowerCase() !== 'index.mdx')
        
      for (const file of files) {
        const slug = file.replace(/\.mdx?$/, '')
        const filePath = path.join(sectionPath, file)
        let lastModified: Date = now
        try {
          lastModified = fs.statSync(filePath).mtime
        } catch {
          // Use current date if stat fails
        }
        entries.push({
          url: normalizeUrl(BASE_URL, `/learn/${section}/${slug}`),
          priority: 0.8,
          changeFrequency: 'monthly',
          lastModified,
        })
      }
    }

    // Add challenge tracks and individual challenges
    const challengeTracks = listExerciseTracks()
    if (challengeTracks.length > 0) {
      for (const track of challengeTracks) {
        // Track landing page
        entries.push({
          url: normalizeUrl(BASE_URL, `/challenges/${track}`),
          priority: 0.75,
          changeFrequency: 'weekly',
          lastModified: now,
        })

        for (const exercise of listExercisesByTrack(track)) {
          let lastModified: Date = now
          try {
            lastModified = fs.statSync(exercise.filePath).mtime
          } catch {
            // Use current date if stat fails
          }
          entries.push({
            url: normalizeUrl(BASE_URL, `/challenges/${track}/${exercise.slug}`),
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
