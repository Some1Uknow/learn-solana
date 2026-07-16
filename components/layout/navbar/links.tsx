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
  { label: "Tools", href: "/tools" },
];

const primaryOpportunityCategories = new Set<OpportunityCategory>(["grants", "jobs", "hackathons"]);

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
  "inline-flex min-h-10 items-center rounded-full px-3 text-sm font-medium transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a9ff2f] active:translate-y-px";

export function NavbarLinks({ isMobile = false, onNavigate }: NavbarLinksProps) {
  const pathname = usePathname();

  if (isMobile) {
    return (
      <>
        {navigationItems.map((item) => {
          const isActive = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-11 items-center rounded-xl px-3 text-sm font-medium transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a9ff2f]",
                isActive ? "bg-white/[0.08] text-white" : "text-white/72 hover:bg-white/[0.05] hover:text-white",
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
    <div className="flex items-center gap-0.5">
      {navigationItems.map((item) => {
        const isActive = isActivePath(pathname, item.href);
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              desktopLinkClass,
              isActive ? "bg-white/[0.08] text-white" : "text-white/62 hover:bg-white/[0.05] hover:text-white",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

function OpportunityDropdown({ mode }: { mode: "all" | "secondary" }) {
  const pathname = usePathname();
  const items = opportunityNavigation.filter((item) => {
    if (mode === "all") return true;
    return !primaryOpportunityCategories.has(item.href.slice(1) as OpportunityCategory);
  });
  const hasActiveItem = items.some((item) => isActivePath(pathname, item.href));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          desktopLinkClass,
          "gap-1.5",
          hasActiveItem ? "bg-white/[0.08] text-white" : "text-white/62 hover:bg-white/[0.05] hover:text-white",
        )}
      >
        {mode === "all" ? "Opportunities" : "More"}
        <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        sideOffset={10}
        className="w-72 rounded-2xl border-white/[0.1] bg-[#0c0d0f]/98 p-2 text-white shadow-[0_20px_50px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      >
        <DropdownMenuLabel className="px-3 pb-2 pt-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/60">
          Build your next step
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="mx-2 bg-white/[0.08]" />
        {items.map((item) => {
          const category = item.href.slice(1) as OpportunityCategory;
          const Icon = opportunityIcons[category];
          const active = isActivePath(pathname, item.href);
          return (
            <DropdownMenuItem key={item.href} asChild>
              <Link
                href={item.href}
                className={cn(
                  "min-h-11 cursor-pointer rounded-xl px-3 text-sm text-white/72 transition-colors duration-100 focus:bg-white/[0.07] focus:text-white",
                  active && "bg-[#a9ff2f]/10 text-[#dcffa8]",
                )}
              >
                <Icon className="h-4 w-4 text-[#a9ff2f]/80" aria-hidden="true" />
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
  const pathname = usePathname();

  if (isMobile) {
    return (
      <>
        {opportunityNavigation.map((item) => {
          const category = item.href.slice(1) as OpportunityCategory;
          const Icon = opportunityIcons[category];
          const isActive = isActivePath(pathname, item.href);
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-11 items-center gap-2.5 rounded-xl px-3 text-sm font-medium transition-colors duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a9ff2f]",
                isActive ? "bg-[#a9ff2f]/10 text-[#e4ffb5]" : "text-white/68 hover:bg-white/[0.05] hover:text-white",
              )}
            >
              <Icon className="h-4 w-4 text-[#a9ff2f]/75" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      <div className="hidden items-center gap-0.5 xl:flex">
        {opportunityNavigation
          .filter((item) => primaryOpportunityCategories.has(item.href.slice(1) as OpportunityCategory))
          .map((item) => {
            const isActive = isActivePath(pathname, item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  desktopLinkClass,
                  isActive ? "bg-[#a9ff2f]/10 text-[#e4ffb5]" : "text-white/62 hover:bg-white/[0.05] hover:text-white",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        <OpportunityDropdown mode="secondary" />
      </div>
      <div className="xl:hidden">
        <OpportunityDropdown mode="all" />
      </div>
    </div>
  );
}
