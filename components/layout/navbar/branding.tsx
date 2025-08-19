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
      className="flex items-center gap-2 group min-w-[120px]"
    >
      <span className="text-xl font-bold font-grotesk">
        {logoConfig.text}
      </span>
      {logoConfig.showPulse && (
        <div
          className={`h-2 w-2 rounded-full ${logoConfig.pulseColor} animate-pulse`}
        />
      )}
    </Link>
  );
}
