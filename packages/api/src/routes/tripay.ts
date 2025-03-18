import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "../trpc"

export const TRIPAY_CLOSED_PAYMENT_CODE_TYPE = [
  "ALFAMART",
  "ALFAMIDI",
  "BNIVA",
  "BRIVA",
  "BSIVA",
  "CIMBVA",
  "DANA",
  "DANAMONVA",
  "INDOMARET",
  "MANDIRIVA",
  "MUAMALATVA",
  "OCBCVA",
  "OTHERBANKVA",
  "OVO",
  "PERMATAVA",
  "QRIS",
  "QRIS2",
  "QRISC",
  "QRIS_SHOPPEEPAY",
  "SHOPEEPAY",
] as const

const TRIPAY_OPEN_PAYMENT_CODE_TYPE = [
  "BNIVAOP",
  "HANAVAOP",
  "DANAMONOP",
  "CIMBVAOP",
  "BRIVAOP",
  "QRISOP",
  "QRISCOP",
  "BSIVAOP",
] as const

const TRIPAY_PAYMENT_STATUS = [
  "unpaid",
  "paid",
  "failed",
  "expired",
  "error",
  "refunded",
] as const

export const tripayClosedPaymentCodeType = z.enum(
  TRIPAY_CLOSED_PAYMENT_CODE_TYPE,
)

export const tripayOpenPaymentCodeType = z.enum(TRIPAY_OPEN_PAYMENT_CODE_TYPE)

export const tripayPaymentStatus = z.enum(TRIPAY_PAYMENT_STATUS)

export const tripayRouter = createTRPCRouter({
  instruction: publicProcedure
    .input(
      z.object({
        code: tripayClosedPaymentCodeType,
        payCode: z.string().optional(),
        amount: z.number().optional(),
        allowHtml: z.boolean(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const res = await ctx.tripay.instruction({
          code: input.code,
          pay_code: input.payCode,
          amount: input.amount,
          allow_html: input.allowHtml,
        })

        const { data } = res

        if (res.success) {
          return data
        } else {
          console.error("Error:", res.message)
          return undefined
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }),

  paymentChannel: publicProcedure.query(async ({ ctx }) => {
    try {
      const paymentChannel = await ctx.tripay.paymentChannel()
      if (Array.isArray(paymentChannel.data)) {
        const eWallet = paymentChannel.data.filter((data) =>
          data.group.includes("E-Wallet"),
        )

        const virtualAccount = paymentChannel.data.filter((data) =>
          data.group.includes("Virtual Account"),
        )

        const convenienceShop = paymentChannel.data.filter((data) =>
          data.group.includes("Convenience Store"),
        )

        const data = {
          eWallet,
          virtualAccount,
          convenienceShop,
        }

        return data
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }),

  feeCalculator: publicProcedure
    .input(
      z.object({
        code: tripayClosedPaymentCodeType,
        amount: z.number(),
      }),
    )
    .query(async ({ input, ctx }) => {
      try {
        const res = await ctx.tripay.feeCalculator({
          code: input.code,
          amount: input.amount,
        })

        const { data } = res

        if (res.success) {
          return data[0]
        } else {
          console.error("Error:", res.message)
          return undefined
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }),

  closedTransactionList: publicProcedure
    .input(z.object({ page: z.number(), per_page: z.number() }))
    .query(async ({ input, ctx }) => {
      try {
        const res = await ctx.tripay.transactions({
          page: input.page,
          per_page: input.per_page,
        })

        const { data } = res

        if (res.success) {
          return data
        } else {
          console.error("Error:", res.message)
          return undefined
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }),

  openTransactionList: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const res = await ctx.tripay.openTransactions(input)

        const { data } = res

        if (res.success) {
          return data
        } else {
          console.error("Error:", res.message)
          return undefined
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }),

  createClosedTransaction: publicProcedure
    .input(
      z.object({
        paymentMethod: tripayClosedPaymentCodeType,
        merchantRef: z.string(),
        amount: z.number(),
        customerName: z.string(),
        customerEmail: z.string(),
        customerPhone: z.string(),
        orderItems: z
          .object({
            sku: z.string(),
            name: z.string(),
            price: z.number(),
            quantity: z.number(),
            subtotal: z.number(),
            product_url: z.string(),
            image_url: z.string(),
          })
          .array(),
        callbackUrl: z.string(),
        returnUrl: z.string(),
        expiredTime: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const res = await ctx.tripay.createClosedTransaction({
          method: input.paymentMethod,
          merchant_ref: input.merchantRef,
          amount: input.amount,
          customer_name: input.customerName,
          customer_email: input.customerEmail,
          customer_phone: input.customerPhone,
          order_items: input.orderItems,
          callback_url: input.callbackUrl,
          return_url: input.returnUrl,
          expired_time: input.expiredTime,
        })

        const { data } = res

        if (res.success) {
          return data
        } else {
          console.error("Error:", res.message)
          return undefined
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }),

  createOpenTransaction: publicProcedure
    .input(
      z.object({
        paymentMethod: tripayOpenPaymentCodeType,
        merchantRef: z.string(),
        customerName: z.string(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const res = await ctx.tripay.createOpenTransaction({
          method: input.paymentMethod,
          merchant_ref: input.merchantRef,
          customer_name: input.customerName,
        })

        const { data } = res

        if (res.success) {
          return data
        } else {
          console.error("Error:", res.message)
          return undefined
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }),

  closedTransactionDetail: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const res = await ctx.tripay.closedTransactionDetail(input)

        const { data } = res

        if (res.success) {
          return data
        } else {
          console.error("Error:", res.message)
          return undefined
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }),

  openTransactionDetail: publicProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      try {
        const res = await ctx.tripay.openTransactionDetail(input)

        const { data } = res

        if (res.success) {
          return data
        } else {
          console.error("Error:", res.message)
          return undefined
        }
      } catch (error) {
        console.error("Error:", error)
      }
    }),
})
