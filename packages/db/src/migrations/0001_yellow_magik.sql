ALTER TABLE "_product_items" DROP CONSTRAINT "_product_items_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "_product_items" DROP CONSTRAINT "_product_items_item_id_items_id_fk";
--> statement-breakpoint
ALTER TABLE "_product_items" ADD CONSTRAINT "_product_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_product_items" ADD CONSTRAINT "_product_items_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE cascade ON UPDATE no action;