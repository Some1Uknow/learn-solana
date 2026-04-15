"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Learn", href: "/modules" },
  { label: "Challenges", href: "/challenges" },
  { label: "Tools", href: "/tools" },
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
                "block rounded-2xl border px-4 py-3 text-sm transition-all",
                isActive
                  ? "border-[#a9ff2f]/30 bg-[#a9ff2f]/10 text-white shadow-[inset_0_0_0_1px_rgba(169,255,47,0.05)]"
                  : "border-white/[0.06] bg-white/[0.02] text-white/70 hover:border-white/[0.12] hover:bg-white/[0.05] hover:text-white"
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
    <div className="flex items-center gap-2">
      {navigationItems.map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "rounded-full px-4 py-2 text-sm transition-all",
              isActive
                ? "bg-white/[0.08] text-white"
                : "text-white/60 hover:bg-white/[0.05] hover:text-white"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
