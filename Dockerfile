FROM node:24.3.0-alpine AS builder

WORKDIR /app

COPY . .

COPY package*.json ./

RUN npm install --force

RUN npm run build

FROM node:24.3.0-alpine AS production

WORKDIR /app

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

LABEL org.opencontainers.image.source=https://github.com/coderx85/collaro

EXPOSE 3000

CMD ["npm","run","docker:run"]