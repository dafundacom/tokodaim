import { TRPCError } from "@trpc/server"
import { count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { items } from "@/lib/db/schema"
import { productItems, products } from "@/lib/db/schema/product"
import { cuid } from "@/lib/utils"
import { generateUniqueProductSlug } from "@/lib/utils/slug"
import {
  createProductSchema,
  updateProductSchema,
} from "@/lib/validation/product"

export const productRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.query.products.findMany({
        with: {
          featuredImage: true,
        },
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
        const data = await ctx.db.query.products.findMany({
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
        const data = await ctx.db.query.products.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (products, { asc }) => [asc(products.title)],
          with: {
            featuredImage: true,
            coverImage: true,
            guideImage: true,
          },
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
        const data = await ctx.db.query.products.findMany({
          where: (products, { eq }) => eq(products.category, input),
          orderBy: (products, { desc }) => [desc(products.featured)],
          with: {
            featuredImage: true,
          },
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
        const productData = await ctx.db.query.products.findFirst({
          where: (product, { eq }) => eq(product.id, input),
          with: {
            featuredImage: true,
            coverImage: true,
            guideImage: true,
          },
        })

        if (productData) {
          const productItemsData = await ctx.db
            .select({
              id: items.id,
              title: items.title,
              sku: items.sku,
              price: items.price,
            })
            .from(productItems)
            .leftJoin(products, eq(productItems.productId, products.id))
            .leftJoin(items, eq(productItems.itemId, items.id))
            .where(eq(products.id, input))

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
        const productData = await ctx.db.query.products.findFirst({
          where: (product, { eq }) => eq(product.slug, input),
          with: {
            coverImage: true,
            featuredImage: true,
            guideImage: true,
          },
        })

        if (productData) {
          const productItemsData = await ctx.db
            .select({ id: items.id, title: items.title })
            .from(productItems)
            .leftJoin(products, eq(productItems.productId, products.id))
            .leftJoin(items, eq(productItems.itemId, items.id))
            .where(eq(products.id, productData.id!))

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
      const data = await ctx.db.query.products.findMany({
        where: (products, { ilike, or }) =>
          or(
            ilike(products.title, `%${input}%`),
            ilike(products.slug, `%${input}%`),
          ),
        with: {
          featuredImage: true,
        },
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
      const data = await ctx.db.select({ value: count() }).from(products)
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
    .input(createProductSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = await generateUniqueProductSlug(input.title)
        const generatedMetaTitle = !input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = !input.metaDescription
          ? generatedMetaTitle
          : input.metaDescription

        const data = await ctx.db
          .insert(products)
          .values({
            ...input,
            id: cuid(),
            slug: slug,
            metaTitle: generatedMetaTitle,
            metaDescription: generatedMetaDescription,
          })
          .returning()

        const itemValues = input.items.map((item) => ({
          productId: data[0].id,
          itemId: item,
        }))

        await ctx.db.insert(productItems).values(itemValues)

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
        const data = await ctx.db
          .update(products)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(products.id, input.id))
          .returning()

        await ctx.db
          .delete(productItems)
          .where(eq(productItems.productId, input.id))

        const itemValues = input.items.map((item) => ({
          productId: data[0].id,
          itemId: item,
        }))

        await ctx.db.insert(productItems).values(itemValues)

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
          .update(products)
          .set({
            transactions: sql`${products.transactions} + 1`,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(products.title, input))
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
        const data = await ctx.db.delete(products).where(eq(products.id, input))

        await ctx.db
          .delete(productItems)
          .where(eq(productItems.productId, input))

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
