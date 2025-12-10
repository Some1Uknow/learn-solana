CREATE TABLE "challenge_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"wallet_address" varchar(100) NOT NULL,
	"track" varchar(50) NOT NULL,
	"challenge_id" integer NOT NULL,
	"completed_at" timestamp with time zone NOT NULL,
	"attempts" integer DEFAULT 1 NOT NULL,
	"solution_code" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "platform_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"total_users" integer DEFAULT 0 NOT NULL,
	"total_tutorial_minutes" bigint DEFAULT 0 NOT NULL,
	"total_game_players" integer DEFAULT 0 NOT NULL,
	"total_rust_challenges_attempted" integer DEFAULT 0 NOT NULL,
	"rust_challenge_participants" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "wallet_bindings" CASCADE;--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_challenge_progress_wallet_track_id" ON "challenge_progress" USING btree ("wallet_address","track","challenge_id");