ALTER TABLE "articles" DROP CONSTRAINT "articles_featured_image_id_medias_id_fk";
--> statement-breakpoint
ALTER TABLE "promos" DROP CONSTRAINT "promos_featured_image_id_medias_id_fk";
--> statement-breakpoint
ALTER TABLE "topics" DROP CONSTRAINT "topics_featured_image_id_medias_id_fk";
--> statement-breakpoint
ALTER TABLE "articles" ADD COLUMN "featured_image" text NOT NULL;--> statement-breakpoint
ALTER TABLE "promos" ADD COLUMN "featured_image" text;--> statement-breakpoint
ALTER TABLE "topics" ADD COLUMN "featured_image" text;--> statement-breakpoint
ALTER TABLE "articles" DROP COLUMN IF EXISTS "featured_image_id";--> statement-breakpoint
ALTER TABLE "promos" DROP COLUMN IF EXISTS "featured_image_id";--> statement-breakpoint
ALTER TABLE "topics" DROP COLUMN IF EXISTS "type";--> statement-breakpoint
ALTER TABLE "topics" DROP COLUMN IF EXISTS "featured_image_id";--> statement-breakpoint
DROP TYPE "public"."topic_type";