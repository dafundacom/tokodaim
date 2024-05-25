DO $$ BEGIN
 CREATE TYPE "public"."ad_position" AS ENUM('home_below_header', 'article_below_header', 'topic_below_header', 'single_article_above_content', 'single_article_middle_content', 'single_article_below_content', 'single_article_pop_up', 'article_below_header_amp', 'single_article_above_content_amp', 'single_article_middle_content_amp', 'single_article_below_content_amp');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."top_up_product_command" AS ENUM('prepaid', 'postpaid');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "top_up_products" (
	"id" text PRIMARY KEY NOT NULL,
	"product_name" text NOT NULL,
	"sku" text NOT NULL,
	"price" integer NOT NULL,
	"type" text NOT NULL,
	"command" "top_up_product_command" DEFAULT 'prepaid' NOT NULL,
	"category" text NOT NULL,
	"description" text,
	"brand" text NOT NULL,
	"brand_slug" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "top_ups" (
	"id" text PRIMARY KEY NOT NULL,
	"brand" text NOT NULL,
	"slug" text NOT NULL,
	"category" text NOT NULL,
	"featured_image" text,
	"cover_image" text,
	"guide_image" text,
	"product_icon" text,
	"description" text,
	"intruction" text,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "top_ups_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "ads" ALTER COLUMN "position" SET DATA TYPE ad_position;