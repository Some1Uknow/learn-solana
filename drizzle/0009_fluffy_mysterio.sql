CREATE TABLE "runtime_lab_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(191) NOT NULL,
	"program_id" varchar(100) NOT NULL,
	"flow_id" varchar(100) NOT NULL,
	"active_step_index" integer DEFAULT 0 NOT NULL,
	"selected_answers" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"revealed_steps" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"selected_failures" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"active_panel" varchar(32) DEFAULT 'runtime' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "runtime_lab_progress" ADD CONSTRAINT "runtime_lab_progress_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "uniq_runtime_lab_progress_user_program" ON "runtime_lab_progress" USING btree ("user_id","program_id");
