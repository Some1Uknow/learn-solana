CREATE TABLE "build_attempts" (
  "id" varchar(36) PRIMARY KEY NOT NULL,
  "user_id" varchar(191) NOT NULL,
  "challenge_slug" varchar(120) NOT NULL,
  "stage_slug" varchar(160) NOT NULL,
  "status" varchar(20) DEFAULT 'created' NOT NULL,
  "artifact_sha256" varchar(64),
  "artifact_size" integer,
  "runner_version" varchar(80),
  "summary" varchar(500),
  "result" jsonb,
  "error_code" varchar(80),
  "started_at" timestamp with time zone,
  "finished_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "build_stage_progress" (
  "id" serial PRIMARY KEY NOT NULL,
  "user_id" varchar(191) NOT NULL,
  "challenge_slug" varchar(120) NOT NULL,
  "stage_slug" varchar(160) NOT NULL,
  "status" varchar(20) DEFAULT 'in_progress' NOT NULL,
  "attempt_count" integer DEFAULT 0 NOT NULL,
  "last_attempt_id" varchar(36),
  "completed_at" timestamp with time zone,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "build_attempts" ADD CONSTRAINT "build_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "build_stage_progress" ADD CONSTRAINT "build_stage_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "build_stage_progress" ADD CONSTRAINT "build_stage_progress_last_attempt_id_build_attempts_id_fk" FOREIGN KEY ("last_attempt_id") REFERENCES "public"."build_attempts"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE UNIQUE INDEX "build_attempts_user_stage_created_idx" ON "build_attempts" USING btree ("user_id","challenge_slug","stage_slug","created_at");
--> statement-breakpoint
CREATE UNIQUE INDEX "build_stage_progress_user_challenge_stage_idx" ON "build_stage_progress" USING btree ("user_id","challenge_slug","stage_slug");
