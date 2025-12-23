FROM node:20-slim AS base
WORKDIR /app
ENV NODE_ENV=production
ENV NPM_CONFIG_REGISTRY=https://registry.npmjs.org/
RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

FROM base AS install
WORKDIR /temp/dev
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# install with --production (exclude devDependencies)
FROM base AS prod-deps
WORKDIR /temp/prod
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

FROM base AS prerelease
WORKDIR /app
COPY --from=install /temp/dev/node_modules ./node_modules
COPY . .

FROM base AS build
WORKDIR /app
COPY --from=prerelease /app ./
ARG NEXT_PUBLIC_APP_URL
ARG DATABASE_URL
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV DATABASE_URL=$DATABASE_URL
RUN pnpm run build

FROM node:20-slim AS release
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /temp/prod/node_modules ./node_modules
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static/
COPY --from=build /app/public ./public
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="localhost"
ENV NETWORK="0.0.0.0"
CMD ["node", "server.js"]
