"use client";

import Link from "next/link";

export default function SponsorSection() {
  return (
    <div className="mb-16 md:mb-20">
      <Link 
        href="/tools/rpc"
        className="group block"
      >
        <div className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gray-800 border border-white/5 hover:border-white/10 transition-all duration-300">
          <span className="text-sm text-zinc-400 font-medium">Sponsored by</span>
          <img 
            src="https://app.syndica.io/_next/static/media/syndica-logo.16509d59.svg"
            alt="Syndica"
            className="h-7 opacity-90 group-hover:opacity-100 transition-opacity"
          />

        </div>
      </Link>
    </div>
  );
}
