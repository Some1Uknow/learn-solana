import { integer, jsonb, pgTable, serial, timestamp, uniqueIndex, varchar } from "drizzle-orm/pg-core";

import { users } from "./users";

export type BuildCheckResult = {
  key: string;
  label: string;
  status: "passed" | "failed";
  message?: string;
  hint?: string;
};

export type BuildAttemptResult = {
  checks: BuildCheckResult[];
  hidden: { passed: number; total: number };
};

export const buildAttempts = pgTable(
  "build_attempts",
  {
    id: varchar("id", { length: 36 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: varchar("user_id", { length: 191 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    challengeSlug: varchar("challenge_slug", { length: 120 }).notNull(),
    stageSlug: varchar("stage_slug", { length: 160 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("created"),
    artifactSha256: varchar("artifact_sha256", { length: 64 }),
    artifactSize: integer("artifact_size"),
    runnerVersion: varchar("runner_version", { length: 80 }),
    summary: varchar("summary", { length: 500 }),
    result: jsonb("result").$type<BuildAttemptResult>(),
    errorCode: varchar("error_code", { length: 80 }),
    startedAt: timestamp("started_at", { withTimezone: true }),
    finishedAt: timestamp("finished_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    attemptsByUserStage: uniqueIndex("build_attempts_user_stage_created_idx").on(
      table.userId,
      table.challengeSlug,
      table.stageSlug,
      table.createdAt
    ),
  })
);

export const buildStageProgress = pgTable(
  "build_stage_progress",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 191 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    challengeSlug: varchar("challenge_slug", { length: 120 }).notNull(),
    stageSlug: varchar("stage_slug", { length: 160 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("in_progress"),
    attemptCount: integer("attempt_count").notNull().default(0),
    lastAttemptId: varchar("last_attempt_id", { length: 36 }).references(() => buildAttempts.id, {
      onDelete: "set null",
    }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    userChallengeStage: uniqueIndex("build_stage_progress_user_challenge_stage_idx").on(
      table.userId,
      table.challengeSlug,
      table.stageSlug
    ),
  })
);

export type BuildAttempt = typeof buildAttempts.$inferSelect;
export type BuildStageProgress = typeof buildStageProgress.$inferSelect;
