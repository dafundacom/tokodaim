CREATE TABLE IF NOT EXISTS "_top_up_top_up_products" (
	"top_up_id" text NOT NULL,
	"top_up_product_id" text NOT NULL,
	CONSTRAINT "_top_up_top_up_products_top_up_id_top_up_product_id_pk" PRIMARY KEY("top_up_id","top_up_product_id")
);
--> statement-breakpoint
ALTER TABLE "top_up_products" RENAME COLUMN "product_name" TO "name";--> statement-breakpoint
ALTER TABLE "top_ups" RENAME COLUMN "brand" TO "title";--> statement-breakpoint
ALTER TABLE "top_ups" RENAME COLUMN "categorySlug" TO "category_slug";--> statement-breakpoint
ALTER TABLE "top_up_products" ALTER COLUMN "price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "top_up_products" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "top_up_products" ADD COLUMN "original_price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "top_up_products" ADD COLUMN "icon_id" text;--> statement-breakpoint
ALTER TABLE "top_ups" ADD COLUMN "featured_image_id" text;--> statement-breakpoint
ALTER TABLE "top_ups" ADD COLUMN "cover_image_id" text;--> statement-breakpoint
ALTER TABLE "top_ups" ADD COLUMN "guide_image_id" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_top_up_top_up_products" ADD CONSTRAINT "_top_up_top_up_products_top_up_id_top_ups_id_fk" FOREIGN KEY ("top_up_id") REFERENCES "public"."top_ups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_top_up_top_up_products" ADD CONSTRAINT "_top_up_top_up_products_top_up_product_id_top_up_products_id_fk" FOREIGN KEY ("top_up_product_id") REFERENCES "public"."top_up_products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "top_up_products" ADD CONSTRAINT "top_up_products_icon_id_medias_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "top_ups" ADD CONSTRAINT "top_ups_featured_image_id_medias_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "top_ups" ADD CONSTRAINT "top_ups_cover_image_id_medias_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "top_ups" ADD CONSTRAINT "top_ups_guide_image_id_medias_id_fk" FOREIGN KEY ("guide_image_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "top_up_products" DROP COLUMN IF EXISTS "type";--> statement-breakpoint
ALTER TABLE "top_up_products" DROP COLUMN IF EXISTS "command";--> statement-breakpoint
ALTER TABLE "top_up_products" DROP COLUMN IF EXISTS "category";--> statement-breakpoint
ALTER TABLE "top_up_products" DROP COLUMN IF EXISTS "description";--> statement-breakpoint
ALTER TABLE "top_up_products" DROP COLUMN IF EXISTS "brand";--> statement-breakpoint
ALTER TABLE "top_up_products" DROP COLUMN IF EXISTS "brand_slug";--> statement-breakpoint
ALTER TABLE "top_ups" DROP COLUMN IF EXISTS "featured_image";--> statement-breakpoint
ALTER TABLE "top_ups" DROP COLUMN IF EXISTS "cover_image";--> statement-breakpoint
ALTER TABLE "top_ups" DROP COLUMN IF EXISTS "guide_image";--> statement-breakpoint
ALTER TABLE "top_ups" DROP COLUMN IF EXISTS "product_icon";--> statement-breakpoint
ALTER TABLE "top_up_products" ADD CONSTRAINT "top_up_products_slug_unique" UNIQUE("slug");