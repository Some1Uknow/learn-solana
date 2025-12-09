CREATE TABLE IF NOT EXISTS "challenge_progress" (
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
CREATE UNIQUE INDEX IF NOT EXISTS "uniq_challenge_progress_wallet_track_id" ON "challenge_progress" USING btree ("wallet_address","track","challenge_id");
