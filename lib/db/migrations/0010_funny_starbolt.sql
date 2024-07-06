ALTER TABLE "digiflazz_price_list" ADD COLUMN "sku" text NOT NULL;--> statement-breakpoint
ALTER TABLE "digiflazz_price_list" ADD CONSTRAINT "digiflazz_price_list_sku_unique" UNIQUE("sku");