import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core"

import { AD_POSITION, AD_TYPE } from "@/lib/validation/ad"

export const ads = pgTable("ads", {
  id: text("id").primaryKey(),
  title: text("title").unique().notNull(),
  content: text("content").notNull(),
  type: text("type", { enum: AD_TYPE }).notNull().default("plain_ad"),
  position: text("position", { enum: AD_POSITION })
    .notNull()
    .default("home_below_header"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export type InsertAd = typeof ads.$inferInsert
export type SelectAd = typeof ads.$inferSelect
