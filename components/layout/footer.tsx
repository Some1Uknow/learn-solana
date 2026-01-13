"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/10 bg-black/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Project Name */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold font-grotesk text-white">
              learn.sol
            </span>
            <div className="h-2 w-2 rounded-full bg-[#14F195] animate-pulse" />
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://twitter.com/learndotsol"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors duration-300"
              aria-label="Follow us on Twitter"
            >
              <Twitter size={20} />
            </Link>
            <Link
              href="https://github.com/learn-solana"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors duration-300"
              aria-label="View our GitHub"
            >
              <Github size={20} />
            </Link>
          </div>

          {/* Backed by Solana Foundation */}
          <div className="flex items-center gap-3 text-sm text-white/60">
            <span>Supported by</span>
            <Image
              src="/solanaFndn.png"
              alt="Solana Foundation"
              width={120}
              height={30}
              className="object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
            />
          </div>
        </div>

        {/* Bottom section with copyright */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <p>© 2025 learn.sol. All rights reserved.</p>
            <p className="text-center md:text-right">
              Master Solana development with interactive courses, games, and challenges.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}