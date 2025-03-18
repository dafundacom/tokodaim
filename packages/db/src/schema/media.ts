import { createId } from "@tokodaim/utils"
import { relations } from "drizzle-orm"
import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core"
import { createInsertSchema, createUpdateSchema } from "drizzle-zod"
import { z } from "zod"

import { userTable } from "./user"

export const MEDIA_TYPE = [
  "image",
  "audio",
  "video",
  "document",
  "other",
] as const

export const mediaType = z.enum(MEDIA_TYPE)

export const mediaTypeEnum = pgEnum("media_type", MEDIA_TYPE)

export const mediaTable = pgTable("medias", {
  id: text()
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull().unique(),
  url: text("url").notNull(),
  fileType: text("file_type").notNull(),
  type: mediaTypeEnum("type").notNull().default("image"),
  description: text("description"),
  authorId: text("author_id")
    .notNull()
    .references(() => userTable.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

export const mediaRelations = relations(mediaTable, ({ one }) => ({
  author: one(userTable, {
    fields: [mediaTable.authorId],
    references: [userTable.id],
  }),
}))

export const insertMediaSchema = createInsertSchema(mediaTable)
export const updateMediaSchema = createUpdateSchema(mediaTable)

export type SelectMedia = typeof mediaTable.$inferSelect

export type MediaType = z.infer<typeof mediaType>
