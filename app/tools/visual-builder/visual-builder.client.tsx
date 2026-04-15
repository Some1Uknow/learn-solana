"use client";

import Link from "next/link";
import { VisualBuilderEditor } from "@/components/visual-builder/editor";
import { ToolsPageFrame } from "../tools-shell";
import styles from "../tools.module.css";
import { toolsDisplay, toolsMono } from "../tools-theme";

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Tools", url: "/tools" },
  { name: "Visual Builder", url: "/tools/visual-builder" },
];

interface VisualBuilderClientProps {
  fullscreen?: boolean;
}

export function VisualBuilderClient({ fullscreen = false }: VisualBuilderClientProps) {
  if (fullscreen) {
    return (
      <div className={styles.page}>
        <div className={styles.heroCompact}>
          <div className={styles.shell}>
            <div className={styles.heroActions}>
              <Link href="/tools/visual-builder" className={styles.secondaryButton}>
                Back to Visual Builder
              </Link>
              <span className={styles.accentPill}>Fullscreen</span>
            </div>
          </div>
        </div>
        <div className={styles.shell}>
          <VisualBuilderEditor fullscreen />
        </div>
      </div>
    );
  }

  return (
    <ToolsPageFrame
      breadcrumbItems={breadcrumbItems}
      heroKicker="Composition"
      title="Visual Builder"
      description="Drag together programs, accounts, instructions, and PDAs, then translate that visual structure into a cleaner starting point for real Solana code."
      heroActions={
        <>
          <Link href="/tools/visual-builder/fullscreen" className={styles.primaryButton}>
            Open fullscreen
          </Link>
          <Link href="/modules/anchor-programs" className={styles.secondaryButton}>
            Read Anchor modules
          </Link>
        </>
      }
      heroAside={
        <div className={styles.heroPanel}>
          <div className={`${styles.heroStatLabel} ${toolsMono.className}`}>Builder mode</div>
          <div className={`${styles.heroStatValue} ${toolsDisplay.className}`}>Visual</div>
          <div className={styles.heroStatNote}>
            Best for mapping the architecture first and writing the implementation second.
          </div>
        </div>
      }
    >
      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.featureGrid}>
            {[
              {
                title: "Build with blocks",
                description: "Compose programs, instructions, signers, and accounts into one visible flow.",
              },
              {
                title: "Learn while editing",
                description: "Use the inspector to understand what each block represents in plain language.",
              },
              {
                title: "Export with context",
                description: "Turn the diagram into a structured starter rather than guessing the first file layout.",
              },
            ].map((card) => (
              <article key={card.title} className={styles.surfaceCard}>
                <div className={`${styles.cardEyebrow} ${toolsMono.className}`}>Builder note</div>
                <h2 className={`${styles.cardTitle} ${toolsDisplay.className}`}>{card.title}</h2>
                <p className={styles.cardDescription}>{card.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.panel}>
            <VisualBuilderEditor fullscreen={false} />
          </div>
        </div>
      </section>
    </ToolsPageFrame>
  );
}

export default VisualBuilderClient;
