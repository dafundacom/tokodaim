ALTER TABLE "items" DROP CONSTRAINT "items_icon_id_medias_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_featured_image_id_medias_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_cover_image_id_medias_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_guide_image_id_medias_id_fk";
--> statement-breakpoint
ALTER TABLE "items" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "featured_image" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "cover_image" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "guide_image" text;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "icon" text;--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "icon_id";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "featured_image_id";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "cover_image_id";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN IF EXISTS "guide_image_id";