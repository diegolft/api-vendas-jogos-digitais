# API NestJS — build com Bun, runtime enxuto
# Build: docker build -t api-vendas-jogos:latest .
# Run:   docker run --env-file .env -p 3000:3000 api-vendas-jogos:latest

FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:1-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV APP_PORT=3000

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY --from=builder /app/dist ./dist
COPY migrations ./migrations

RUN apk add --no-cache wget

RUN addgroup -g 1001 -S app && adduser -u 1001 -S app -G app
USER app

EXPOSE 3000

# Porta fixa no check; alinhe APP_PORT em runtime ou ajuste esta URL.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/check || exit 1

CMD ["bun", "run", "start:prod"]
