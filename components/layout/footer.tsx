"use client";

import Image from "next/image";
import Link from "next/link";
import { Github, Twitter } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { brand } from "@/lib/brand";

export function Footer() {
  return (
    <footer className="border-t border-[#dedede] bg-[#f5f5f5] text-[#181818]">
      <div className="ds-shell py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left: Logo + Copyright */}
          <div className="flex items-center gap-2.5">
            <BrandLogo variant="mark" className="w-7" />
            <span className="text-[14px] font-medium leading-none tracking-[-0.03em] text-[#181818]">
              learn.sol
            </span>
            <span className="text-sm text-[#636363]">
              © {new Date().getFullYear()}
            </span>
          </div>

          {/* Center: Supported by */}
          <div className="flex items-center gap-2 text-xs text-[#636363]">
            <span>Supported by</span>
            <Image
              src="/solanaFndn.png"
              alt="Solana Foundation"
              width={100}
              height={24}
              className="object-contain object-center opacity-60 transition-opacity hover:opacity-100"
            />
          </div>

          {/* Right: Social Links */}
          <div className="flex items-center gap-3">
            <Link
              href="/branding"
              className="ds-focus-ring rounded-[6px] border border-[#dedede] bg-white px-3 py-2 text-xs font-medium text-[#636363] transition-colors hover:bg-[#efefef] hover:text-[#181818]"
            >
              Brand Kit
            </Link>
            <Link
              href={brand.xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ds-focus-ring rounded-[4px] text-[#636363] transition-colors hover:text-[#181818]"
              aria-label={`${brand.name} on X`}
            >
              <Twitter size={18} />
            </Link>
            <Link
              href={brand.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ds-focus-ring rounded-[4px] text-[#636363] transition-colors hover:text-[#181818]"
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
