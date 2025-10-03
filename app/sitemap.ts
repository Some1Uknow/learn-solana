import type { MetadataRoute } from 'next'
import fs from 'node:fs'
import path from 'node:path'

// Simple dynamic sitemap for learn.sol
// Enumerates curriculum weeks and lesson pages under /learn/week-X/<slug>

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://learnsol.site'
const CONTENT_DIR = path.join(process.cwd(), 'content')

// Top-level non-learn routes we want indexed
const STATIC_PATHS: string[] = [
  '/',
  '/games',
  '/challenges',
  '/modules',
  '/projects',
  '/llms',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = []

  // Add static paths (no volatile lastModified; omit if not meaningful)
  for (const p of STATIC_PATHS) entries.push({ url: `${BASE_URL}${p}` })

  // Add week directories and their lesson files
  try {
    const weekDirs = fs
      .readdirSync(CONTENT_DIR)
      .filter((f) => f.startsWith('week-'))
      .filter((f) => fs.statSync(path.join(CONTENT_DIR, f)).isDirectory())
      .sort()

    for (const week of weekDirs) {
      // Week landing (index.mdx exists but route is /learn/week-X)
      entries.push({ url: `${BASE_URL}/learn/${week}` })
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
          ...(lastModified ? { lastModified } : {}),
        })
      }
    }
  } catch {
    // If FS access fails (e.g., edge runtime), we still return static entries.
  }

  return entries
}
