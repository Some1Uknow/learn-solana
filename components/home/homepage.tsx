import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { ArrowRight, BookOpen, Braces, Hammer, TerminalSquare } from "lucide-react";

import { BrandLogo } from "@/components/brand/brand-logo";
import { CopySkillCommandButton } from "@/components/home/copy-skill-command-button";
import { SolanaMark } from "@/components/home/solana-mark";
import { brand } from "@/lib/brand";
import styles from "./homepage.module.css";

const modules = [
  { name: "Rust", description: "Ownership, borrowing, traits and pattern matching for Solana programs.", meta: "Start with Rust", href: "/modules/rust-foundations", image: "/rust-2.webp", imageAlt: "Rust" },
  { name: "Anchor", description: "Accounts, instructions, constraints and testing with Anchor.", meta: "Build programs", href: "/modules/anchor-programs", image: "/anchor.webp", imageAlt: "Anchor" },
  { name: "Solana runtime", description: "Transactions, accounts, programs, fees and runtime behavior.", meta: "Understand the runtime", href: "/modules/solana-foundations", image: "/solanaLogo4k.webp", imageAlt: "Solana" },
  { name: "Modern clients", description: "Build transactions and wallet flows with current Solana clients.", meta: "Connect an app", href: "/modules/solana-kit-clients", image: "/solana-kit.svg", imageAlt: "Solana Kit" },
];

const productLinks = [
  { title: "Runtime Lab", description: "Step through transactions and see how accounts change.", href: "/tools/runtime-lab", Icon: TerminalSquare },
  { title: "Visual Builder", description: "Plan a Solana program from instructions, accounts and constraints.", href: "/tools/visual-builder", Icon: Braces },
];

const skillInstallCommand = "npx skills add Some1Uknow/learn-solana --skill learn-solana";

function SectionLabel({ current, total, children }: { current: string; total: string; children: React.ReactNode }) {
  return <p className={styles.sectionLabel}><span>[ <b>{current}</b> / {total} ]</span> · {children}</p>;
}

export function HomePage() {
  return (
    <main id="main-content" tabIndex={-1} className={styles.page}>
      <div className={styles.background} aria-hidden="true">
        <div className={styles.dots} />
        <div className={styles.edgeBlur} />
      </div>

      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <h1>Learn to build on Solana.</h1>
            <p>Learn Rust, Anchor, the Solana runtime and modern clients. Practice with coding challenges and build real programs.</p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="/modules">Start learning</Link>
              <Link className={styles.secondaryButton} href="/challenges">View challenges</Link>
            </div>
          </div>
          <div className={styles.solanaStage}>
            <SolanaMark />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <SectionLabel current="01" total="05">Start Learning</SectionLabel>
            <div className={styles.headingRow}>
              <h2>Learning Modules</h2>
              <Link href="/modules">View all modules <ArrowRight aria-hidden="true" /></Link>
            </div>
          </div>
          <div className={styles.moduleGrid}>
            {modules.map((module) => (
              <article className={styles.moduleCard} key={module.name}>
                <div className={styles.moduleLogo}>
                  <Image src={module.image} alt={`${module.imageAlt} logo`} width={56} height={56} />
                </div>
                <div>
                  <h3>{module.name}</h3>
                  <p>{module.description}</p>
                </div>
                <div className={styles.moduleMeta}><BookOpen aria-hidden="true" /> {module.meta}</div>
                <Link className={styles.cardButton} href={module.href}>Open module</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <SectionLabel current="02" total="05">Practice</SectionLabel>
            <h2>30 Rust coding challenges</h2>
          </div>
          <div className={styles.splitCard}>
            <div>
              <p className={styles.eyebrow}>Rust challenges</p>
              <h3>Write code and run the tests</h3>
              <p>Work through ownership, borrowing, collections and traits. Your progress is saved when you sign in.</p>
            </div>
            <div className={styles.splitAction}>
              <span><Hammer aria-hidden="true" /> 30 challenges</span>
              <Link className={styles.primaryButton} href="/challenges">Start a challenge</Link>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <SectionLabel current="03" total="05">Build</SectionLabel>
            <h2>Tools for understanding programs</h2>
          </div>
          <div className={styles.toolGrid}>
            {productLinks.map(({ title, description, href, Icon }) => (
              <Link className={styles.toolCard} href={href} key={title}>
                <Icon aria-hidden="true" />
                <div><h3>{title}</h3><p>{description}</p></div>
                <ArrowRight aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section} id="ai-agent-skill">
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <SectionLabel current="04" total="05">Use With Your Agent</SectionLabel>
            <h2>Install the LearnSol skill</h2>
            <p>Ask your coding agent for Solana explanations and exercises from this curriculum.</p>
          </div>
          <div className={styles.commandRow}>
            <code>{skillInstallCommand}</code>
            <CopySkillCommandButton command={skillInstallCommand} />
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.shell}>
          <div className={styles.sectionHeading}>
            <SectionLabel current="05" total="05">Keep Building</SectionLabel>
            <h2>Open lessons. Practical exercises.</h2>
          </div>
          <div className={styles.proofRow}>
            <p>Read the curriculum without signing in. Sign in when you want to save module and challenge progress.</p>
            <div className={styles.supportedBy}>
              <span>Supported by</span>
              <Image src="/solanaFoundationLogo.svg" alt="Solana Foundation" width={170} height={28} />
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.shell}>
          <div className={styles.footerTop}>
            <BrandLogo variant="wordmark" className={styles.footerLogo} />
            <nav aria-label="Footer">
              <Link href="/modules">Modules</Link><Link href="/challenges">Challenges</Link><Link href="/tools">Tools</Link><Link href="/partner">Partner</Link>
            </nav>
          </div>
          <div className={styles.footerBottom}>
            <span>© {new Date().getFullYear()} {brand.name}</span>
            <div><a href={brand.xUrl}>X</a><a href={brand.githubUrl}>GitHub</a><a href={`mailto:${brand.email}`}>Email</a></div>
          </div>
        </div>
      </footer>
    </main>
  );
}
