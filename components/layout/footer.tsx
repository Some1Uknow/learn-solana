"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Logo + Copyright */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white">learn.sol</span>
            <span className="text-sm text-neutral-500">
              © {new Date().getFullYear()}
            </span>
          </div>

          {/* Center: Supported by */}
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span>Supported by</span>
            <Image
              src="/solanaFndn.png"
              alt="Solana Foundation"
              width={100}
              height={24}
              className="object-contain opacity-60 hover:opacity-100 transition-opacity"
            />
          </div>

          {/* Right: Social Links */}
          <div className="flex items-center gap-3">
            <Link
              href="https://twitter.com/learndotsol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </Link>
            <Link
              href="https://github.com/learn-solana"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}