import {
  pgTable,
  serial,
  varchar,
  timestamp,
  uniqueIndex,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export type RuntimeLabProgressData = {
  selectedAnswers: Record<string, string>;
  revealedSteps: Record<string, boolean>;
  selectedFailures: Record<string, string>;
};

export const runtimeLabProgress = pgTable(
  "runtime_lab_progress",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 191 })
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      }),
    programId: varchar("program_id", { length: 100 }).notNull(),
    flowId: varchar("flow_id", { length: 100 }).notNull(),
    activeStepIndex: integer("active_step_index").notNull().default(0),
    selectedAnswers: jsonb("selected_answers")
      .$type<Record<string, string>>()
      .notNull()
      .default({}),
    revealedSteps: jsonb("revealed_steps")
      .$type<Record<string, boolean>>()
      .notNull()
      .default({}),
    selectedFailures: jsonb("selected_failures")
      .$type<Record<string, string>>()
      .notNull()
      .default({}),
    activePanel: varchar("active_panel", { length: 32 }).notNull().default("runtime"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    uniqRuntimeLabUserProgram: uniqueIndex("uniq_runtime_lab_progress_user_program").on(
      table.userId,
      table.programId
    ),
  })
);

export type RuntimeLabProgress = typeof runtimeLabProgress.$inferSelect;
export type NewRuntimeLabProgress = typeof runtimeLabProgress.$inferInsert;
