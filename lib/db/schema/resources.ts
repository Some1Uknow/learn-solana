import { nanoid } from 'nanoid';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const resources = pgTable('resources', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  content: text('content').notNull(),
  filePath: varchar('file_path', { length: 500 }).notNull(),
  title: varchar('title', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type Resource = typeof resources.$inferSelect;
export type NewResource = typeof resources.$inferInsert;
