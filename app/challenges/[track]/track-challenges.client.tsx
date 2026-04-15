"use client";

import Link from "next/link";
import { Inter, Space_Grotesk } from "next/font/google";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, ChevronRight } from "lucide-react";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import type { ExerciseEntry } from "@/lib/challenges/exercises";
import { buildChallengeSections } from "@/lib/challenges/track-groups";
import { useAuth } from "@/hooks/use-auth";
import { useExerciseProgress } from "@/hooks/use-exercise-progress";
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

interface Props {
  track: string;
  trackName: string;
  trackDescription: string;
  challenges: ExerciseEntry[];
}

function getSummarySentence(description: string) {
  const trimmed = description.trim();
  const firstStop = trimmed.indexOf(".");

  if (firstStop === -1) {
    return trimmed;
  }

  return trimmed.slice(0, firstStop + 1);
}

function getDifficultyClass(difficulty?: string) {
  switch (difficulty) {
    case "Easy":
      return styles.difficultyEasy;
    case "Medium":
      return styles.difficultyMedium;
    case "Hard":
      return styles.difficultyHard;
    default:
      return "";
  }
}

export default function TrackChallengesClient({
  track,
  trackName,
  trackDescription,
  challenges,
}: Props) {
  const router = useRouter();
  const { ready, authenticated } = useAuth();
  const { progress, completedCount } = useExerciseProgress(track);

  const progressPercentage =
    challenges.length > 0
      ? Math.round((completedCount / challenges.length) * 100)
      : 0;
  const challengeSections = buildChallengeSections(track, challenges);

  return (
    <div className={`${styles.page} ${body.className}`}>
      <Navbar />

      <main>
        <section className={styles.hero}>
          <div className={`${styles.shell} ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <nav className={styles.breadcrumb}>
                <Link href="/">Home</Link>
                <span className={styles.breadcrumbDivider}>/</span>
                <Link href="/challenges">Challenges</Link>
                <span className={styles.breadcrumbDivider}>/</span>
                <span>{trackName}</span>
              </nav>

              <div className={`${styles.heroKicker} ${mono.className}`}>{track.toUpperCase()} Track</div>
              <h1 className={`${styles.heroTitle} ${display.className}`}>{trackName}</h1>
              <p className={styles.heroBody}>{trackDescription}</p>

              <div className={styles.heroActions}>
                <Link href="/challenges" className={styles.secondaryButton}>
                  <ArrowLeft className="h-4 w-4" />
                  Back to tracks
                </Link>
                {challenges[0] ? (
                  <button
                    type="button"
                    className={styles.primaryButton}
                    onClick={() => router.push(`/challenges/${track}/${challenges[0].slug}`)}
                  >
                    Start day {challenges[0].order}
                  </button>
                ) : null}
              </div>
            </div>

            <div className={styles.trackSidebar}>
              <article className={`${styles.panel} ${styles.sidebarCard}`}>
                <div className={`${styles.sidebarLabel} ${mono.className}`}>Track Progress</div>
                <div className={`${styles.progressValue} ${display.className}`}>
                  {completedCount}/{challenges.length}
                </div>
                <div className={styles.progressMeta}>
                  {authenticated
                    ? `${progressPercentage}% complete across this track`
                    : ready
                    ? "Sign in to save progress across devices."
                    : "Checking authentication state..."}
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </article>

              <article className={`${styles.panel} ${styles.sidebarCard}`}>
                <div className={`${styles.sidebarLabel} ${mono.className}`}>At a glance</div>
                <div className={styles.progressMeta}>{challenges.length} exercises in total</div>
                <div className={styles.progressMeta}>Four roadmap phases</div>
                <div className={styles.progressMeta}>Server-side test enforcement</div>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.shell}>
            <div className={styles.trackLayout}>
              <div className={styles.trackSections}>
                {challengeSections.map((section) => (
                  <section key={section.id} className={`${styles.panel} ${styles.trackSection}`}>
                    <div className={styles.trackSectionHeader}>
                      <div className={styles.trackSectionIntro}>
                        <h2 className={display.className}>{section.title}</h2>
                        <p>{section.description}</p>
                      </div>
                      <div className={`${styles.roadmapBadge} ${mono.className}`}>{section.days}</div>
                    </div>

                    <div className={styles.challengeList}>
                      {section.challenges.map((challenge) => {
                        const isCompleted = Boolean(progress[challenge.slug]);

                        return (
                          <button
                            type="button"
                            key={challenge.slug}
                            onClick={() => router.push(`/challenges/${track}/${challenge.slug}`)}
                            className={`${styles.challengeRow} ${
                              isCompleted ? styles.challengeRowCompleted : ""
                            }`}
                          >
                            <div
                              className={`${styles.challengeOrder} ${
                                isCompleted ? styles.challengeOrderCompleted : ""
                              }`}
                            >
                              {isCompleted ? <Check className="h-4 w-4" /> : challenge.order}
                            </div>

                            <div className={styles.challengeMain}>
                              <div className={styles.challengeTopline}>
                                <h3 className={styles.challengeTitle}>{challenge.title}</h3>
                                {challenge.difficulty ? (
                                  <span className={getDifficultyClass(challenge.difficulty)}>
                                    {challenge.difficulty}
                                  </span>
                                ) : null}
                              </div>
                              <p className={styles.challengeDescription}>
                                {getSummarySentence(challenge.description)}
                              </p>
                            </div>

                            <div className={styles.challengeMeta}>
                              {challenge.tags?.slice(0, 2).map((tag) => (
                                <span key={tag} className={styles.tagChip}>
                                  {tag}
                                </span>
                              ))}
                              <ChevronRight className="h-4 w-4 text-white/35" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
