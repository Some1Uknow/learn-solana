"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { BreadcrumbSchema } from "@/components/seo";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import styles from "./tools.module.css";
import { toolsBody, toolsDisplay, toolsMono } from "./tools-theme";

export type ToolsBreadcrumbItem = {
  name: string;
  url: string;
};

type ToolsPageFrameProps = {
  breadcrumbItems: ToolsBreadcrumbItem[];
  heroKicker: string;
  title: string;
  description: string;
  heroActions?: ReactNode;
  heroAside?: ReactNode;
  children: ReactNode;
  footer?: boolean;
  fullscreen?: boolean;
};

export function ToolsPageFrame({
  breadcrumbItems,
  heroKicker,
  title,
  description,
  heroActions,
  heroAside,
  children,
  footer = true,
  fullscreen = false,
}: ToolsPageFrameProps) {
  const crumbs = breadcrumbItems.slice(1);

  return (
    <div className={`${styles.page} ${toolsBody.className}`}>
      {!fullscreen && <BreadcrumbSchema items={breadcrumbItems} />}
      {!fullscreen && <Navbar />}

      <main>
        <section className={`${styles.hero} ${fullscreen ? styles.heroCompact : ""}`}>
          <div className={styles.shell}>
            <div className={`${styles.heroGrid} ${heroAside ? "" : styles.heroGridSingle}`}>
              <div className={styles.heroCopy}>
                <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                  {crumbs.map((item, index) => {
                    const isLast = index === crumbs.length - 1;
                    return (
                      <span key={item.url} className={styles.breadcrumbItem}>
                        {isLast ? (
                          <span>{item.name}</span>
                        ) : (
                          <>
                            <Link href={item.url}>{item.name}</Link>
                            <span className={styles.breadcrumbDivider}>/</span>
                          </>
                        )}
                      </span>
                    );
                  })}
                </nav>

                <div className={`${styles.heroKicker} ${toolsMono.className}`}>{heroKicker}</div>
                <h1 className={`${styles.heroTitle} ${toolsDisplay.className}`}>{title}</h1>
                <p className={styles.heroBody}>{description}</p>
                {heroActions ? <div className={styles.heroActions}>{heroActions}</div> : null}
              </div>

              {heroAside ? <div className={styles.heroAside}>{heroAside}</div> : null}
            </div>
          </div>
        </section>

        {children}
      </main>

      {!fullscreen && <Footer />}
    </div>
  );
}
