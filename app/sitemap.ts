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

type SitemapRoute = {
  path: string
  priority: number
  changeFrequency: 'daily' | 'weekly' | 'monthly'
  sourcePaths: string[]
}

function getLatestProjectMtime(sourcePaths: string[], fallback: Date): Date {
  let latest: Date | undefined

  for (const sourcePath of sourcePaths) {
    try {
      const fullPath = path.join(process.cwd(), sourcePath)
      const stat = fs.statSync(fullPath)
      const mtime = stat.isDirectory() ? getLatestDirectoryMtime(fullPath, fallback) : stat.mtime
      if (!latest || mtime > latest) latest = mtime
    } catch {
      // Missing source files should not break sitemap generation.
    }
  }

  return latest ?? fallback
}

function getLatestDirectoryMtime(directoryPath: string, fallback: Date): Date {
  let latest: Date | undefined

  try {
    for (const item of fs.readdirSync(directoryPath)) {
      const fullPath = path.join(directoryPath, item)
      const stat = fs.statSync(fullPath)
      const mtime = stat.isDirectory() ? getLatestDirectoryMtime(fullPath, fallback) : stat.mtime
      if (!latest || mtime > latest) latest = mtime
    }
  } catch {
    return fallback
  }

  return latest ?? fallback
}

// Static routes with SEO priorities - these are the canonical, final URLs
const STATIC_ROUTES: SitemapRoute[] = [
  {
    path: '/',
    priority: 1.0,
    changeFrequency: 'weekly',
    sourcePaths: ['app/page.tsx', 'app/home-page.client.tsx', 'lib/brand.ts'],
  },
  {
    path: '/modules',
    priority: 0.9,
    changeFrequency: 'weekly',
    sourcePaths: ['app/modules/page.tsx', 'app/modules/modules-page.client.tsx', 'data/contents-data.ts'],
  },
  {
    path: '/challenges',
    priority: 0.8,
    changeFrequency: 'weekly',
    sourcePaths: ['app/challenges/page.tsx', 'app/challenges/challenges-page.client.tsx', 'lib/challenges/exercises.ts'],
  },
  {
    path: '/tools',
    priority: 0.7,
    changeFrequency: 'monthly',
    sourcePaths: ['app/tools/page.tsx', 'app/tools/tools-page.client.tsx'],
  },
  {
    path: '/tools/runtime-lab',
    priority: 0.65,
    changeFrequency: 'monthly',
    sourcePaths: ['app/tools/runtime-lab/page.tsx', 'app/tools/runtime-lab/runtime-lab.client.tsx', 'lib/runtime-lab/flows.ts'],
  },
  {
    path: '/tools/visual-builder',
    priority: 0.6,
    changeFrequency: 'monthly',
    sourcePaths: ['app/tools/visual-builder/page.tsx', 'app/tools/visual-builder/visual-builder.client.tsx'],
  },
  {
    path: '/branding',
    priority: 0.55,
    changeFrequency: 'monthly',
    sourcePaths: ['app/branding/page.tsx', 'app/branding/branding.module.css', 'lib/brand.ts'],
  },
  {
    path: '/partner',
    priority: 0.5,
    changeFrequency: 'monthly',
    sourcePaths: ['app/partner/page.tsx', 'app/partner/partner-page.client.tsx'],
  },
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
      lastModified: getLatestProjectMtime(route.sourcePaths, now),
    })
  }

  // Add module detail pages
  for (const moduleId of MODULE_IDS) {
    entries.push({
      url: normalizeUrl(BASE_URL, `/modules/${moduleId}`),
      priority: 0.85,
      changeFrequency: 'weekly',
      lastModified: getLatestProjectMtime(['app/modules/[moduleId]/page.tsx', 'data/contents-data.ts'], now),
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
          lastModified: getLatestProjectMtime(
            [
              `content/challenges/${track}`,
              'app/challenges/[track]/page.tsx',
              'lib/challenges/exercises.ts',
            ],
            now
          ),
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

    // Runtime Lab program detail pages are intentionally excluded:
    // they are gated behind authentication and are not canonical search landing pages.
  } catch {
    // If FS access fails (e.g., edge runtime), we still return static entries.
  }

  return entries
}
