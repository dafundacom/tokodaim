DO $$ BEGIN
 CREATE TYPE "public"."payment_provider" AS ENUM('tripay', 'midtrans', 'duitku');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."top_up_payment_status" AS ENUM('unpaid', 'paid', 'failed', 'expired', 'error', 'refunded');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."top_up_provider" AS ENUM('digiflazz', 'apigames');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."top_up_status" AS ENUM('processing', 'success', 'failed', 'error');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "top_up_orders" (
	"id" text PRIMARY KEY NOT NULL,
	"invoice_id" text NOT NULL,
	"amount" integer NOT NULL,
	"sku" text NOT NULL,
	"account_id" text NOT NULL,
	"customer_name" text,
	"customer_email" text,
	"customer_phone" text NOT NULL,
	"voucher_code" text,
	"discount_amount" integer DEFAULT 0,
	"fee_amount" integer NOT NULL,
	"total_amount" integer NOT NULL,
	"note" text,
	"payment_method" text NOT NULL,
	"payment_status" "top_up_payment_status" DEFAULT 'unpaid' NOT NULL,
	"status" "top_up_status" DEFAULT 'processing' NOT NULL,
	"top_up_provider" "top_up_provider" DEFAULT 'digiflazz' NOT NULL,
	"payment_provider" "payment_provider" DEFAULT 'tripay' NOT NULL,
	"userId" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "top_up_orders_invoice_id_unique" UNIQUE("invoice_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "top_up_orders" ADD CONSTRAINT "top_up_orders_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
