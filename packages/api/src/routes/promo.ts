import {
  and,
  count,
  eq,
  generateUniquePromoSlug,
  insertPromoSchema,
  languageType,
  promoTable,
  promoTranslationTable,
  sql,
  translatePromoSchema,
  updatePromoSchema,
} from "@tokodaim/db"
import { createId } from "@tokodaim/utils"
import { TRPCError } from "@trpc/server"
import { z } from "zod"

import {
  adminProtectedProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../trpc"
import { trimText } from "../utils/text"

export const promoRouter = createTRPCRouter({
  promoTranslationById: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const promoTranslationData =
          await ctx.db.query.promoTranslationTable.findFirst({
            where: (promoTranslations, { eq }) =>
              eq(promoTranslations.id, input),
            with: {
              promos: {
                columns: {
                  id: true,
                  title: true,
                  language: true,
                  featuredImage: true,
                },
              },
            },
          })

        const promoData = promoTranslationData?.promos.map((item) => ({
          ...item,
        }))

        const data = {
          ...promoTranslationData,
          promos: promoData,
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
  byId: adminProtectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.promoTable.findFirst({
          where: (promos, { eq }) => eq(promos.id, input),
        })

        return data
      } catch (error) {
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
  bySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    try {
      const data = await ctx.db.query.promoTable.findFirst({
        where: (promos, { eq }) => eq(promos.slug, input),
      })

      return data
    } catch (error) {
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
  byLanguage: publicProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.promoTable.findMany({
          where: (promos, { eq, and }) =>
            and(
              eq(promos.language, input.language),
              eq(promos.status, "published"),
            ),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (promos, { desc }) => [desc(promos.updatedAt)],
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
  byLanguageInfinite: publicProcedure
    .input(
      z.object({
        language: languageType,
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.date().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const data = await ctx.db.query.promoTable.findMany({
          where: (promos, { eq, and, lt }) =>
            and(
              eq(promos.language, input.language),
              eq(promos.status, "published"),
              input.cursor
                ? lt(promos.updatedAt, new Date(input.cursor))
                : undefined,
            ),
          limit: limit + 1,
          orderBy: (promos, { desc }) => [desc(promos.updatedAt)],
        })

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          promos: data,
          nextCursor,
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
  relatedInfinite: publicProcedure
    .input(
      z.object({
        brand: z.string(),
        currentPromoId: z.string(),
        language: languageType,
        limit: z.number().min(1).max(100).nullable(),
        cursor: z.date().optional().nullable(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const limit = input.limit ?? 50

        const promos = await ctx.db.query.promoTable.findMany({
          where: (promos, { eq, and, not, lt }) =>
            and(
              eq(promos.language, input.language),
              eq(promos.status, "published"),
              input.cursor
                ? lt(promos.updatedAt, new Date(input.cursor))
                : undefined,
              not(eq(promos.id, input.currentPromoId)),
            ),
          limit: limit + 1,
          orderBy: (promos, { desc }) => [desc(promos.updatedAt)],
        })

        const data = promos.filter((promo) => promo.brand === input.brand)

        let nextCursor: Date | undefined = undefined

        if (data.length > limit) {
          const nextItem = data.pop()
          if (nextItem?.updatedAt) {
            nextCursor = nextItem.updatedAt
          }
        }

        return {
          promos: data,
          nextCursor,
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
  dashboard: adminProtectedProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.promoTable.findMany({
          where: (promos, { eq }) => eq(promos.language, input.language),
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (promos, { desc }) => [desc(promos.updatedAt)],
          with: {
            promoTranslation: {
              columns: {
                id: true,
              },
              with: {
                promos: {
                  columns: {
                    id: true,
                    title: true,
                    language: true,
                  },
                },
              },
            },
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
  sitemap: publicProcedure
    .input(
      z.object({
        language: languageType,
        page: z.number(),
        perPage: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.promoTable.findMany({
          where: (promos, { eq, and }) =>
            and(
              eq(promos.language, input.language),
              eq(promos.status, "published"),
            ),
          columns: {
            slug: true,
            updatedAt: true,
          },
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          orderBy: (promos, { desc }) => [desc(promos.id)],
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
  featured: publicProcedure.query(async ({ ctx }) => {
    const data = await ctx.db.query.promoTable.findMany({
      where: (promos, { eq }) => eq(promos.featured, true),
      limit: 10,
    })

    return data
  }),
  count: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db
        .select({ value: count() })
        .from(promoTable)
        .where(and(eq(promoTable.status, "published")))

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
  countDashboard: publicProcedure.query(async ({ ctx }) => {
    try {
      const data = await ctx.db.select({ value: count() }).from(promoTable)

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
  countByLanguage: publicProcedure
    .input(languageType)
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db
          .select({ values: count() })
          .from(promoTable)
          .where(
            and(
              eq(promoTable.language, input),
              eq(promoTable.status, "published"),
            ),
          )

        return data[0].values
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
  search: publicProcedure
    .input(z.object({ language: languageType, searchQuery: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.promoTable.findMany({
          where: (promos, { eq, and, or, ilike }) =>
            and(
              eq(promos.language, input.language),
              eq(promos.status, "published"),
              or(
                ilike(promos.title, `%${input.searchQuery}%`),
                ilike(promos.slug, `%${input.searchQuery}%`),
              ),
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
  searchDashboard: publicProcedure
    .input(z.object({ language: languageType, searchQuery: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const data = await ctx.db.query.promoTable.findMany({
          where: (promos, { eq, and, or, ilike }) =>
            and(
              eq(promos.language, input.language),
              or(
                ilike(promos.title, `%${input.searchQuery}%`),
                ilike(promos.slug, `%${input.searchQuery}%`),
              ),
            ),
          with: {
            promoTranslation: {
              with: {
                promos: true,
              },
            },
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
  create: adminProtectedProcedure
    .input(insertPromoSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = await generateUniquePromoSlug(input.title)
        const generatedExcerpt = !input.excerpt
          ? trimText(input.content, 160)
          : input.excerpt
        const generatedMetaTitle = input.title || input.metaTitle
        const generatedMetaDescription =
          generatedExcerpt || input.metaDescription

        const promoTranslation = await ctx.db
          .insert(promoTranslationTable)
          .values({
            id: createId(),
          })
          .returning()

        const data = await ctx.db
          .insert(promoTable)
          .values({
            ...input,
            slug: slug,
            excerpt: generatedExcerpt,
            metaTitle: generatedMetaTitle,
            metaDescription: generatedMetaDescription,
            promoTranslationId: promoTranslation[0].id,
          })
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
  update: adminProtectedProcedure
    .input(updatePromoSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Promo ID is required",
          })
        }

        const data = await ctx.db
          .update(promoTable)
          .set({
            ...input,
            updatedAt: sql`CURRENT_TIMESTAMP`,
          })
          .where(eq(promoTable.id, input.id))
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
  updateWithoutChangeUpdatedDate: adminProtectedProcedure
    .input(updatePromoSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        if (!input.id) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Promo ID is required",
          })
        }

        const data = await ctx.db
          .update(promoTable)
          .set({
            ...input,
          })
          .where(eq(promoTable.id, input.id))
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
  translate: adminProtectedProcedure
    .input(translatePromoSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const slug = await generateUniquePromoSlug(input.title)
        const generatedExcerpt = !input.excerpt
          ? trimText(input.content, 160)
          : input.excerpt
        const generatedMetaTitle = input.title || input.metaTitle
        const generatedMetaDescription =
          generatedExcerpt || input.metaDescription

        const data = await ctx.db
          .insert(promoTable)
          .values({
            ...input,
            slug: slug,
            excerpt: generatedExcerpt,
            metaTitle: generatedMetaTitle,
            metaDescription: generatedMetaDescription,
          })
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
        const promo = await ctx.db.query.promoTable.findFirst({
          where: (promo, { eq }) => eq(promo.id, input),
        })

        if (promo) {
          const checkIfPromoTranslationHasPromo =
            await ctx.db.query.promoTranslationTable.findMany({
              where: (promoTranslations, { eq }) =>
                eq(promoTranslations.id, promo.promoTranslationId),
              with: {
                promos: true,
              },
            })

          if (checkIfPromoTranslationHasPromo[0]?.promos.length === 1) {
            const data = await ctx.db
              .delete(promoTranslationTable)
              .where(eq(promoTranslationTable.id, promo.promoTranslationId))

            return data
          } else {
            const data = await ctx.db
              .delete(promoTable)
              .where(eq(promoTable.id, input))

            return data
          }
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
})
