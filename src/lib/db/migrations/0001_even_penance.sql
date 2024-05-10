CREATE TABLE `top_up_orders` (
	`id` text PRIMARY KEY NOT NULL,
	`invoice_id` text NOT NULL,
	`amount` integer NOT NULL,
	`sku` text NOT NULL,
	`account_id` text NOT NULL,
	`customer_name` text,
	`customer_email` text,
	`customer_phone` text NOT NULL,
	`voucher_code` text,
	`discount_amount` integer DEFAULT 0,
	`fee_amount` integer NOT NULL,
	`total_amount` integer NOT NULL,
	`note` text,
	`payment_method` text NOT NULL,
	`payment_status` text DEFAULT 'unpaid' NOT NULL,
	`status` text DEFAULT 'processing' NOT NULL,
	`top_up_provider` text NOT NULL,
	`payment_provider` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `top_up_orders_invoice_id_unique` ON `top_up_orders` (`invoice_id`);