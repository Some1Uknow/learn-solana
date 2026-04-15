"use client";

import Link from "next/link";

// Logo configuration
const logoConfig = {
  text: "learn.sol",
  href: "/",
  showPulse: true,
  pulseColor: "bg-[#14F195]",
};

export function NavbarBranding() {
  return (
    <Link
      href={logoConfig.href}
      className="group inline-flex min-w-[120px] items-center gap-2.5"
    >
      <span className="h-3 w-3 rounded-full bg-[radial-gradient(circle_at_35%_35%,#d9ff9d_0%,#a9ff2f_48%,#70b900_100%)] shadow-[0_0_18px_rgba(169,255,47,0.45)]" />
      <span className="text-xl font-semibold tracking-tight text-white">
        {logoConfig.text}
      </span>
      {logoConfig.showPulse && (
        <div
          className={`h-1.5 w-1.5 rounded-full ${logoConfig.pulseColor} animate-pulse opacity-80`}
        />
      )}
    </Link>
  );
}
