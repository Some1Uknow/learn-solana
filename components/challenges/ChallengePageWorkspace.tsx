import Link from "next/link";
import { Inter, Space_Grotesk } from "next/font/google";
import { ArrowLeft } from "lucide-react";

import { challengesSource } from "@/lib/challenges/source";
import { getMDXComponents } from "@/mdx-components";
import ChallengeEditorClient from "./ChallengeEditorClient";
import ChallengeWorkspaceClient from "./ChallengeWorkspaceClient";
import type { ExerciseExecutor } from "@/lib/challenges/exercises";
import styles from "./challenges-v2.module.css";

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

export type ChallengeSpec = {
  title: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  tags?: string[];
  description: string;
  starterCode?: string;
  mdxSlug?: string[];
  currentIndex?: number;
  totalCount?: number;
  track?: string;
  exerciseSlug?: string;
  previousHref?: string;
  nextHref?: string;
  executor?: ExerciseExecutor;
};

type Props = ChallengeSpec & {
  backHref?: string;
};

const getDifficultyStyle = (difficulty: string) => {
  switch (difficulty) {
    case "Easy":
      return `${styles.difficultyBadge} ${styles.badgeEasy}`;
    case "Medium":
      return `${styles.difficultyBadge} ${styles.badgeMedium}`;
    case "Hard":
      return `${styles.difficultyBadge} ${styles.badgeHard}`;
    default:
      return `${styles.difficultyBadge} ${styles.badgeEasy}`;
  }
};

export default function ChallengePageWorkspace({
  title,
  difficulty = "Easy",
  tags = [],
  description,
  starterCode = '// Write your Rust solution here\nfn main() {\n    println!("Hello, Rustacean!");\n}\n',
  backHref = "/challenges",
  mdxSlug,
  currentIndex,
  totalCount,
  track,
  exerciseSlug,
  previousHref,
  nextHref,
  executor,
}: Props) {
  let MDX: React.ComponentType<any> | null = null;
  if (mdxSlug) {
    const page = challengesSource.getPage(mdxSlug);
    MDX = page?.data.body ?? null;
  }

  const canExecute = Boolean(executor);

  return (
    <div className={`${styles.workspaceRoot} ${body.className}`}>
      <div className={styles.workspaceShell}>
        <div className={styles.workspaceTopbar}>
          <div className={styles.workspaceTopbarLeft}>
            <Link href={backHref} className={styles.workspaceBack}>
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Link>

            <div className={styles.workspaceDivider} />

            <div className={styles.workspaceTitleBlock}>
              <div className={`${styles.workspaceTitle} ${display.className}`}>{title}</div>
              <div className={styles.workspaceMeta}>
                <span className={getDifficultyStyle(difficulty)}>{difficulty}</span>
                {tags.slice(0, 2).map((tag) => (
                  <span key={tag} className={styles.tagChip}>
                    {tag}
                  </span>
                ))}
                {currentIndex && totalCount ? (
                  <span className={`${styles.workspaceCounter} ${mono.className}`}>
                    {currentIndex} / {totalCount}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <ChallengeWorkspaceClient
          problemPanel={
            <div className={styles.workspaceScroll}>
              {!MDX ? (
                <div className={styles.workspaceIntro}>
                  <h1 className={`${styles.workspaceIntroTitle} ${display.className}`}>{title}</h1>
                  <p className={styles.workspaceIntroBody}>{description}</p>
                  {tags.length > 0 ? (
                    <div className={styles.workspaceTagRow}>
                      {tags.map((tag) => (
                        <span key={tag} className={styles.workspaceTag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className={`${styles.mdxSurface} ${MDX ? styles.mdxSurfaceTight : ""}`}>
                {MDX ? (
                  <div className="prose prose-invert prose-neutral max-w-none prose-headings:font-medium prose-headings:tracking-tight prose-p:text-neutral-300 prose-li:text-neutral-300 prose-strong:text-white prose-code:text-[#a9ff2f] prose-pre:border prose-pre:border-white/10 prose-pre:bg-black/35">
                    <MDX components={getMDXComponents()} />
                  </div>
                ) : (
                  <div className="prose prose-invert prose-neutral max-w-none">
                    <p>{description}</p>
                  </div>
                )}
              </div>
            </div>
          }
          editorPanel={
            <ChallengeEditorClient
              starterCode={starterCode}
              track={track}
              currentIndex={currentIndex}
              totalCount={totalCount}
              exerciseSlug={exerciseSlug}
              previousHref={previousHref}
              nextHref={nextHref}
              canExecute={canExecute}
            />
          }
        />
      </div>
    </div>
  );
}
