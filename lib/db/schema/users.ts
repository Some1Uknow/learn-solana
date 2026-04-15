import { nanoid } from 'nanoid';
import { pgTable, varchar, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: varchar('id', { length: 191 }).primaryKey().$defaultFn(() => nanoid()),
  privyUserId: varchar('privy_user_id', { length: 255 }),
  walletAddress: varchar('wallet_address', { length: 100 }),
  email: varchar('email', { length: 255 }),
  name: varchar('name', { length: 255 }),
  profileImage: varchar('profile_image', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  privyUserIdIdx: uniqueIndex('users_privy_user_id_unique').on(table.privyUserId),
  walletAddressIdx: uniqueIndex('users_wallet_address_unique').on(table.walletAddress),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
