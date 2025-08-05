"use client"

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/cn'

// Shared types with page
export interface Topic {
  id: string
  title: string
  description: string
  type: string
}
export interface ModuleItem {
  id: string
  title: string
  description: string
  goal: string
  image?: string
  icon?: string
  topics: Topic[]
}

const DIFFICULTY = 'BEGINNER'
const ALL_TYPES = ['theory','exercise','project','challenge','setup','planning','implementation','quality-assurance','deployment','documentation','optimization','showcase']

const getImageForWeek = (m: ModuleItem, index: number) => {
  // Prefer explicit data.image; override for week 4 as requested
 // if (index === 3) return '/nextjs-N.png'
  return m.image || '/placeholder.png'
}

export default function ModulesGrid({ modules }: { modules: ModuleItem[] }) {
  const [query, setQuery] = useState('')
  const [activeTypes, setActiveTypes] = useState<string[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showSearch, setShowSearch] = useState(true)
  const [active, setActive] = useState<ModuleItem | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // Ghost Search: show/hide based on scroll
  useEffect(() => {
    const onScroll = () => setShowSearch(window.scrollY < 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return modules.filter((m) => {
      const inTitle = m.title.toLowerCase().includes(q)
      const inDesc = m.description.toLowerCase().includes(q)
      const inTopics = m.topics.some(t => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))
      const typesMatch = activeTypes.length === 0 || m.topics.some(t => activeTypes.includes(t.type))
      return (q ? (inTitle || inDesc || inTopics) : true) && typesMatch
    })
  }, [modules, query, activeTypes])

  const toggleType = (t: string) => setActiveTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  const toggleExpand = (id: string) => setExpandedId(prev => prev === id ? null : id)

  const continueItems = filtered.slice(0, 2)
  const rest = filtered.slice(2)

  return (
    <div ref={containerRef}>
      {/* Hero */}
      <div className="mb-10">
        <div className="text-xs tracking-[0.25em] text-zinc-400">[WELCOME]</div>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Select a course to get started</h2>
        {/* Controls row */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="relative block w-full sm:max-w-xl">
            <span className="sr-only">Search</span>
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">🔎</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, category, or level..."
              className="w-full rounded-xl bg-zinc-900/60 pl-9 pr-3 py-3 text-sm text-zinc-100 outline-none transition focus:bg-zinc-900"
            />
          </label>
          <div className="flex items-center gap-3">
            <button className="rounded-xl bg-zinc-900/60 px-4 py-3 text-sm text-zinc-300 hover:bg-zinc-900" type="button">All Categories</button>
            <div className="flex overflow-hidden rounded-xl bg-zinc-900/60">
              <button className="px-3 py-3 text-zinc-300 hover:bg-zinc-900" aria-label="Grid view">▦</button>
              <button className="px-3 py-3 text-zinc-300 hover:bg-zinc-900" aria-label="List view">≡</button>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <section aria-labelledby="continue" className="mt-8">
        <h3 id="continue" className="text-lg font-medium text-zinc-200">Continue Learning</h3>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
          {continueItems.map((m, idx) => (
            <CourseCard key={m.id} m={m} index={idx} onContinue={() => setActive(m)} large />
          ))}
        </div>
      </section>

      {/* All Courses */}
      <section aria-labelledby="all" className="mt-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((m, idx) => (
            <CourseCard key={m.id} m={m} index={idx + 2} onContinue={() => setActive(m)} />
          ))}
        </div>
      </section>

      {/* Immersive Modal */}
      {active && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
          <button aria-label="Close" onClick={() => setActive(null)} className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" />
          <div className="fixed inset-0 mx-auto w-full max-w-3xl translate-y-0 p-4 sm:translate-y-4">
            <div className="relative overflow-hidden rounded-2xl bg-[#0f0f12] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-zinc-500">{(active.icon||'Course').toUpperCase()}</div>
                  <h3 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100">{active.title}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{active.description}</p>
                </div>
                <button onClick={() => setActive(null)} className="rounded-xl bg-white/5 px-3 py-2 text-sm text-zinc-300 hover:bg-white/10" aria-label="Close">Close</button>
              </div>

              <div className="mt-5 rounded-xl bg-white/[0.02] p-4">
                <h4 className="text-sm font-medium text-zinc-200">Learning goal</h4>
                <p className="mt-1 text-sm text-zinc-400">{active.goal}</p>
              </div>

              <div className="mt-6">
                <h4 className="mb-2 text-sm font-medium text-zinc-200">Topics</h4>
                <ul className="space-y-3">
                  {active.topics.map((t, i) => (
                    <li
                      key={t.id}
                      className="rounded-xl bg-white/[0.02] p-3 text-sm text-zinc-300 transition hover:bg-white/[0.04]"
                      style={{ animation: `fadeIn 300ms ease ${i * 70}ms both` }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span className="font-medium text-zinc-100">{t.title}</span>
                        <span className="text-[10px] uppercase tracking-[0.14em] text-zinc-500">{t.type}</span>
                      </div>
                      <p className="mt-1 text-[13px] leading-[1.6] text-zinc-400">{t.description}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <style jsx>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
              `}</style>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CourseCard({ m, index, large, onContinue }: { m: ModuleItem; index: number; large?: boolean; onContinue: () => void }) {
  const img = getImageForWeek(m, index)
  // Derive category from icon or fallback
  const category = (m.icon || '').toUpperCase() || 'COURSE'
  const progress = `1/${Math.max(1, m.topics.length)}` // placeholder progress

  return (
    <article
      className={cn(
        'relative isolate rounded-2xl bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(0,0,0,0))] p-5 text-zinc-100 shadow-[0_8px_40px_rgba(0,0,0,0.15),_0_0_0_1px_rgba(255,255,255,0.02)] transition-transform duration-300 hover:-translate-y-1',
        large ? 'min-h-[220px]' : 'min-h-[220px]'
      )}
    >
      <div className="absolute inset-0 rounded-2xl bg-zinc-950/60" />
      <div className="relative z-10 flex h-full flex-col">
        {/* Top Row: badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-cyan-300">
            ● {DIFFICULTY}
          </span>
        </div>

        {/* Middle */}
        <div className="mt-4 flex items-start gap-4">
          <div className="relative h-20 w-20 shrink-0">
            <Image src={img} alt="course" fill sizes="80px" className="rounded-xl object-contain" />
          </div>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.2em] text-zinc-400">{category}</div>
            <h4 className="mt-1 text-xl font-semibold tracking-tight">{m.title.replace(/^[^\w]*/,'')}</h4>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-auto flex items-center justify-between pt-6">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>◦</span>
            <span>{progress}</span>
          </div>
          <button className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-black transition hover:bg-cyan-400" type="button" onClick={onContinue}>
            CONTINUE →
          </button>
        </div>
      </div>
    </article>
  )
}
