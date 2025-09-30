"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

// Navigation data
const navigationItems = [
  { label: "Learn", href: "/modules" },
  { label: "Games", href: "/games" },
  { label: "Projects", href: "/projects" },
  { label: "Challenges", href: "/challenges" },
];

interface NavbarLinksProps {
  isMobile?: boolean;
}

export function NavbarLinks({ isMobile = false }: NavbarLinksProps) {
  const renderNavButton = (
    item: (typeof navigationItems)[0],
    isMobileView = false
  ) => {
    if (item.href.startsWith("#")) {
      return (
        <Button
          key={item.label}
          variant="ghost"
          onClick={() =>
            document
              .querySelector(item.href)
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className={`text-white/80 hover:text-white hover:bg-transparent transition-all duration-300 relative group h-10 px-4 ${
            isMobileView ? "w-full justify-start" : ""
          }`}
        >
          <span className="relative z-10">{item.label}</span>
          {!isMobileView && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-[#14F195] to-[#9945FF] group-hover:w-full transition-all duration-300" />
          )}
        </Button>
      );
    }

    return (
      <Link
        key={item.label}
        href={item.href}
        className={isMobileView ? "w-full" : ""}
      >
        <Button
          variant="ghost"
          className={`text-white/80 hover:text-white hover:bg-transparent transition-all duration-300 relative group h-10 px-4 ${
            isMobileView ? "w-full justify-start" : ""
          }`}
        >
          <span className="relative z-10">{item.label}</span>
          {!isMobileView && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-linear-to-r from-[#14F195] to-[#9945FF] group-hover:w-full transition-all duration-300" />
          )}
        </Button>
      </Link>
    );
  };

  if (isMobile) {
    return (
      <>
        {navigationItems.map((item) => (
          <div key={item.label} className="relative group">
            {renderNavButton(item, true)}
          </div>
        ))}
      </>
    );
  }

  return (
    <div className="hidden md:flex flex-1 justify-center">
      <div className="flex items-center gap-2">
        {navigationItems.map((item) => (
          <div key={item.label} className="relative group">
            {renderNavButton(item)}
          </div>
        ))}
      </div>
    </div>
  );
}
