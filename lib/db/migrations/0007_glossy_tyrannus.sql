CREATE TABLE IF NOT EXISTS "payment_methods" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"provider" "payment_provider" DEFAULT 'tripay' NOT NULL,
	"code" text NOT NULL,
	"group" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
