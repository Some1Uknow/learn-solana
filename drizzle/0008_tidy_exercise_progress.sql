DROP TABLE IF EXISTS "challenge_progress" CASCADE;

CREATE TABLE "exercise_progress" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" varchar(191) NOT NULL,
  "track_slug" varchar(100) NOT NULL,
  "exercise_slug" varchar(191) NOT NULL,
  "status" varchar(32) DEFAULT 'completed' NOT NULL,
  "completed_at" timestamp with time zone,
  "attempt_count" integer DEFAULT 1 NOT NULL,
  "last_run_at" timestamp with time zone,
  "last_code" text,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "exercise_progress"
  ADD CONSTRAINT "exercise_progress_user_id_users_id_fk"
  FOREIGN KEY ("user_id")
  REFERENCES "public"."users"("id")
  ON DELETE cascade
  ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_exercise_progress_user_track_slug"
  ON "exercise_progress" USING btree ("user_id","track_slug","exercise_slug");
