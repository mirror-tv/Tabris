ARG NODE_VERSION=26-alpine

# Base image with pinned pnpm version
FROM node:${NODE_VERSION} AS base
RUN npm install -g pnpm@11.17

# Install dependencies in full monorepo context to keep pnpm-lock.yaml intact
FROM base AS deps
WORKDIR /monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/tv-ad-admin-next/package.json ./packages/tv-ad-admin-next/
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM deps AS builder

COPY packages/tv-ad-admin-next ./packages/tv-ad-admin-next
RUN pnpm --filter tv-ad-admin-next build

# Production image
# standalone output already includes all required node_modules — no install needed
FROM node:${NODE_VERSION} AS runner

RUN apk add --no-cache tini

WORKDIR /app

ENV NODE_ENV=production

# Copy standalone output — in a monorepo, Next.js preserves the full directory
# structure, so server.js lands at packages/tv-ad-admin-next/server.js
COPY --from=builder /monorepo/packages/tv-ad-admin-next/.next/standalone ./

# Static files and public must sit next to server.js
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /monorepo/packages/tv-ad-admin-next/.next/static ./packages/tv-ad-admin-next/.next/static
COPY --from=builder /monorepo/packages/tv-ad-admin-next/public ./packages/tv-ad-admin-next/public

WORKDIR /app/packages/tv-ad-admin-next

## Use tini to manage zombie processes and signal forwarding
## https://github.com/krallin/tini
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["node", "server.js"]
