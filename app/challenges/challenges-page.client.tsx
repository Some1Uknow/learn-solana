"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Inter, Space_Grotesk } from "next/font/google";

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
                Challenges
              </h1>
              <p className={styles.heroBody}>
                Minimal, focused practice tracks with saved progress and server validation.
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
            <div className={`${styles.sectionKicker} ${mono.className} mb-4`}>Track</div>
            <div className={styles.trackCatalog}>
              {tracks.map((track) => {
                const visual = getTrackVisual(track.track);

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
