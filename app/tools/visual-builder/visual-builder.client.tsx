"use client";

import Link from "next/link";
import { VisualBuilderEditor } from "@/components/visual-builder/editor";
import { ToolsPageFrame } from "../tools-shell";
import styles from "../tools.module.css";

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
            <div className={styles.minimalTopActions}>
              <Link href="/tools/visual-builder" className={styles.secondaryButton}>
                Back to Visual Builder
              </Link>
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
      heroKicker="Visual Builder"
      title="Visual Builder"
      description="Map programs, instructions, accounts, and PDAs."
      compactHero
      heroActions={
        <div className={styles.minimalTopActions}>
          <Link href="/tools/visual-builder/fullscreen" className={styles.primaryButton}>
            Open fullscreen
          </Link>
        </div>
      }
    >
      <section className={styles.sectionTight}>
        <div className={styles.shell}>
          <div className={styles.minimalEditorShell}>
            <VisualBuilderEditor fullscreen={false} />
          </div>
        </div>
      </section>
    </ToolsPageFrame>
  );
}

export default VisualBuilderClient;
