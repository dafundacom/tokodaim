import { adRouter } from "./routes/ad"
import { articleRouter } from "./routes/article"
import { articleCommentRouter } from "./routes/article-comment"
import { digiflazzRouter } from "./routes/digiflazz"
import { mediaRouter } from "./routes/media"
import { pageRouter } from "./routes/page"
import { promoRouter } from "./routes/promo"
import { settingRouter } from "./routes/setting"
import { topUpRouter } from "./routes/top-up"
import { topUpOrderRouter } from "./routes/top-up-order"
import { topUpPaymentRouter } from "./routes/top-up-payment"
import { topUpProductRouter } from "./routes/top-up-product"
import { topicRouter } from "./routes/topic"
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
  media: mediaRouter,
  page: pageRouter,
  promo: promoRouter,
  setting: settingRouter,
  topic: topicRouter,
  topUp: topUpRouter,
  topUpOrder: topUpOrderRouter,
  topUpPayment: topUpPaymentRouter,
  topUpProduct: topUpProductRouter,
  tripay: tripayRouter,
  user: userRouter,
  userLink: userLinkRouter,
  voucher: voucherRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
