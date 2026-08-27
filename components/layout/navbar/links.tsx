"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Award,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Globe2,
  Rocket,
  Trophy,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { opportunityNavigation, type OpportunityCategory } from "@/data/opportunity-resources";
import { cn } from "@/lib/utils";

const navigationItems = [
  { label: "Learn", href: "/modules" },
  { label: "Challenges", href: "/challenges" },
  { label: "Build", href: "/build" },
  { label: "Tools", href: "/tools" },
];

const opportunityIcons: Record<OpportunityCategory, LucideIcon> = {
  grants: Award,
  jobs: BriefcaseBusiness,
  hackathons: Trophy,
  bounties: CircleDollarSign,
  accelerators: Rocket,
  events: CalendarDays,
  community: Users,
  ecosystem: Globe2,
};

const isActivePath = (pathname: string, href: string) =>
  href === "/" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

interface NavbarLinksProps {
  isMobile?: boolean;
  onNavigate?: () => void;
}

const desktopLinkClass =
  "ds-focus-ring inline-flex h-10 items-center rounded-[6px] px-3 text-sm font-medium transition-colors duration-150";

export function NavbarLinks({ isMobile = false, onNavigate }: NavbarLinksProps) {
  const pathname = usePathname();

  return (
    <div className={isMobile ? "grid gap-1" : "flex items-center gap-1"}>
      {navigationItems.map((item) => {
        const isActive = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              isMobile
                ? "ds-focus-ring flex min-h-10 items-center rounded-[6px] px-3 text-sm font-medium transition-colors duration-150"
                : desktopLinkClass,
              isActive
                ? "bg-[#efefef] text-[#181818]"
                : "text-[#636363] hover:bg-[#efefef] hover:text-[#181818]",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

function OpportunityDropdown({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const hasActiveItem = opportunityNavigation.some((item) => isActivePath(pathname, item.href));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          desktopLinkClass,
          "gap-1.5",
          hasActiveItem
            ? "bg-[#efefef] text-[#181818]"
            : "text-[#636363] hover:bg-[#efefef] hover:text-[#181818]",
        )}
      >
        Opportunities
        <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-64 rounded-xl border-[#dedede] bg-white p-1.5 text-[#181818] shadow-[0_24px_60px_-40px_rgba(0,0,0,0.35)]"
      >
        <DropdownMenuLabel className="px-2.5 py-2 font-mono text-[11px] font-normal uppercase tracking-[0.08em] text-[#636363]">
          Opportunities
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#dedede]" />
        {opportunityNavigation.map((item) => {
          const category = item.href.slice(1) as OpportunityCategory;
          const Icon = opportunityIcons[category];
          const active = isActivePath(pathname, item.href);
          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "min-h-10 cursor-pointer rounded-[6px] px-2.5 text-sm transition-colors focus:bg-[#efefef] focus:text-[#181818]",
                  active ? "bg-[#efefef] text-[#181818]" : "text-[#636363]",
                )}
              >
                <Icon className="h-4 w-4 text-[#636363]" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function OpportunityNavbarLinks({ isMobile = false, onNavigate }: NavbarLinksProps) {
  if (!isMobile) {
    return <OpportunityDropdown onNavigate={onNavigate} />;
  }

  return (
    <div className="grid gap-1">
      {opportunityNavigation.map((item) => {
        const category = item.href.slice(1) as OpportunityCategory;
        const Icon = opportunityIcons[category];
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="ds-focus-ring flex min-h-10 items-center gap-2.5 rounded-[6px] px-3 text-sm font-medium text-[#636363] transition-colors duration-150 hover:bg-[#efefef] hover:text-[#181818]"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
