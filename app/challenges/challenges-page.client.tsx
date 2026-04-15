"use client";

import Image from "next/image";
import Link from "next/link";
import { Inter, Space_Grotesk } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BreadcrumbSchema } from "@/components/seo";
import styles from "@/components/challenges/challenges-v2.module.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const mono = Inter({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const breadcrumbItems = [
  { name: "Home", url: "/" },
  { name: "Challenges", url: "/challenges" },
];

type ChallengeTrackSummary = {
  track: string;
  name: string;
  description: string;
  exerciseCount: number;
};

type TrackDisplayStats = {
  developers: string;
  completions: string;
};

function getTrackVisual(track: string) {
  switch (track) {
    case "rust":
      return {
        imageSrc: "/rust-2.png",
        imageAlt: "Rust logo",
        eyebrow: "Language track",
      };
    case "anchor":
      return {
        imageSrc: "/anchor.png",
        imageAlt: "Anchor logo",
        eyebrow: "Framework track",
      };
    case "solana-kit":
      return {
        imageSrc: "/solana-kit.svg",
        imageAlt: "Solana Kit logo",
        eyebrow: "Client track",
      };
    case "solana":
      return {
        imageSrc: "/solanaLogo.png",
        imageAlt: "Solana logo",
        eyebrow: "Runtime track",
      };
    default:
      return {
        imageSrc: null,
        imageAlt: `${track} track`,
        eyebrow: "Track",
      };
  }
}

export function ChallengesPageClient({ tracks }: { tracks: ChallengeTrackSummary[] }) {
  const router = useRouter();

  const getTrackStats = (track: ChallengeTrackSummary): TrackDisplayStats => {
    if (track.track === "rust") {
      return {
        developers: "50+",
        completions: "200+",
      };
    }

    return {
      developers: "0+",
      completions: "0+",
    };
  };

  return (
    <div className={`${styles.page} ${body.className}`}>
      <BreadcrumbSchema items={breadcrumbItems} />
      <Navbar />

      <main>
        <section className={styles.hero}>
          <div className={styles.shell}>
            <div className={styles.heroCopy}>
              <nav className={styles.breadcrumb}>
                <Link href="/">Home</Link>
                <span className={styles.breadcrumbDivider}>/</span>
                <span>Challenges</span>
              </nav>

              <div className={`${styles.heroKicker} ${mono.className}`}>Exercises</div>
              <h1 className={`${styles.heroTitle} ${display.className}`}>
                Practice tracks that can grow beyond Rust without rewiring the product
              </h1>
              <p className={styles.heroBody}>
                Challenges are discovered from content, routed by track and slug, validated
                on the server, and saved against the user. Add a new category and the
                landing page should just pick it up.
              </p>

              <div className={styles.heroActions}>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={() => router.push("/challenges/rust")}
                >
                  Start Rust track
                </button>
                <Link href="/modules" className={styles.secondaryButton}>
                  Explore modules
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.shell}>
            <div className={styles.sectionHeader}>
              <div className={`${styles.sectionKicker} ${mono.className}`}>Track Inventory</div>
              <h2 className={`${styles.sectionTitle} ${display.className}`}>
                Challenge tracks should scale with the content system
              </h2>
              <p className={styles.sectionBody}>
                This page is now driven by the tracks discovered under `content/challenges`.
                If you add a new category with valid exercises, it should appear here without
                another route-level redesign.
              </p>
            </div>

            <div
              className={`${styles.trackCatalog} ${
                tracks.length === 1 ? styles.trackCatalogSingle : ""
              }`}
            >
              {tracks.map((track) => {
                const visual = getTrackVisual(track.track);
                const stats = getTrackStats(track);
                return (
                  <article key={track.track} className={styles.trackSpotlight}>
                    <div className={styles.trackSpotlightVisual}>
                      {visual.imageSrc ? (
                        <Image
                          src={visual.imageSrc}
                          alt={visual.imageAlt}
                          fill
                          sizes="(max-width: 820px) 280px, 320px"
                          className={styles.trackImage}
                          priority={track.track === "rust"}
                        />
                      ) : (
                        <div className={`${styles.trackFallbackMark} ${display.className}`}>
                          {track.name.slice(0, 2)}
                        </div>
                      )}
                    </div>

                    <div className={styles.trackSpotlightBody}>
                      <div className={styles.trackMetaRow}>
                        <span className={`${styles.pill} ${styles.pillActive}`}>{visual.eyebrow}</span>
                        <span className={`${styles.pill} ${styles.pillGhost}`}>
                          {track.exerciseCount} exercises
                        </span>
                      </div>

                      <h3 className={`${styles.trackSpotlightTitle} ${display.className}`}>
                        {track.name}
                      </h3>
                      <p className={styles.trackSpotlightDescription}>{track.description}</p>

                      <div className={styles.trackStatsInline}>
                        <div className={styles.trackStatItem}>
                          <div className={`${styles.trackStatValue} ${display.className}`}>
                            {stats.developers}
                          </div>
                          <div className={styles.trackStatLabel}>Developers</div>
                          <div className={styles.trackStatNote}>
                            Builders using this track to sharpen production instincts.
                          </div>
                        </div>
                        <div className={styles.trackStatItem}>
                          <div className={`${styles.trackStatValue} ${display.className}`}>
                            {stats.completions}
                          </div>
                          <div className={styles.trackStatLabel}>Exercises completed</div>
                          <div className={styles.trackStatNote}>
                            Proof-driven progress from exercises that only pass when all tests pass.
                          </div>
                        </div>
                        <div className={styles.trackStatItem}>
                          <div className={`${styles.trackStatValue} ${display.className}`}>
                            {track.exerciseCount}
                          </div>
                          <div className={styles.trackStatLabel}>Published exercises</div>
                          <div className={styles.trackStatNote}>
                            Current inventory for this track, discovered directly from content.
                          </div>
                        </div>
                      </div>

                      <div className={styles.heroActions}>
                        <button
                          type="button"
                          className={styles.primaryButton}
                          onClick={() => router.push(`/challenges/${track.track}`)}
                        >
                          Open track
                        </button>
                        <Link href="/modules" className={styles.secondaryButton}>
                          Read modules
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default ChallengesPageClient;
