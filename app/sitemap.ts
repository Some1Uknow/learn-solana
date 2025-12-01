import type { MetadataRoute } from 'next'
import fs from 'node:fs'
import path from 'node:path'

// Enhanced sitemap for learn.sol with priorities and change frequencies
// Helps Google understand page importance and crawl frequency

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://learnsol.site'
const CONTENT_DIR = path.join(process.cwd(), 'content')

// Static routes with SEO priorities
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: 'daily' | 'weekly' | 'monthly' }[] = [
  { path: '/', priority: 1.0, changeFrequency: 'weekly' },
  { path: '/modules', priority: 0.9, changeFrequency: 'weekly' },
  { path: '/games', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/challenges', priority: 0.8, changeFrequency: 'weekly' },
  { path: '/tools', priority: 0.7, changeFrequency: 'monthly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Add static routes with priorities
  for (const route of STATIC_ROUTES) {
    entries.push({
      url: `${BASE_URL}${route.path}`,
      priority: route.priority,
      changeFrequency: route.changeFrequency,
      lastModified: new Date(),
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
      // Week landing pages get high priority (course content)
      entries.push({
        url: `${BASE_URL}/learn/${week}`,
        priority: 0.85,
        changeFrequency: 'weekly',
      })
      const weekPath = path.join(CONTENT_DIR, week)
      const files = fs
        .readdirSync(weekPath)
        .filter((f) => /\.mdx?$/.test(f) && f.toLowerCase() !== 'index.mdx')
      for (const file of files) {
        const slug = file.replace(/\.mdx?$/, '')
        const filePath = path.join(weekPath, file)
        let lastModified: Date | undefined
        try {
          const stat = fs.statSync(filePath)
          lastModified = stat.mtime
        } catch {
          // ignore per-file errors
        }
        entries.push({
          url: `${BASE_URL}/learn/${week}/${slug}`,
          priority: 0.8,
          changeFrequency: 'monthly',
          ...(lastModified ? { lastModified } : {}),
        })
      }
    }

    // Add challenge tracks if they exist
    const challengesDir = path.join(CONTENT_DIR, 'challenges')
    if (fs.existsSync(challengesDir)) {
      const challengeTracks = fs.readdirSync(challengesDir).filter((f) =>
        fs.statSync(path.join(challengesDir, f)).isDirectory()
      )
      for (const track of challengeTracks) {
        entries.push({
          url: `${BASE_URL}/challenges/${track}`,
          priority: 0.75,
          changeFrequency: 'weekly',
        })
      }
    }
  } catch {
    // If FS access fails (e.g., edge runtime), we still return static entries.
  }

  return entries
}
