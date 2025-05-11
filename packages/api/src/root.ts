import { digiflazzRouter } from "./routes/digiflazz"
import { itemRouter } from "./routes/item"
import { mediaRouter } from "./routes/media"
import { paymentRouter } from "./routes/payment"
import { paymentMethodRouter } from "./routes/payment-method"
import { productRouter } from "./routes/product"
import { promoRouter } from "./routes/promo"
import { transactionRouter } from "./routes/transaction"
import { tripayRouter } from "./routes/tripay"
import { userRouter } from "./routes/user"
import { voucherRouter } from "./routes/voucher"
import { createCallerFactory, createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  digiflazz: digiflazzRouter,
  item: itemRouter,
  media: mediaRouter,
  payment: paymentRouter,
  paymentMethod: paymentMethodRouter,
  product: productRouter,
  promo: promoRouter,
  transaction: transactionRouter,
  tripay: tripayRouter,
  user: userRouter,
  voucher: voucherRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
