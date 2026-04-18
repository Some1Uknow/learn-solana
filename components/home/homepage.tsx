import Image from "next/image";
import Link from "next/link";
import { Inter, Space_Grotesk } from "next/font/google";
import {
  ChevronRight,
  Layers3,
  MessageSquareMore,
  Pickaxe,
  Workflow,
} from "lucide-react";

import { Globe } from "@/components/ui/globe";
import { BentoGrid } from "@/components/ui/bento-grid";
import { BrandLogo } from "@/components/brand/brand-logo";
import { brand } from "@/lib/brand";
import styles from "./homepage.module.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const display = spaceGrotesk;
const body = inter;
const mono = inter;

const stackCards = [
  {
    name: "Solana",
    description:
      "Core runtime thinking, account models, transaction flow, priority fees, and protocol behavior that matter once you leave toy demos.",
    imageSrc: "/solanaLogo.png",
    imageAlt: "Solana logo",
    className: styles.stackPortraitSolana,
  },
  {
    name: "Rust",
    description:
      "Ownership, borrowing, traits, pattern matching, and real problem-solving loops designed for Solana developers instead of generic language tourists.",
    imageSrc: "/rust-2.png",
    imageAlt: "Rust logo",
    className: styles.stackPortraitRust,
  },
  {
    name: "Anchor",
    description:
      "Macros, account validation, instruction design, constraints, and the production habits that stop Anchor from becoming magic glue.",
    imageSrc: "/anchor.png",
    imageAlt: "Anchor logo",
    className: styles.stackPortraitAnchor,
  },
  {
    name: "Solana Kit",
    description:
      "Modern client flows, transaction assembly, wallet-standard-first interfaces, and the newer tooling direction instead of legacy web3 habits.",
    imageSrc: "/solana-kit.svg",
    imageAlt: "Solana Kit logo",
    className: styles.stackPortraitKit,
  },
];

const developerStats = [
  {
    value: "1,200",
    label: "Developers",
    note: "Builders who have used the learning loop",
  },
  {
    value: "8,342",
    label: "Learning Minutes",
    note: "Time spent learning and shipping",
  },
  {
    value: "4+",
    label: "modules published end to end",
    note: "Core stack coverage across the product",
  },
  {
    value: "50",
    label: "Challengers",
    note: "Builders solving exercises and asking questions",
  },
];

const ctaFeatures = [
  {
    title: "Structured modules",
    body: "Public lessons that explain first principles instead of hiding behind shorthand.",
    Icon: Workflow,
  },
  {
    title: "Executable exercises",
    body: "Saved progress and server-validated test cases so the product teaches through proof.",
    Icon: Pickaxe,
  },
  {
    title: "Entire stack coverage",
    body: "Rust, Anchor, Solana runtime, and modern client tooling in one coherent learning loop.",
    Icon: Layers3,
  },
  {
    title: "Developer trust",
    body: "Built from real questions, real feedback, and surfaces developers actually return to.",
    Icon: MessageSquareMore,
  },
];

const footerColumns = {
  Platform: [
    { label: "Learn", href: "/modules" },
    { label: "Challenges", href: "/challenges" },
    { label: "Build with Me", href: "/tools/visual-builder" },
    { label: "Brand Kit", href: "/branding" },
  ],
  Explore: [
    { label: "Tutorials", href: "/learn" },
    { label: "Curriculum", href: "/modules" },
    { label: "Runtime Lab", href: "/tools/runtime-lab" },
    { label: "Visual Builder", href: "/tools/visual-builder" },
  ],
  Build: [
    { label: "Partner", href: "/partner" },
    { label: "Runtime Lab", href: "/tools/runtime-lab" },
    { label: "Visual Builder", href: "/tools/visual-builder" },
    { label: "Challenges", href: "/challenges" },
  ],
};

const heroGlobeConfig = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.28,
  dark: 0,
  diffuse: 1.2,
  mapSamples: 16000,
  mapBrightness: 6,
  mapBaseBrightness: 0.08,
  baseColor: [1, 1, 1] as [number, number, number],
  markerColor: [110 / 255, 1, 42 / 255] as [number, number, number],
  glowColor: [1, 1, 1] as [number, number, number],
  markers: [
    { location: [37.7749, -122.4194], size: 0.009 },
    { location: [40.7128, -74.006], size: 0.009 },
    { location: [51.5072, -0.1276], size: 0.008 },
    { location: [19.076, 72.8777], size: 0.009 },
    { location: [1.3521, 103.8198], size: 0.008 },
    { location: [35.6762, 139.6503], size: 0.008 },
  ],
};

export function HomePage() {
  return (
    <main className={`${styles.page} ${body.className}`}>
      <section className={styles.hero}>
        <div className={`${styles.shell} ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <h1 className={`${styles.heroTitle} ${display.className}`}>
              {brand.tagline}
            </h1>
            <p className={styles.heroBody}>
              Learn the stack, build faster, and keep your builder progress in
              one durable product loop.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="/modules">
                Get Started
              </Link>
              <Link className={styles.secondaryButton} href="/challenges">
                Solve challenges
              </Link>
            </div>
          </div>

          <div className={styles.heroVisual}>
            <div className={styles.heroGlow} />
            <div className={styles.globeFrame}>
              <Globe className={styles.globeCanvas} config={heroGlobeConfig} />
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionScreen}`} id="entire-stack">
        <div className={`${styles.shell} ${styles.sectionCenter}`}>
          <div className={styles.sectionHeader}>
            <div className={`${styles.sectionKicker} ${mono.className}`}>Entire Stack</div>
            <h2 className={`${styles.sectionTitle} ${display.className}`}>
              learn.sol covers the entire stack
            </h2>
            <p className={styles.sectionBody}>
              The product should not feel like isolated pockets of knowledge. It should
              cover the runtime, the language, the framework, and the client layer as one
              coherent system.
            </p>
          </div>

          <BentoGrid className={styles.stackGridLayout}>
            {stackCards.map((card) => (
              <article key={card.name} className={`${styles.stackPortraitCard} ${card.className}`}>
                <div className={styles.stackPortraitSurface}>
                  <div className={styles.stackPortraitGlow} />
                  <div className={styles.stackPortraitPattern} />
                  <div className={styles.stackPortraitVisual}>
                    <Image
                      src={card.imageSrc}
                      alt={card.imageAlt}
                      fill
                      sizes="(max-width: 820px) 160px, 220px"
                      className={styles.stackPortraitImage}
                    />
                  </div>
                  <div className={styles.stackPortraitBody}>
                    <h3 className={`${styles.stackPortraitTitle} ${display.className}`}>{card.name}</h3>
                    <p className={styles.stackPortraitDescription}>{card.description}</p>
                  </div>
                </div>
              </article>
            ))}
          </BentoGrid>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionScreen} ${styles.listenSection}`} id="developer-listening">
        <div className={`${styles.shell} ${styles.sectionCenter}`}>
          <div className={styles.sectionHeader}>
            <div className={`${styles.sectionKicker} ${mono.className}`}>Developer Listening</div>
            <h2 className={`${styles.sectionTitle} ${display.className}`}>
              Built from developer feedback
            </h2>
            <p className={styles.sectionBody}>
              The strongest product decisions here came from removing friction, reducing
              tech debt, and making the learning experience match what real builders
              actually need.
            </p>
          </div>

          <div className={styles.statsBentoGrid}>
            {developerStats.map((stat) => (
              <article key={stat.label} className={styles.statBentoCard}>
                <div className={`${styles.statBentoValue} ${display.className}`}>{stat.value}</div>
                <h3 className={styles.statBentoLabel}>{stat.label}</h3>
                <p className={styles.statBentoNote}>{stat.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.sectionScreen}`}>
        <div className={`${styles.shell} ${styles.sectionCenter}`}>
          <div className={styles.ctaPanel}>
            <div className={styles.ctaCopy}>
              <div className={`${styles.sectionKicker} ${mono.className}`}>Build Better</div>
              <h2 className={`${styles.ctaTitle} ${display.className}`}>
                Build on Solana with one product that actually holds together
              </h2>
              <p className={styles.ctaBody}>
                Public lessons, executable exercises, entire-stack coverage, and a product
                shaped by real developer questions. The point is not more surfaces. The point
                is a tighter loop that compounds.
              </p>

              <div className={styles.ctaActions}>
                <Link className={styles.primaryButton} href="/modules">
                  Explore modules
                </Link>
                <Link className={styles.secondaryButton} href="/challenges">
                  Try exercises
                </Link>
              </div>
            </div>

            <div className={styles.ctaFeatureGrid}>
              {ctaFeatures.map((feature) => (
                <article key={feature.title} className={styles.ctaFeatureCard}>
                  <feature.Icon className={styles.ctaFeatureIcon} />
                  <div>
                    <h3 className={styles.ctaFeatureTitle}>{feature.title}</h3>
                    <p className={styles.ctaFeatureBody}>{feature.body}</p>
                  </div>
                  <ChevronRight className={styles.ctaFeatureArrow} />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <div className={styles.footerGrid}>
            <div>
              <div className={`${styles.brand} ${mono.className}`}>
                <BrandLogo variant="wordmark" className={styles.footerBrandLogo} />
              </div>
              <p className={styles.footerLead}>
                A sharper, more durable way to learn Solana through lessons, exercises, and
                guided building.
              </p>
            </div>

            {Object.entries(footerColumns).map(([heading, links]) => (
              <div key={heading}>
                <div className={`${styles.footerHeading} ${mono.className}`}>{heading}</div>
                <div className={styles.footerLinks}>
                  {links.map((link) => (
                    <Link key={link.href} href={link.href}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <div>
              <div className={`${styles.footerHeading} ${mono.className}`}>Contact</div>
              <div className={styles.footerLinks}>
                <a href={`mailto:${brand.email}`} title={`Email ${brand.name}`}>
                  Email
                </a>
                <a href={brand.xUrl} title={`${brand.name} on X`}>
                  X
                </a>
                <a href={brand.githubUrl} title={`${brand.name} on GitHub`}>
                  GitHub
                </a>
              </div>
            </div>
          </div>

          <div className={styles.footerBottom}>
            <span>© 2026 {brand.name}. Built for Solana developers.</span>
            <span className={styles.footerSupport}>
              <span className={mono.className}>Supported by</span>
              <Image
                src="/solanaFndn.png"
                alt="Solana Foundation"
                width={110}
                height={26}
                className={styles.footerSupportLogo}
              />
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}
