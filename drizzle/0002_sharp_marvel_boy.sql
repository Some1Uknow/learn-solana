CREATE TABLE "users" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"web3auth_id" varchar(191) NOT NULL,
	"wallet_address" varchar(44) NOT NULL,
	"email" varchar(255),
	"name" varchar(255),
	"profile_image" text,
	"verifier" varchar(100),
	"verifier_id" varchar(255),
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_login_at" timestamp,
	CONSTRAINT "users_web3auth_id_unique" UNIQUE("web3auth_id"),
	CONSTRAINT "users_wallet_address_unique" UNIQUE("wallet_address")
);
--> statement-breakpoint
CREATE TABLE "games" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"game_id" varchar(100) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"goal" text NOT NULL,
	"category" varchar(100) NOT NULL,
	"difficulty" varchar(50) NOT NULL,
	"icon" varchar(10),
	"image" varchar(500),
	"nft_name" varchar(255) NOT NULL,
	"nft_description" text NOT NULL,
	"nft_image_url" varchar(500) NOT NULL,
	"nft_external_url" varchar(500),
	"max_levels" integer DEFAULT 1 NOT NULL,
	"min_score_for_completion" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "games_game_id_unique" UNIQUE("game_id")
);
--> statement-breakpoint
CREATE TABLE "game_completions" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" varchar(191) NOT NULL,
	"game_id" varchar(191) NOT NULL,
	"final_score" integer NOT NULL,
	"levels_completed" integer NOT NULL,
	"time_to_complete" integer,
	"session_data" text,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verification_data" text,
	"completed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "nft_claims" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"user_id" varchar(191) NOT NULL,
	"game_id" varchar(191) NOT NULL,
	"game_completion_id" varchar(191) NOT NULL,
	"mint_address" varchar(44),
	"token_address" varchar(44),
	"metadata_address" varchar(44),
	"nft_name" varchar(255) NOT NULL,
	"nft_description" text NOT NULL,
	"nft_image_url" varchar(500) NOT NULL,
	"nft_metadata_uri" varchar(500),
	"transaction_signature" varchar(88),
	"block_time" timestamp,
	"slot" varchar(20),
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"error_message" text,
	"retry_count" varchar(10) DEFAULT '0' NOT NULL,
	"claimed_at" timestamp DEFAULT now() NOT NULL,
	"minted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "nft_claims_mint_address_unique" UNIQUE("mint_address")
);
--> statement-breakpoint
ALTER TABLE "game_completions" ADD CONSTRAINT "game_completions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "game_completions" ADD CONSTRAINT "game_completions_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nft_claims" ADD CONSTRAINT "nft_claims_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nft_claims" ADD CONSTRAINT "nft_claims_game_id_games_id_fk" FOREIGN KEY ("game_id") REFERENCES "public"."games"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nft_claims" ADD CONSTRAINT "nft_claims_game_completion_id_game_completions_id_fk" FOREIGN KEY ("game_completion_id") REFERENCES "public"."game_completions"("id") ON DELETE cascade ON UPDATE no action;