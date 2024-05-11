import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const vouchers = sqliteTable("vouchers", {
  id: text("id").primaryKey(),
  name: text("name").unique().notNull(),
  voucherCode: text("voucher_code").unique().notNull(),
  discountPercentage: integer("discount_percentage").notNull(),
  discountMax: integer("discount_max").notNull(),
  voucherAmount: integer("voucher_amount").notNull(),
  description: text("description"),
  expirationDate: text("expiration_date"),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
})

export type InsertVoucher = typeof vouchers.$inferInsert
export type SelectVoucher = typeof vouchers.$inferSelect
