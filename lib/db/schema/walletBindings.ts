import { pgTable, serial, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const walletBindings = pgTable('wallet_bindings', {
  id: serial('id').primaryKey(),
  walletAddress: varchar('wallet_address', { length: 100 }).notNull(),
  userSub: varchar('user_sub', { length: 255 }).notNull(),
  // Last issued nonce awaiting signature (cleared after successful bind)
  pendingNonce: varchar('pending_nonce', { length: 255 }),
  // When the binding (signature verification) was completed
  boundAt: timestamp('bound_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  uniq_wallet: uniqueIndex('uniq_wallet_binding_wallet').on(table.walletAddress),
  uniq_user_sub: uniqueIndex('uniq_wallet_binding_user_sub').on(table.userSub),
}));

export type WalletBinding = typeof walletBindings.$inferSelect;
export type NewWalletBinding = typeof walletBindings.$inferInsert;
