ALTER TYPE "top_up_payment_method" ADD VALUE 'DANA';--> statement-breakpoint
ALTER TABLE "top_up_payments" ADD COLUMN "tripay_reference" text;