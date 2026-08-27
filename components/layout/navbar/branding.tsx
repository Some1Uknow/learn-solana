"use client";

import Link from "next/link";

import { BrandLogo } from "@/components/brand/brand-logo";
import { brand } from "@/lib/brand";

export function NavbarBranding() {
  return (
    <Link
      href="/"
      aria-label={`${brand.name} home`}
      className="group inline-flex min-w-[132px] items-center gap-2.5"
    >
      <BrandLogo
        variant="mark"
        priority
        className="w-7 transition-opacity duration-150 group-hover:opacity-80"
      />
      <BrandLogo
        variant="textBlack"
        priority
        className="w-[88px] transition-opacity duration-150 group-hover:opacity-80"
      />
    </Link>
  );
}
