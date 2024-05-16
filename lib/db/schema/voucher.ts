import { sql } from "drizzle-orm"
import { boolean, integer, pgTable, text } from "drizzle-orm/pg-core"

export const vouchers = pgTable("vouchers", {
  id: text("id").primaryKey(),
  name: text("name").unique().notNull(),
  voucherCode: text("voucher_code").unique().notNull(),
  discountPercentage: integer("discount_percentage").notNull(),
  // TODO: make this discont max
  discountMax: integer("discount_max").notNull(),
  voucherAmount: integer("voucher_amount").notNull(),
  description: text("description"),
  expirationDate: text("expiration_date"),
  active: boolean("active").notNull().default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export type InsertVoucher = typeof vouchers.$inferInsert
export type SelectVoucher = typeof vouchers.$inferSelect
