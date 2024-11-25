import { adRouter } from "./routes/ad"
import { articleRouter } from "./routes/article"
import { articleCommentRouter } from "./routes/article-comment"
import { digiflazzRouter } from "./routes/digiflazz"
import { itemRouter } from "./routes/item"
import { mediaRouter } from "./routes/media"
import { pageRouter } from "./routes/page"
import { paymentRouter } from "./routes/payment"
import { paymentMethodRouter } from "./routes/payment-method"
import { productRouter } from "./routes/product"
import { promoRouter } from "./routes/promo"
import { settingRouter } from "./routes/setting"
import { topicRouter } from "./routes/topic"
import { transactionRouter } from "./routes/transaction"
import { tripayRouter } from "./routes/tripay"
import { userRouter } from "./routes/user"
import { userLinkRouter } from "./routes/user-link"
import { voucherRouter } from "./routes/voucher"
import { createCallerFactory, createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  ad: adRouter,
  article: articleRouter,
  articleComment: articleCommentRouter,
  digiflazz: digiflazzRouter,
  item: itemRouter,
  media: mediaRouter,
  page: pageRouter,
  payment: paymentRouter,
  paymentMethod: paymentMethodRouter,
  product: productRouter,
  promo: promoRouter,
  setting: settingRouter,
  topic: topicRouter,
  transaction: transactionRouter,
  tripay: tripayRouter,
  user: userRouter,
  userLink: userLinkRouter,
  voucher: voucherRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
