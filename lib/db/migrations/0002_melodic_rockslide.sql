CREATE TABLE IF NOT EXISTS "_product_items" (
	"product_id" text NOT NULL,
	"item_id" text NOT NULL,
	CONSTRAINT "_product_items_product_id_item_id_pk" PRIMARY KEY("product_id","item_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_product_items" ADD CONSTRAINT "_product_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "_product_items" ADD CONSTRAINT "_product_items_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
