ARG NODE_VERSION=20-slim

# Base image with pinned pnpm version
FROM node:${NODE_VERSION} AS base
RUN npm install -g pnpm@11.17

# Install dependencies only when needed
FROM base AS deps
WORKDIR /next-app
COPY ["package.json", "pnpm-lock.yaml", "./"]
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /next-app
COPY --from=deps /next-app/node_modules ./node_modules
COPY . .
RUN pnpm build

# Production image
# standalone output already includes all required node_modules — no install needed
FROM node:${NODE_VERSION} AS runner

RUN set -e; \
    apt-get update -y && apt-get -y install tini; \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /next-app

ENV NODE_ENV=production

COPY --from=builder /next-app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /next-app/.next/standalone ./
COPY --from=builder /next-app/.next/static ./.next/static

## Use tini to manage zombie processes and signal forwarding
## https://github.com/krallin/tini
ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["node", "server.js"]
