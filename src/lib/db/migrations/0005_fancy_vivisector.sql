CREATE TABLE `vouchers` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`voucher_code` text NOT NULL,
	`discount_percentage` integer NOT NULL,
	`discount_max` integer NOT NULL,
	`voucher_amount` integer NOT NULL,
	`description` text,
	`expiration_date` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE UNIQUE INDEX `vouchers_name_unique` ON `vouchers` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `vouchers_voucher_code_unique` ON `vouchers` (`voucher_code`);