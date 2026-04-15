import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";

const CHALLENGES_ROOT = path.join(process.cwd(), "content", "challenges");

export type ExerciseDifficulty = "Easy" | "Medium" | "Hard";

export type RustPlaygroundTestCase = {
  name: string;
  expectedStdout: string;
  harnessBefore?: string;
  harnessAfter?: string;
};

export type RustPlaygroundExecutor = {
  type: "rust-playground";
  description?: string;
  channel?: "stable" | "beta" | "nightly";
  edition?: "2021" | "2024";
  mode?: "debug" | "release";
  tests: RustPlaygroundTestCase[];
};

export type ExerciseExecutor = RustPlaygroundExecutor;

export type ExerciseEntry = {
  track: string;
  slug: string;
  order: number;
  title: string;
  description: string;
  difficulty?: ExerciseDifficulty;
  tags: string[];
  keywords: string[];
  starterCode?: string;
  executor?: ExerciseExecutor;
  filePath: string;
  sourceSlugs: string[];
};

type ParsedExerciseFrontmatter = {
  title?: string;
  description?: string;
  keywords?: unknown;
  track?: string;
  slug?: string;
  order?: number | string;
  difficulty?: string;
  tags?: unknown;
  starterCode?: string;
  executor?: {
    type?: string;
    description?: string;
    channel?: "stable" | "beta" | "nightly";
    edition?: "2021" | "2024";
    mode?: "debug" | "release";
    tests?: unknown;
    expectedStdout?: string;
    harnessBefore?: string;
    harnessAfter?: string;
  };
  published?: boolean;
};

function normalizeDifficulty(value: string | undefined): ExerciseDifficulty | undefined {
  if (!value) return undefined;
  const normalized = value.toLowerCase();
  if (normalized === "easy") return "Easy";
  if (normalized === "medium") return "Medium";
  if (normalized === "hard") return "Hard";
  return undefined;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is string => typeof entry === "string");
}

function normalizeExecutor(raw: ParsedExerciseFrontmatter["executor"]): ExerciseExecutor | undefined {
  if (!raw || raw.type !== "rust-playground") return undefined;

  const tests = Array.isArray(raw.tests)
    ? raw.tests
        .map((entry) => {
          if (!entry || typeof entry !== "object") return null;
          const test = entry as Record<string, unknown>;
          if (typeof test.expectedStdout !== "string") return null;

          return {
            name: typeof test.name === "string" ? test.name : "test",
            expectedStdout: test.expectedStdout,
            harnessBefore:
              typeof test.harnessBefore === "string" ? test.harnessBefore : undefined,
            harnessAfter:
              typeof test.harnessAfter === "string" ? test.harnessAfter : undefined,
          } satisfies RustPlaygroundTestCase;
        })
        .filter((entry): entry is RustPlaygroundTestCase => Boolean(entry))
    : [];

  if (tests.length === 0 && typeof raw.expectedStdout === "string") {
    tests.push({
      name: "main",
      expectedStdout: raw.expectedStdout,
      harnessBefore: raw.harnessBefore,
      harnessAfter: raw.harnessAfter,
    });
  }

  if (tests.length === 0) return undefined;

  return {
    type: "rust-playground",
    description: raw.description,
    channel: raw.channel ?? "stable",
    edition: raw.edition ?? "2021",
    mode: raw.mode ?? "debug",
    tests,
  };
}

function parseExerciseFile(filePath: string): ExerciseEntry | null {
  const raw = fs.readFileSync(filePath, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as ParsedExerciseFrontmatter;

  if (data.published === false) {
    return null;
  }

  const relativeToRoot = path.relative(CHALLENGES_ROOT, filePath).replace(/\\/g, "/");
  const withoutExtension = relativeToRoot.replace(/\.mdx?$/, "");
  const sourceSlugs = withoutExtension.split("/");
  const fileBaseName = path.basename(filePath, path.extname(filePath));
  const track = data.track ?? sourceSlugs[0];
  const slug = data.slug ?? fileBaseName;
  const orderValue =
    typeof data.order === "number"
      ? data.order
      : typeof data.order === "string"
      ? Number.parseInt(data.order, 10)
      : Number.parseInt(fileBaseName, 10);

  if (!track || !slug || !data.title || !data.description) {
    return null;
  }

  return {
    track,
    slug,
    order: Number.isFinite(orderValue) ? orderValue : Number.MAX_SAFE_INTEGER,
    title: data.title,
    description: data.description,
    difficulty: normalizeDifficulty(data.difficulty),
    tags: asStringArray(data.tags),
    keywords: asStringArray(data.keywords),
    starterCode: typeof data.starterCode === "string" ? data.starterCode : undefined,
    executor: normalizeExecutor(data.executor),
    filePath,
    sourceSlugs,
  };
}

function walkDir(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) return [];

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkDir(fullPath));
      continue;
    }
    if (/\.mdx?$/.test(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

export const listExercises = cache(() => {
  return walkDir(CHALLENGES_ROOT)
    .map(parseExerciseFile)
    .filter((entry): entry is ExerciseEntry => Boolean(entry))
    .sort((a, b) => {
      if (a.track !== b.track) return a.track.localeCompare(b.track);
      if (a.order !== b.order) return a.order - b.order;
      return a.slug.localeCompare(b.slug);
    });
});

export function listExerciseTracks() {
  return Array.from(new Set(listExercises().map((exercise) => exercise.track)));
}

export function listExercisesByTrack(track: string) {
  return listExercises().filter((exercise) => exercise.track === track);
}

export function getExercise(track: string, slugOrLegacyOrder: string) {
  const exercises = listExercisesByTrack(track);

  return (
    exercises.find((exercise) => exercise.slug === slugOrLegacyOrder) ??
    exercises.find((exercise) => String(exercise.order) === slugOrLegacyOrder) ??
    null
  );
}

export function getExerciseIndex(track: string, slugOrLegacyOrder: string) {
  const exercises = listExercisesByTrack(track);
  return exercises.findIndex(
    (exercise) =>
      exercise.slug === slugOrLegacyOrder || String(exercise.order) === slugOrLegacyOrder
  );
}

export function getAdjacentExercises(track: string, slugOrLegacyOrder: string) {
  const exercises = listExercisesByTrack(track);
  const index = getExerciseIndex(track, slugOrLegacyOrder);

  if (index === -1) {
    return { previous: null, next: null };
  }

  return {
    previous: exercises[index - 1] ?? null,
    next: exercises[index + 1] ?? null,
  };
}

export function getTrackMeta(track: string) {
  const predefined: Record<
    string,
    {
      name: string;
      description: string;
      keywords: string[];
    }
  > = {
    rust: {
      name: "30 Days of Rust",
      description:
        "Master Rust programming with hands-on exercises that build Solana-ready problem solving and muscle memory.",
      keywords: [
        "rust coding challenges",
        "learn rust",
        "rust programming exercises",
        "rust for solana",
        "solana rust exercises",
      ],
    },
  };

  return (
    predefined[track] ?? {
      name: track.charAt(0).toUpperCase() + track.slice(1),
      description: `Hands-on ${track} exercises for learn.sol.`,
      keywords: [`${track} exercises`, `${track} coding challenges`],
    }
  );
}
