ALTER TABLE "embeddings" ADD COLUMN "page_url" text NOT NULL;--> statement-breakpoint
ALTER TABLE "embeddings" ADD COLUMN "page_title" text NOT NULL;--> statement-breakpoint
ALTER TABLE "embeddings" ADD COLUMN "section_title" text;--> statement-breakpoint
ALTER TABLE "embeddings" ADD COLUMN "heading_id" text;--> statement-breakpoint
ALTER TABLE "embeddings" ADD COLUMN "chunk_index" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "embeddings" ADD COLUMN "heading_level" integer DEFAULT 1;