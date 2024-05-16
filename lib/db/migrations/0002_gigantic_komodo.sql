CREATE TABLE IF NOT EXISTS "vouchers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"voucher_code" text NOT NULL,
	"discount_percentage" integer NOT NULL,
	"discount_max" integer NOT NULL,
	"voucher_amount" integer NOT NULL,
	"description" text,
	"expiration_date" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "vouchers_name_unique" UNIQUE("name"),
	CONSTRAINT "vouchers_voucher_code_unique" UNIQUE("voucher_code")
);
