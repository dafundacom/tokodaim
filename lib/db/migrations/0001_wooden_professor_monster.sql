CREATE TABLE IF NOT EXISTS "promo_translations" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "promos" (
	"id" text PRIMARY KEY NOT NULL,
	"language" "language" DEFAULT 'id' NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text NOT NULL,
	"brand" text,
	"meta_title" text,
	"meta_description" text,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"promo_translation_id" text NOT NULL,
	"featured_image_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "promos_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "promos" ADD CONSTRAINT "promos_promo_translation_id_promo_translations_id_fk" FOREIGN KEY ("promo_translation_id") REFERENCES "public"."promo_translations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "promos" ADD CONSTRAINT "promos_featured_image_id_medias_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."medias"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
