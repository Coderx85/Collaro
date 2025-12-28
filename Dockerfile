FROM node:23-alpine AS base

# Required for some native modules on Alpine
RUN apk add --no-cache libc6-compat

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
ENV NODE_ENV=production
ENV NPM_CONFIG_REGISTRY=https://registry.npmjs.org/
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

FROM base AS deps
ENV HUSKY=0
ENV SKIP_HUSKY=1

# Copy package files only to cache deps layer
COPY package.json pnpm-lock.yaml .npmrc* ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Ensure standalone output is generated
ENV NEXT_PRIVATE_STANDALONE=true
ARG NEXT_PUBLIC_APP_URL
ARG DATABASE_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV DATABASE_URL=$DATABASE_URL
RUN corepack enable pnpm && pnpm run build

FROM node:23-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Fix permissions: remove write where not needed and add execute where required
# Ensure .next cache exists and is owned by nextjs so server can write runtime cache
RUN mkdir -p .next/cache && \
    chown -R nextjs:nodejs .next /app && \
    chmod -R u+rwX .next && chmod -R u+rwX .next/cache && \
    chmod -R a-w+x . && chmod -R a+x .next node_modules

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
