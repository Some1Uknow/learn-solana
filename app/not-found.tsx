"use client";

import Link from "next/link";

const backgroundStyle = `
  radial-gradient(ellipse 120% 80% at 70% 20%, rgba(255, 20, 147, 0.15), transparent 50%),
  radial-gradient(ellipse 100% 60% at 30% 10%, rgba(0, 255, 255, 0.12), transparent 60%),
  radial-gradient(ellipse 90% 70% at 50% 0%, rgba(138, 43, 226, 0.18), transparent 65%),
  radial-gradient(ellipse 110% 50% at 80% 30%, rgba(255, 215, 0, 0.08), transparent 40%),
  #000000
`;

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <div className="absolute inset-0" style={{ background: backgroundStyle }} />
      <div className="relative z-10 flex min-h-screen w-full justify-center px-6 py-16 md:px-10">
        <div className="flex w-full max-w-4xl flex-col gap-14">
          <header className="space-y-8 text-center">
            <div className="space-y-4">
              <div className="text-xs tracking-[0.25em] text-zinc-500">[404 ERROR]</div>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Page Not Found
              </h1>
              <p className="max-w-2xl mx-auto text-sm text-zinc-400 sm:text-base">
                Oops! This page seems to have been slashed by a rogue validator. Don't worry, your SOL is safe... we think.
              </p>
            </div>
          </header>

          <div className="grid gap-8 md:grid-cols-2">
            <article className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 shadow-[0_55px_140px_rgba(0,0,0,0.6)] backdrop-blur-md transition">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="relative space-y-6">
                <h2 className="text-xl font-semibold text-white">What Happened?</h2>
                <div className="space-y-4 text-sm text-zinc-400">
                  <p>
                    <span className="text-zinc-300">RPC Error:</span> The endpoint you're looking for doesn't exist on this cluster.
                  </p>
                  <p>
                    <span className="text-zinc-300">Possible Causes:</span>
                  </p>
                  <ul className="space-y-2 ml-4">
                    <li>• You mistyped the URL (happens to the best of us)</li>
                    <li>• This page got reallocated to a different PDA</li>
                    <li>• Network congestion caused a timeout</li>
                    <li>• The page is still being confirmed on-chain</li>
                  </ul>
                </div>
              </div>
            </article>

            <article className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 shadow-[0_55px_140px_rgba(0,0,0,0.6)] backdrop-blur-md transition">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              <div className="relative space-y-6">
                <h2 className="text-xl font-semibold text-white">Blockchain Wisdom</h2>
                <div className="space-y-4 text-sm text-zinc-400">
                  <blockquote className="border-l-2 border-cyan-400/50 pl-4 italic">
                    "In the world of Solana, not all transactions succeed. But every failed one teaches you something about resilience."
                  </blockquote>
                  <p>
                    Remember: Even Vitalik lost ETH in the early days. You're in good company!
                  </p>
                  <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                    <p className="text-xs text-red-400 font-mono">
                      Error: PDA_NOT_FOUND<br />
                      Hint: Try checking your account permissions
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <article className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-10 shadow-[0_55px_140px_rgba(0,0,0,0.6)] backdrop-blur-md transition">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
            <div className="relative space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-white">Let's Get You Back on Track</h2>
                <p className="text-sm text-zinc-400 max-w-md mx-auto">
                  No need to panic! Here are some safe paths back to civilization:
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  href="/"
                  className="group/btn flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="text-2xl">🏠</div>
                  <div className="text-sm font-medium text-white">Home</div>
                  <div className="text-xs text-zinc-400">Safe harbor</div>
                </Link>

                <Link
                  href="/learn"
                  className="group/btn flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="text-2xl">📚</div>
                  <div className="text-sm font-medium text-white">Learn</div>
                  <div className="text-xs text-zinc-400">Continue learning</div>
                </Link>

                <Link
                  href="/modules"
                  className="group/btn flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="text-2xl">🧩</div>
                  <div className="text-sm font-medium text-white">Modules</div>
                  <div className="text-xs text-zinc-400">Structured learning</div>
                </Link>

                <Link
                  href="/games"
                  className="group/btn flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="text-2xl">🎮</div>
                  <div className="text-sm font-medium text-white">Games</div>
                  <div className="text-xs text-zinc-400">Have some fun</div>
                </Link>
              </div>
            </div>
          </article>

          <footer className="pb-8 pt-4 text-center space-y-4">
            <div className="text-xs text-zinc-500">
              If you believe this is an error, please check your connection and try again.
            </div>
            <div className="text-xs text-zinc-600">
              Pro tip: In Solana, patience is a virtue. Transactions take time!
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}