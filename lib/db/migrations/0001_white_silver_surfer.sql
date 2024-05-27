ALTER TABLE "top_up_orders" RENAME COLUMN "merchant_ref" TO "payment_merchant_ref";--> statement-breakpoint
ALTER TABLE "top_up_orders" DROP CONSTRAINT "top_up_orders_merchant_ref_unique";--> statement-breakpoint
ALTER TABLE "top_up_orders" ADD COLUMN "top_up_ref_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "top_up_orders" ADD CONSTRAINT "top_up_orders_payment_merchant_ref_unique" UNIQUE("payment_merchant_ref");--> statement-breakpoint
ALTER TABLE "top_up_orders" ADD CONSTRAINT "top_up_orders_top_up_ref_id_unique" UNIQUE("top_up_ref_id");