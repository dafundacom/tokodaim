import { createId } from "@tokodaim/utils"
import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"

export const voucherTable = pgTable("vouchers", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").unique().notNull(),
  voucherCode: text("voucher_code").unique().notNull(),
  discountPercentage: integer("discount_percentage").notNull(),
  discountMax: integer("discount_max").notNull(),
  voucherAmount: integer("voucher_amount").notNull(),
  description: text("description"),
  expirationDate: text("expiration_date"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const insertVoucherSchema = createInsertSchema(voucherTable)
export const updateVoucherSchema = createUpdateSchema(voucherTable)

export type SelectVoucher = typeof voucherTable.$inferSelect
