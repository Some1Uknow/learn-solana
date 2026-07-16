import fs from "node:fs";
import path from "node:path";
import { cache } from "react";

const BUILD_CHALLENGES_ROOT = path.join(process.cwd(), "content", "build-challenges");

export type BuildChallengeDifficulty = "Beginner" | "Intermediate" | "Advanced";

export type BuildChallengeCheck = { key: string; label: string };

export type BuildChallengeStage = {
  slug: string;
  order: number;
  title: string;
  promise: string;
  estimatedMinutes: number;
  goal: string;
  contract: string[];
  task: string;
  buildCommand: string;
  commonMistakes: string[];
  publicChecks: BuildChallengeCheck[];
  delayedHint: string;
};

export type BuildChallengeCourse = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  difficulty: BuildChallengeDifficulty;
  estimatedMinutes: number;
  framework: "Anchor";
  toolchain: { anchor: string; solana: string };
  programId: string;
  starter: { version: string; downloadUrl: string; artifactPath: string };
  prerequisites: Array<{ label: string; href: string }>;
  stages: BuildChallengeStage[];
  filePath: string;
};

type RawCourse = Omit<BuildChallengeCourse, "filePath">;

function isCheck(value: unknown): value is BuildChallengeCheck {
  return Boolean(value) && typeof value === "object" && typeof (value as BuildChallengeCheck).key === "string" && typeof (value as BuildChallengeCheck).label === "string";
}

function isStage(value: unknown): value is BuildChallengeStage {
  if (!value || typeof value !== "object") return false;
  const stage = value as Partial<BuildChallengeStage>;
  return (
    typeof stage.slug === "string" &&
    typeof stage.order === "number" &&
    typeof stage.title === "string" &&
    typeof stage.promise === "string" &&
    typeof stage.estimatedMinutes === "number" &&
    typeof stage.goal === "string" &&
    Array.isArray(stage.contract) &&
    Array.isArray(stage.commonMistakes) &&
    Array.isArray(stage.publicChecks) &&
    stage.publicChecks.every(isCheck) &&
    typeof stage.task === "string" &&
    typeof stage.buildCommand === "string" &&
    typeof stage.delayedHint === "string"
  );
}

function isCourse(value: unknown): value is RawCourse {
  if (!value || typeof value !== "object") return false;
  const course = value as Partial<RawCourse>;
  return (
    typeof course.slug === "string" &&
    typeof course.title === "string" &&
    typeof course.shortTitle === "string" &&
    typeof course.description === "string" &&
    typeof course.estimatedMinutes === "number" &&
    course.framework === "Anchor" &&
    typeof course.programId === "string" &&
    Boolean(course.toolchain?.anchor) &&
    Boolean(course.toolchain?.solana) &&
    Boolean(course.starter?.version) &&
    Boolean(course.starter?.downloadUrl) &&
    Boolean(course.starter?.artifactPath) &&
    Array.isArray(course.prerequisites) &&
    Array.isArray(course.stages) &&
    course.stages.every(isStage)
  );
}

function parseCourseFile(filePath: string): BuildChallengeCourse | null {
  try {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as unknown;
    if (!isCourse(raw)) return null;
    const stages = [...raw.stages].sort((a, b) => a.order - b.order);
    if (stages.some((stage, index) => stage.order !== index + 1)) return null;
    return { ...raw, stages, filePath };
  } catch {
    return null;
  }
}

export const listBuildChallengeCourses = cache(() => {
  if (!fs.existsSync(BUILD_CHALLENGES_ROOT)) return [];
  return fs
    .readdirSync(BUILD_CHALLENGES_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(BUILD_CHALLENGES_ROOT, entry.name, "course.json"))
    .filter((filePath) => fs.existsSync(filePath))
    .map(parseCourseFile)
    .filter((course): course is BuildChallengeCourse => Boolean(course))
    .sort((a, b) => a.title.localeCompare(b.title));
});

export function getBuildChallengeCourse(challengeSlug: string) {
  return listBuildChallengeCourses().find((course) => course.slug === challengeSlug) ?? null;
}

export function getBuildChallengeStage(challengeSlug: string, stageSlug: string) {
  return getBuildChallengeCourse(challengeSlug)?.stages.find((stage) => stage.slug === stageSlug) ?? null;
}

export function getNextBuildChallengeStage(challengeSlug: string, stageSlug: string) {
  const course = getBuildChallengeCourse(challengeSlug);
  if (!course) return null;
  const index = course.stages.findIndex((stage) => stage.slug === stageSlug);
  return index >= 0 ? course.stages[index + 1] ?? null : null;
}

export function toPublicBuildChallengeCourse(course: BuildChallengeCourse) {
  return {
    slug: course.slug,
    title: course.title,
    shortTitle: course.shortTitle,
    description: course.description,
    difficulty: course.difficulty,
    estimatedMinutes: course.estimatedMinutes,
    framework: course.framework,
    toolchain: course.toolchain,
    programId: course.programId,
    starter: course.starter,
    prerequisites: course.prerequisites,
    stages: course.stages.map(({ delayedHint: _delayedHint, ...stage }) => stage),
  };
}
