ALTER TABLE "items" DROP CONSTRAINT "items_product_id_products_id_fk";
--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN IF EXISTS "product_id";