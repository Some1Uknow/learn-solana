import {
  pgTable,
  serial,
  varchar,
  timestamp,
  text,
  uniqueIndex,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const exerciseProgress = pgTable(
  "exercise_progress",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 191 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    trackSlug: varchar("track_slug", { length: 100 }).notNull(),
    exerciseSlug: varchar("exercise_slug", { length: 191 }).notNull(),
    status: varchar("status", { length: 32 }).notNull().default("completed"),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    attemptCount: integer("attempt_count").notNull().default(1),
    lastRunAt: timestamp("last_run_at", { withTimezone: true }),
    lastCode: text("last_code"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    uniqExerciseUser: uniqueIndex("uniq_exercise_progress_user_track_slug").on(
      table.userId,
      table.trackSlug,
      table.exerciseSlug
    ),
  })
);

export type ExerciseProgress = typeof exerciseProgress.$inferSelect;
export type NewExerciseProgress = typeof exerciseProgress.$inferInsert;
