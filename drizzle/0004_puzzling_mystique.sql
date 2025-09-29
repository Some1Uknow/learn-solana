CREATE TABLE "minted_nfts" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" varchar(100) NOT NULL,
	"wallet_address" varchar(100) NOT NULL,
	"mint_address" varchar(100) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "game_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"game_id" varchar(100) NOT NULL,
	"wallet_address" varchar(100) NOT NULL,
	"completed_at" timestamp with time zone,
	"can_claim" boolean DEFAULT false NOT NULL,
	"claimed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wallet_bindings" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_address" varchar(100) NOT NULL,
	"user_sub" varchar(255) NOT NULL,
	"pending_nonce" varchar(255),
	"bound_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "games" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "game_completions" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "nft_claims" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "games" CASCADE;--> statement-breakpoint
DROP TABLE "game_completions" CASCADE;--> statement-breakpoint
DROP TABLE "nft_claims" CASCADE;--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_web3auth_id_unique";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_wallet_address_unique";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "profile_image" SET DATA TYPE varchar(500);--> statement-breakpoint
CREATE UNIQUE INDEX "minted_nfts_game_wallet_unique" ON "minted_nfts" USING btree ("game_id","wallet_address");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_game_progress_game_wallet" ON "game_progress" USING btree ("game_id","wallet_address");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_wallet_binding_wallet" ON "wallet_bindings" USING btree ("wallet_address");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_wallet_binding_user_sub" ON "wallet_bindings" USING btree ("user_sub");--> statement-breakpoint
CREATE UNIQUE INDEX "users_wallet_address_unique" ON "users" USING btree ("wallet_address");--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "web3auth_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "verifier";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "verifier_id";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "is_active";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "last_login_at";