"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Learn", href: "/modules" },
  { label: "Games", href: "/games" },
  { label: "Tools", href: "/tools" },
  { label: "Challenges", href: "/challenges" },
];

interface NavbarLinksProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

export function NavbarLinks({ isMobile = false, onNavigate }: NavbarLinksProps) {
  const pathname = usePathname();

  if (isMobile) {
    return (
      <>
        {navigationItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "block px-3 py-2 text-sm transition-colors rounded-md",
                isActive
                  ? "text-white bg-white/10"
                  : "text-white/70 hover:text-white hover:bg-white/5"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {navigationItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "px-4 py-1.5 text-sm rounded-full transition-all",
              isActive
                ? "text-white bg-white/10"
                : "text-white/60 hover:text-white hover:bg-white/5"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
