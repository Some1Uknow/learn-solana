ALTER TABLE "users" ALTER COLUMN "wallet_address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "challenge_progress" ALTER COLUMN "wallet_address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "privy_user_id" varchar(255);--> statement-breakpoint
ALTER TABLE "challenge_progress" ADD COLUMN "user_id" varchar(191);--> statement-breakpoint
ALTER TABLE "challenge_progress" ADD CONSTRAINT "challenge_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "users_privy_user_id_unique" ON "users" USING btree ("privy_user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_challenge_progress_user_track_id" ON "challenge_progress" USING btree ("user_id","track","challenge_id");