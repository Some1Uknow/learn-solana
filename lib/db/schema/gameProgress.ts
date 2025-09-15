import { pgTable, serial, varchar, timestamp, boolean, uniqueIndex } from 'drizzle-orm/pg-core';

// Tracks per-user per-game completion and claim state.
// canClaim explicit so we can later revoke or implement cooldown logic without recomputing.
export const gameProgress = pgTable(
  'game_progress',
  {
    id: serial('id').primaryKey(),
    gameId: varchar('game_id', { length: 100 }).notNull(),
    walletAddress: varchar('wallet_address', { length: 100 }).notNull(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    canClaim: boolean('can_claim').notNull().default(false),
    claimedAt: timestamp('claimed_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    uniq_game_wallet: uniqueIndex('uniq_game_progress_game_wallet').on(
      table.gameId,
      table.walletAddress,
    ),
  }),
);

export type GameProgress = typeof gameProgress.$inferSelect;
export type NewGameProgress = typeof gameProgress.$inferInsert;
