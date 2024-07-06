CREATE TABLE IF NOT EXISTS "digiflazz_price_list" (
	"id" text PRIMARY KEY NOT NULL,
	"product_name" text NOT NULL,
	"category" text NOT NULL,
	"brand" text NOT NULL,
	"price" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
