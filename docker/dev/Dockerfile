FROM node:18.17.0-alpine AS base

FROM base AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY yarn.lock ./

COPY . .

COPY docker/dev/.env .env.production
RUN yarn 
RUN yarn build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 4001

ENV PORT 4001
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]