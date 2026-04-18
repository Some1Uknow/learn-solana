"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, Twitter } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Logo + Copyright */}
          <div className="flex items-center gap-3">
            <BrandLogo variant="text" className="w-[92px]" />
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
              href="/branding"
              className="rounded-lg border border-white/[0.08] px-3 py-2 text-xs font-semibold text-neutral-400 transition-colors hover:border-white/[0.16] hover:text-white"
            >
              Brand Kit
            </Link>
            <Link
              href={brand.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
              aria-label={`${brand.name} on X`}
            >
              <Twitter size={18} />
            </Link>
            <Link
              href={brand.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-500 hover:text-white transition-colors"
              aria-label={`${brand.name} on GitHub`}
            >
              <Github size={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
