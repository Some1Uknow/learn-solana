"use client";

import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { brand } from "@/lib/brand";

export function NavbarBranding() {
  return (
    <Link
      href="/"
      aria-label={`${brand.name} home`}
      className="ls-brand-lockup group inline-flex min-w-[132px] items-center gap-2.5"
    >
      <BrandLogo
        variant="mark"
        className="h-7 w-7 shrink-0 transition-opacity duration-150 group-hover:opacity-80"
      />
      <span className="ls-brand-wordmark transition-opacity duration-150 group-hover:opacity-80">
        learn.sol
      </span>
    </Link>
  );
}
