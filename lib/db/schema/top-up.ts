import { boolean, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const topUps = pgTable("top_ups", {
  id: text("id").primaryKey(),
  brand: text("brand").notNull(),
  slug: text("slug").unique().notNull(),
  category: text("category").notNull(),
  categorySlug: text("categorySlug").notNull(),
  featuredImage: text("featured_image"),
  coverImage: text("cover_image"),
  guideImage: text("guide_image"),
  productIcon: text("product_icon"),
  description: text("description"),
  instruction: text("instruction"),
  featured: boolean("featured").notNull().default(false),
  orders: integer("orders").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export type InsertTopUps = typeof topUps.$inferInsert
export type SelectTopUps = typeof topUps.$inferSelect
