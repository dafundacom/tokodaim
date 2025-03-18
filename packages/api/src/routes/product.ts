import {
  count,
  eq,
  generateUniqueProductSlug,
  insertProductSchema,
  itemTable,
  productItemTable,
  productTable,
  sql,
  updateProductSchema,
} from "@tokodaim/db"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"

export const productRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.query.productTable.findMany({
        orderBy: (products, { desc }) => [desc(products.featured)],
      })
      return data
    } catch (error) {
      console.error("Error:", error)
    }
  }),

  sitemap: publicProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.productTable.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (products, { desc }) => [desc(products.featured)],
          columns: {
            slug: true,
            updatedAt: true,
          },
        })
        return data
      } catch (error) {
        console.error("Error:", error)
      }
    }),

  dashboard: adminProtectedProcedure
    .input(
      z.object({
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.productTable.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (products, { asc }) => [asc(products.title)],
        })
        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),

  byCategory: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.productTable.findMany({
          where: (products, { eq }) => eq(products.category, input),
          orderBy: (products, { desc }) => [desc(products.featured)],
        })
        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),

  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const productData = await ctx.db.query.productTable.findFirst({
          where: (product, { eq }) => eq(product.id, input),
        })

        if (productData) {
          const productItemsData = await ctx.db
            .select({
              id: itemTable.id,
              title: itemTable.title,
              sku: itemTable.sku,
              originalPrice: itemTable.originalPrice,
              price: itemTable.price,
            })
            .from(productItemTable)
            .leftJoin(
              productTable,
              eq(productItemTable.productId, productTable.id),
            )
            .leftJoin(itemTable, eq(productItemTable.itemId, itemTable.id))
            .where(eq(productTable.id, input))

          const data = {
            ...productData,
            items: productItemsData,
          }

          return data
        }
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),

  bySlug: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const productData = await ctx.db.query.productTable.findFirst({
          where: (product, { eq }) => eq(product.slug, input),
        })

        if (productData) {
          const productItemsData = await ctx.db
            .select({ id: itemTable.id, title: itemTable.title })
            .from(productItemTable)
            .leftJoin(
              productTable,
              eq(productItemTable.productId, productTable.id),
            )
            .leftJoin(itemTable, eq(productItemTable.itemId, itemTable.id))
            .where(eq(productTable.id, productData.id))

          const data = {
            ...productData,
            items: productItemsData,
          }

          return data
        }
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),

  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.query.productTable.findMany({
        where: (products, { ilike, or }) =>
          or(
            ilike(products.title, `%${input}%`),
            ilike(products.slug, `%${input}%`),
          ),
        limit: 10,
      })
      return data
    } catch (error) {
      console.error("Error:", error)
      if (error instanceof TRPCError) {
        throw error
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal error occurred",
        })
      }
    }
  }),

  count: adminProtectedProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.select({ value: count() }).from(productTable)
      return data[0].value
    } catch (error) {
      console.error("Error:", error)
      if (error instanceof TRPCError) {
        throw error
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An internal error occurred",
        })
      }
    }
  }),

  create: adminProtectedProcedure
    .input(insertProductSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = await generateUniqueProductSlug(input.title)
        const generatedMetaTitle = input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = input.metaDescription
          ? generatedMetaTitle
          : input.metaDescription

        const data = await ctx.db
          .insert(productTable)
          .values({
            ...input,
            slug: slug,
            metaTitle: generatedMetaTitle,
            metaDescription: generatedMetaDescription,
          })
          .returning()

        if (input.items) {
          const itemValues = input.items.map((item) => ({
            productId: data[0].id,
            itemId: item,
          }))

          await ctx.db.insert(productItemTable).values(itemValues)
        }

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),

  update: adminProtectedProcedure
    .input(updateProductSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Product ID is required",
          })
        }

        const data = await ctx.db
          .update(productTable)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(productTable.id, input.id))
          .returning()

        await ctx.db
          .delete(productItemTable)
          .where(eq(productItemTable.productId, input.id))

        // TODO: make sure not to insert duplicate items
        if (input.items) {
          const itemValues = input.items.map((item) => ({
            productId: data[0].id,
            itemId: item,
          }))

          await ctx.db.insert(productItemTable).values(itemValues)
        }

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),

  updateTransaction: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(productTable)
          .set({
            transactions: sql`${productTable.transactions} + 1`,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(productTable.title, input))
          .returning()
        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),

  delete: adminProtectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .delete(productTable)
          .where(eq(productTable.id, input))

        await ctx.db
          .delete(productItemTable)
          .where(eq(productItemTable.productId, input))

        return data
      } catch (error) {
        console.error("Error:", error)
        if (error instanceof TRPCError) {
          throw error
        } else {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "An internal error occurred",
          })
        }
      }
    }),
})
