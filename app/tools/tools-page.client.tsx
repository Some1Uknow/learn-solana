"use client";

import type { MouseEvent } from "react";
import Link from "next/link";
import { ArrowRight, Blocks, Compass } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { ToolsPageFrame } from "./tools-shell";
import styles from "./tools.module.css";
import { toolsDisplay } from "./tools-theme";

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
];

const tools = [
  {
    id: "runtime-lab",
    name: "Runtime Lab",
    description: "Practice Solana runtime flow step by step.",
    href: "/tools/runtime-lab",
    meta: "Account progress",
    icon: Compass,
  },
  {
    id: "visual-builder",
    name: "Visual Builder",
    description: "Sketch programs, instructions, accounts, and PDAs.",
    href: "/tools/visual-builder",
    meta: "Visual map",
    icon: Blocks,
  },
];

export function ToolsPageClient() {
  const { authenticated, login } = useAuth();

  function handleRuntimeLabClick(event: MouseEvent<HTMLAnchorElement>) {
    if (authenticated) return;
    event.preventDefault();
    void login();
  }

  return (
    <ToolsPageFrame
      breadcrumbItems={breadcrumbItems}
      heroKicker="Tools"
      title="Tools"
      description="Open the tool you need. Runtime Lab requires sign-in because progress is saved to your account."
      compactHero
    >
      <section className={styles.sectionTight}>
        <div className={styles.shell}>
          <div className={styles.minimalToolGrid}>
            {tools.map((tool) => {
              const Icon = tool.icon;

              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  onClick={tool.id === "runtime-lab" ? handleRuntimeLabClick : undefined}
                  className={styles.minimalToolCard}
                >
                  <div className={styles.minimalToolIcon}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className={styles.minimalToolCopy}>
                    <h2 className={`${styles.minimalToolTitle} ${toolsDisplay.className}`}>
                      {tool.name}
                    </h2>
                    <p>{tool.description}</p>
                  </div>
                  <div className={styles.minimalToolMeta}>
                    <span>{tool.meta}</span>
                    <span>{tool.id === "runtime-lab" && !authenticated ? "Sign in" : "Open"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </ToolsPageFrame>
  );
}

export default ToolsPageClient;
