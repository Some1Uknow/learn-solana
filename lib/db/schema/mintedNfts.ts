import {
  pgTable,
  serial,
  varchar,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const mintedNfts = pgTable(
  "minted_nfts",
  {
    id: serial("id").primaryKey(),
    gameId: varchar("game_id", { length: 100 }).notNull(),
    walletAddress: varchar("wallet_address", { length: 100 }).notNull(),
    mintAddress: varchar("mint_address", { length: 100 }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => ({
    gameWalletUnique: uniqueIndex("minted_nfts_game_wallet_unique").on(
      t.gameId,
      t.walletAddress
    ),
  })
);
