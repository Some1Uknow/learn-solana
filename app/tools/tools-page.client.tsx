"use client";

import Link from "next/link";
import { ArrowRight, Blocks, Compass } from "lucide-react";
import { ToolsPageFrame } from "./tools-shell";
import styles from "./tools.module.css";
import { toolsDisplay, toolsMono } from "./tools-theme";

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
];

const tools = [
  {
    id: "runtime-lab",
    name: "Runtime Lab",
    description:
      "Step through real Solana instruction flows, inspect runtime checks, and see why a transaction passes or fails.",
    href: "/tools/runtime-lab",
    eyebrow: "Core Lab",
    note: "Use it when signer checks, PDAs, account ownership, and runtime errors still feel fuzzy.",
    meta: "Runtime checks",
    icon: Compass,
  },
  {
    id: "visual-builder",
    name: "Visual Builder",
    description:
      "Map programs, instructions, accounts, and PDAs visually before you start wiring the code.",
    href: "/tools/visual-builder",
    eyebrow: "Builder",
    note: "Use it when you know the pieces but still need help structuring the program and client flow.",
    meta: "Architecture",
    icon: Blocks,
  },
];

export function ToolsPageClient() {
  return (
    <ToolsPageFrame
      breadcrumbItems={breadcrumbItems}
      heroKicker="Developer Tools"
      title="Tools that make Solana easier to reason about"
      description="Use Runtime Lab to understand what the runtime is actually checking. Use Visual Builder to map the accounts, instructions, and PDAs before you start coding."
      heroActions={
        <>
          <Link href="/tools/runtime-lab" className={styles.primaryButton}>
            Open Runtime Lab
          </Link>
          <Link href="/tools/visual-builder" className={styles.secondaryButton}>
            Open Visual Builder
          </Link>
        </>
      }
      heroAside={
        <article className={styles.heroPanel}>
          <div className={`${styles.heroStatLabel} ${toolsMono.className}`}>Current tools</div>
          <div className={`${styles.heroStatValue} ${toolsDisplay.className}`}>2</div>
          <div className={styles.heroStatNote}>
            Both are focused on the early developer learning curve: runtime behavior and program structure.
          </div>
        </article>
      }
    >
      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIntro}>
              <div className={`${styles.sectionEyebrow} ${toolsMono.className}`}>Start here</div>
              <h2 className={`${styles.sectionTitle} ${toolsDisplay.className}`}>
                Two tools that remove the most confusion
              </h2>
              <p className={styles.sectionBody}>
                If you are new to Solana, the hard part is usually not syntax. It is understanding
                what the runtime is doing and how the moving parts fit together. These tools are
                built for exactly that.
              </p>
            </div>
          </div>

          <div className={styles.catalogGrid}>
            {tools.map((tool) => {
              const Icon = tool.icon;

              return (
                <Link key={tool.id} href={tool.href} className={`${styles.surfaceCard} ${styles.spotlightCard}`}>
                  <div className={styles.cardHeader}>
                    <div>
                      <div className={`${styles.cardEyebrow} ${toolsMono.className}`}>{tool.eyebrow}</div>
                      <h3 className={`${styles.cardTitle} ${toolsDisplay.className}`}>{tool.name}</h3>
                    </div>
                    <div className={styles.providerLogo}>
                      <Icon className="h-7 w-7 text-[#a9ff2f]" />
                    </div>
                  </div>

                  <p className={styles.cardDescription}>{tool.description}</p>

                  <div className={styles.cardMeta}>
                    <span className={styles.accentPill}>{tool.meta}</span>
                    <span className={styles.ghostPill}>Interactive</span>
                  </div>

                  <div className={styles.cardFooter}>
                    <div>
                      <div className={styles.metaLabel}>Best used when</div>
                      <div className={styles.listValue}>{tool.note}</div>
                    </div>
                    <span className={styles.secondaryButton}>
                      Open tool
                      <ArrowRight className="h-4 w-4" />
                    </span>
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
