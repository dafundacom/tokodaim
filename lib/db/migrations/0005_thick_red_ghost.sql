ALTER TABLE "public"."payments" ALTER COLUMN "method" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."payment_method";--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('ALFAMART', 'ALFAMIDI', 'BNIVA', 'BRIVA', 'BSIVA', 'CIMBVA', 'DANA', 'DANAMONVA', 'INDOMARET', 'MANDIRIVA', 'MUAMALATVA', 'OCBCVA', 'OTHERBANKVA', 'OVO', 'PERMATAVA', 'QRIS', 'QRIS2', 'QRISC', 'QRIS_SHOPPEEPAY', 'SHOPEEPAY');--> statement-breakpoint
ALTER TABLE "public"."payments" ALTER COLUMN "method" SET DATA TYPE "public"."payment_method" USING "method"::"public"."payment_method";