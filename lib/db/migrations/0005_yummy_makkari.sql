ALTER TABLE "payments" ALTER COLUMN "method" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "method" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "payments" ALTER COLUMN "method" DROP NOT NULL;--> statement-breakpoint
DROP TYPE "public"."payment_method";