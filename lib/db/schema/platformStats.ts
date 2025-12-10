import { pgTable, serial, integer, bigint, timestamp } from 'drizzle-orm/pg-core';

/**
 * Platform-wide statistics manually updated weekly.
 * Single row table - always query the latest entry.
 * Admin updates these values manually via database.
 */
export const platformStats = pgTable('platform_stats', {
  id: serial('id').primaryKey(),
  
  // Total users registered on the platform
  totalUsers: integer('total_users').notNull().default(0),
  
  // Total time spent reading tutorials (in minutes)
  totalTutorialMinutes: bigint('total_tutorial_minutes', { mode: 'number' }).notNull().default(0),
  
  // Total players for solana-clicker game
  totalGamePlayers: integer('total_game_players').notNull().default(0),
  
  // Total Rust challenges attempted (all attempts across all users)
  totalRustChallengesAttempted: integer('total_rust_challenges_attempted').notNull().default(0),
  
  // Number of unique people doing Rust challenges
  rustChallengeParticipants: integer('rust_challenge_participants').notNull().default(0),
  
  // Metadata
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export type PlatformStats = typeof platformStats.$inferSelect;
export type NewPlatformStats = typeof platformStats.$inferInsert;
