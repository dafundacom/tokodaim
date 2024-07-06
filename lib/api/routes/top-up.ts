import { TRPCError } from "@trpc/server"
import { count, eq, sql } from "drizzle-orm"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "@/lib/api/trpc"
import { medias } from "@/lib/db/schema/media"
import { topUps, topUpTopUpProducts } from "@/lib/db/schema/top-up"
import { topUpProducts } from "@/lib/db/schema/top-up-product"
import { cuid, slugify } from "@/lib/utils"
import { createTopUpSchema, updateTopUpSchema } from "@/lib/validation/top-up"

export const topUpRouter = createTRPCRouter({
  all: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.query.topUps.findMany({
        orderBy: (topUps, { desc }) => [desc(topUps.featured)],
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
        const data = await ctx.db.query.topUps.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (topUps, { desc }) => [desc(topUps.featured)],
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
        const data = await ctx.db.query.topUps.findMany({
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (topUps, { asc }) => [asc(topUps.title)],
        })
        return data
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  byCategorySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.topUps.findMany({
          where: (topUps, { eq }) => eq(topUps.categorySlug, input),
          orderBy: (topUps, { desc }) => [desc(topUps.featured)],
        })
        return data
      } catch (error) {
        console.error("Error:", error)
      }
    }),
  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const topUpData = await ctx.db
        .select()
        .from(topUps)
        .leftJoin(medias, eq(medias.id, topUps.featuredImageId))
        .leftJoin(medias, eq(medias.id, topUps.coverImageId))
        .leftJoin(medias, eq(medias.id, topUps.guideImageId))
        .where(eq(topUps.id, input))
        .limit(1)

      const topUpsTopUpProductsData = await ctx.db
        .select({
          id: topUpProducts.id,
          name: topUpProducts.name,
        })
        .from(topUpTopUpProducts)
        .leftJoin(topUps, eq(topUpTopUpProducts.topUpId, topUps.id))
        .leftJoin(
          topUpProducts,
          eq(topUpTopUpProducts.topUpProductId, topUpProducts.id),
        )
        .where(eq(topUps.id, input))

      const data = topUpData.map((item) => ({
        ...item.top_ups,
        featuredImage: {
          id: item?.medias?.id,
          url: item?.medias?.url,
        },
        topUpProducts: topUpsTopUpProductsData,
      }))

      return data[0]
    }),
  bySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const topUpData = await ctx.db
        .select()
        .from(topUps)
        .leftJoin(medias, eq(medias.id, topUps.featuredImageId))
        .leftJoin(medias, eq(medias.id, topUps.coverImageId))
        .leftJoin(medias, eq(medias.id, topUps.guideImageId))
        .where(eq(topUps.slug, input))
        .limit(1)

      const topUpsTopUpProductsData = await ctx.db
        .select({
          id: topUpProducts.id,
          name: topUpProducts.name,
          sku: topUpProducts.sku,
          originalPrice: topUpProducts.originalPrice,
          price: topUpProducts.price,
        })
        .from(topUpTopUpProducts)
        .leftJoin(topUps, eq(topUpTopUpProducts.topUpId, topUps.id))
        .leftJoin(
          topUpProducts,
          eq(topUpTopUpProducts.topUpProductId, topUpProducts.id),
        )
        .where(eq(topUps.slug, input))

      const data = topUpData.map((item) => ({
        ...item.top_ups,
        featuredImage: {
          id: item?.medias?.id,
          url: item?.medias?.url,
        },
        topUpProducts: topUpsTopUpProductsData,
      }))

      return data[0]
    } catch (error) {
      console.error("Error:", error)
    }
  }),
  search: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.query.topUps.findMany({
        where: (topUps, { ilike, or }) =>
          or(
            ilike(topUps.title, `%${input}%`),
            ilike(topUps.slug, `%${input}%`),
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
      const data = await ctx.db.select({ value: count() }).from(topUps)

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
    .input(createTopUpSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = slugify(input.title)
        const categorySlug = slugify(input.category)
        const generatedMetaTitle = !input.metaTitle
          ? input.title
          : input.metaTitle
        const generatedMetaDescription = !input.metaDescription
          ? generatedMetaTitle
          : input.metaDescription

        const data = await ctx.db
          .insert(topUps)
          .values({
            ...input,
            id: cuid(),
            slug: slug,
            categorySlug: categorySlug,
            metaTitle: generatedMetaTitle,
            metaDescription: generatedMetaDescription,
          })
          .returning()

        const topUpProductValues = input.topUpProducts.map((topUpProduct) => ({
          topUpId: data[0].id,
          topUpProductId: topUpProduct,
        }))

        await ctx.db.insert(topUpTopUpProducts).values(topUpProductValues)

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
    .input(updateTopUpSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(topUps)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(topUps.id, input.id))
          .returning()

        await ctx.db
          .delete(topUpTopUpProducts)
          .where(eq(topUpTopUpProducts.topUpId, input.id))

        const topUpProductValues = input.topUpProducts.map((topUpProduct) => ({
          topUpId: data[0].id,
          topUpProductId: topUpProduct,
        }))

        await ctx.db.insert(topUpTopUpProducts).values(topUpProductValues)

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
  updateTransactions: publicProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .update(topUps)
          .set({
            transactions: sql`${topUps.transactions} + 1`,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(topUps.title, input))
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
})
