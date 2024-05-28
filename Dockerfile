#INSTALLER
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat
RUN apk update

WORKDIR /app
RUN npm install --global pnpm
COPY . .

RUN pnpm install --frozen-lockfile

ENV NEXT_TELEMETRY_DISABLED 1

# RUN npm run db:migrate
RUN npm run build

# RUNNER
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --chown=nextjs:nodejs --from=builder /app/ ./

USER nextjs

ENV PORT 3000

CMD ["npm", "run","start"]
