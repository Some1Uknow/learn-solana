import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { brand, brandKeywords } from "@/lib/brand";
import { createCanonical, defaultOpenGraphImage, defaultTwitterImage } from "@/lib/seo";
import styles from "./branding.module.css";

const title = `${brand.name} Brand Kit`;
const description =
  "Logo assets and colors for learn.sol.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    ...brandKeywords,
    "learn.sol logo",
    "learn.sol brand kit",
    "Solana education brand",
  ],
  alternates: {
    canonical: createCanonical("/branding"),
  },
  openGraph: {
    title,
    description,
    url: createCanonical("/branding"),
    type: "website",
    images: [defaultOpenGraphImage],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [defaultTwitterImage],
  },
};

const logoAssets = [
  {
    name: "Primary wordmark",
    src: brand.assets.wordmark,
    surface: "Primary lockup.",
  },
  {
    name: "Standalone mark",
    src: brand.assets.mark,
    surface: "Icon and avatar mark.",
  },
  {
    name: "Text lockup",
    src: brand.assets.text,
    surface: "Text-only lockup.",
  },
];

const colors = [
  ["Lime", brand.colors.lime, "Logo and accent"],
  ["Black", brand.colors.black, "Primary surface"],
  ["Graphite", brand.colors.graphite, "App background"],
  ["White", brand.colors.white, "High-contrast type"],
  ["Zinc", brand.colors.zinc, "Muted copy"],
] as const;

export default function BrandingPage() {
  return (
    <div className={styles.page}>
      <Navbar />
      <main>
        <section className={styles.hero}>
          <div className={styles.shell}>
            <div className={styles.heroCopy}>
              <BrandLogo
                variant="wordmark"
                priority
                className={styles.heroLogo}
              />
              <h1>{brand.name} brand kit</h1>
              <p>Logo assets and colors.</p>
              <div className={styles.heroActions}>
                <Link href={brand.assets.wordmark} className={styles.primaryAction} download>
                  <Download size={18} />
                  Download wordmark
                </Link>
                <Link href={brand.assets.mark} className={styles.secondaryAction} download>
                  <Download size={18} />
                  Download mark
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.shell}>
            <div className={styles.sectionHeader}>
              <span>Logos</span>
              <h2>Logo set</h2>
            </div>
            <div className={styles.logoGrid}>
              {logoAssets.map((asset) => (
                <article key={asset.name} className={styles.logoCard}>
                  <div className={styles.logoPreview}>
                    <Image
                      src={asset.src}
                      alt={asset.name}
                      width={420}
                      height={180}
                      className={asset.name === "Standalone mark" ? styles.markImage : styles.logoImage}
                    />
                  </div>
                  <div className={styles.cardBody}>
                    <h3>{asset.name}</h3>
                    <p>{asset.surface}</p>
                    <Link href={asset.src} className={styles.downloadLink} download>
                      <Download size={16} />
                      Download
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.shell}>
            <div className={styles.sectionHeader}>
              <span>Colors</span>
              <h2>Brand tokens</h2>
            </div>
            <div className={styles.colorGrid}>
              {colors.map(([name, hex, usage]) => (
                <article key={name} className={styles.colorCard}>
                  <div className={styles.swatch} style={{ backgroundColor: hex }} />
                  <div>
                    <h3>{name}</h3>
                    <strong>{hex}</strong>
                    <p>{usage}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
