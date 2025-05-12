ALTER TABLE "promos" DROP CONSTRAINT "promos_promo_translation_id_promo_translations_id_fk";
--> statement-breakpoint
ALTER TABLE "promos" ADD CONSTRAINT "promos_promo_translation_id_promo_translations_id_fk" FOREIGN KEY ("promo_translation_id") REFERENCES "public"."promo_translations"("id") ON DELETE cascade ON UPDATE no action;