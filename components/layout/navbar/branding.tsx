"use client";

import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { brand } from "@/lib/brand";

export function NavbarBranding() {
  return (
    <Link
      href="/"
      aria-label={`${brand.name} home`}
      className="group inline-flex min-w-[132px] items-center gap-2"
    >
      <BrandLogo
        variant="wordmark"
        priority
        className="w-[132px] transition-opacity duration-200 group-hover:opacity-85"
      />
    </Link>
  );
}
