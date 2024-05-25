import { adRouter } from "./routes/ad"
import { articleRouter } from "./routes/article"
import { articleCommentRouter } from "./routes/article-comment"
import { mediaRouter } from "./routes/media"
import { paymentRouter } from "./routes/payment"
import { promoRouter } from "./routes/promo"
import { settingRouter } from "./routes/setting"
import { topUpRouter } from "./routes/top-up"
import { topUpOrderRouter } from "./routes/top-up-order"
import { topUpProductRouter } from "./routes/top-up-product"
import { topicRouter } from "./routes/topic"
import { userRouter } from "./routes/user"
import { userLinkRouter } from "./routes/user-link"
import { voucherRouter } from "./routes/voucher"
import { createCallerFactory, createTRPCRouter } from "./trpc"

export const appRouter = createTRPCRouter({
  ad: adRouter,
  article: articleRouter,
  articleComment: articleCommentRouter,
  media: mediaRouter,
  payment: paymentRouter,
  promo: promoRouter,
  setting: settingRouter,
  topic: topicRouter,
  topUp: topUpRouter,
  topUpOrder: topUpOrderRouter,
  topUpProduct: topUpProductRouter,
  user: userRouter,
  userLink: userLinkRouter,
  voucher: voucherRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)
