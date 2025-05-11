CREATE TYPE "public"."language" AS ENUM('id', 'en');--> statement-breakpoint
CREATE TYPE "public"."media_type" AS ENUM('image', 'audio', 'video', 'document', 'other');--> statement-breakpoint
CREATE TYPE "public"."payment_provider" AS ENUM('tripay', 'midtrans', 'duitku', 'xendit');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('unpaid', 'paid', 'failed', 'expired', 'error', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('published', 'draft', 'rejected', 'in_review');--> statement-breakpoint
CREATE TYPE "public"."transaction_provider" AS ENUM('digiflazz', 'apigames');--> statement-breakpoint
CREATE TYPE "public"."transaction_status" AS ENUM('processing', 'success', 'failed', 'error');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'member', 'author', 'admin');--> statement-breakpoint
CREATE TABLE "digiflazz_price_list" (
	"id" text PRIMARY KEY NOT NULL,
	"product_name" text NOT NULL,
	"sku" text NOT NULL,
	"brand" text NOT NULL,
	"category" text NOT NULL,
	"price" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "digiflazz_price_list_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "items" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"sku" text NOT NULL,
	"type" text,
	"original_price" integer NOT NULL,
	"price" integer NOT NULL,
	"description" text,
	"icon" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "items_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "medias" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"file_type" text NOT NULL,
	"type" "media_type" DEFAULT 'image' NOT NULL,
	"description" text,
	"author_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "medias_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY NOT NULL,
	"invoice_id" text NOT NULL,
	"reference" text,
	"method" text,
	"customer_name" text,
	"customer_email" text,
	"customer_phone" text NOT NULL,
	"amount" integer NOT NULL,
	"fee" integer NOT NULL,
	"total" integer NOT NULL,
	"note" text,
	"status" "payment_status" DEFAULT 'unpaid' NOT NULL,
	"provider" "payment_provider" DEFAULT 'tripay' NOT NULL,
	"paid_at" timestamp DEFAULT now(),
	"expired_at" timestamp DEFAULT now(),
	"userId" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "payments_invoice_id_unique" UNIQUE("invoice_id")
);
--> statement-breakpoint
CREATE TABLE "payment_methods" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"provider" "payment_provider" DEFAULT 'tripay' NOT NULL,
	"code" text NOT NULL,
	"group" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "_product_items" (
	"product_id" text NOT NULL,
	"item_id" text NOT NULL,
	CONSTRAINT "_product_items_product_id_item_id_pk" PRIMARY KEY("product_id","item_id")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"instruction" text,
	"featured" boolean DEFAULT false NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"featured_image" text,
	"cover_image" text,
	"guide_image" text,
	"icon" text,
	"transactions" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "promos" (
	"id" text PRIMARY KEY NOT NULL,
	"language" "language" DEFAULT 'id' NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"content" text NOT NULL,
	"excerpt" text NOT NULL,
	"brand" text,
	"meta_title" text,
	"meta_description" text,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"promo_translation_id" text NOT NULL,
	"featured_image" text,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "promos_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "promo_translations" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"invoice_id" text NOT NULL,
	"account_id" text NOT NULL,
	"sku" text NOT NULL,
	"product_name" text NOT NULL,
	"ign" text,
	"customer_name" text,
	"customer_email" text,
	"customer_phone" text NOT NULL,
	"quantity" integer NOT NULL,
	"voucher_code" text,
	"discount_amount" integer DEFAULT 0,
	"fee" integer NOT NULL,
	"total" integer NOT NULL,
	"note" text,
	"status" "transaction_status" DEFAULT 'processing' NOT NULL,
	"provider" "transaction_provider" DEFAULT 'digiflazz' NOT NULL,
	"userId" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "transactions_invoice_id_unique" UNIQUE("invoice_id")
);
--> statement-breakpoint
CREATE TABLE "accounts" (
	"provider" text NOT NULL,
	"provider_account_id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "accounts_provider_account_id_unique" UNIQUE("provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text,
	"name" text,
	"username" text,
	"image" text,
	"phone_number" text,
	"about" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "vouchers" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"voucher_code" text NOT NULL,
	"discount_percentage" integer NOT NULL,
	"discount_max" integer NOT NULL,
	"voucher_amount" integer NOT NULL,
	"description" text,
	"expiration_date" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "vouchers_name_unique" UNIQUE("name"),
	CONSTRAINT "vouchers_voucher_code_unique" UNIQUE("voucher_code")
);
--> statement-breakpoint
ALTER TABLE "medias" ADD CONSTRAINT "medias_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_product_items" ADD CONSTRAINT "_product_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_product_items" ADD CONSTRAINT "_product_items_item_id_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promos" ADD CONSTRAINT "promos_promo_translation_id_promo_translations_id_fk" FOREIGN KEY ("promo_translation_id") REFERENCES "public"."promo_translations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;