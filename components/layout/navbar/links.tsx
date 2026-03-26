"use client";

import Link from "next/link";

const navigationItems = [
  { label: "Learn", href: "/modules" },
  { label: "Games", href: "/games" },
  { label: "Tools", href: "/tools" },
  { label: "Challenges", href: "/challenges" },
];

interface NavbarLinksProps {
  isMobile?: boolean;
}

export function NavbarLinks({ isMobile = false }: NavbarLinksProps) {
  if (isMobile) {
    return (
      <>
        {navigationItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="block px-3 py-2 text-sm text-white/70 hover:text-white transition-colors rounded-md hover:bg-white/5"
          >
            {item.label}
          </Link>
        ))}
      </>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {navigationItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="px-3 py-1.5 text-sm text-white/60 hover:text-white transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
