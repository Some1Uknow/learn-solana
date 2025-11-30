import {
  pgTable,
  serial,
  varchar,
  integer,
  timestamp,
  text,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Tracks per-user per-challenge completion state
export const challengeProgress = pgTable(
  "challenge_progress",
  {
    id: serial("id").primaryKey(),
    walletAddress: varchar("wallet_address", { length: 100 }).notNull(),
    track: varchar("track", { length: 50 }).notNull(), // "rust", "anchor", etc.
    challengeId: integer("challenge_id").notNull(), // 1-30, etc.
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull(),
    attempts: integer("attempts").notNull().default(1),
    solutionCode: text("solution_code"), // Optional: store their passing solution
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    uniq_challenge_wallet: uniqueIndex("uniq_challenge_progress_wallet_track_id").on(
      table.walletAddress,
      table.track,
      table.challengeId
    ),
  })
);

export type ChallengeProgress = typeof challengeProgress.$inferSelect;
export type NewChallengeProgress = typeof challengeProgress.$inferInsert;
