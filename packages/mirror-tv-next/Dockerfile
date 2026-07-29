ARG NODE_VERSION=26-alpine

# Base image with pinned pnpm version
FROM node:${NODE_VERSION} AS base
RUN npm install -g pnpm@11.17

# Install dependencies in full monorepo context to keep pnpm-lock.yaml intact
FROM base AS deps
WORKDIR /monorepo
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/mirror-tv-next/package.json ./packages/mirror-tv-next/
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM deps AS builder

COPY packages/mirror-tv-next ./packages/mirror-tv-next
RUN pnpm --filter mirror-tv-next build

# Production image
# standalone output already includes all required node_modules — no install needed
FROM node:${NODE_VERSION} AS runner

RUN apk add --no-cache tini bash

WORKDIR /app

ENV NODE_ENV=production

# Copy standalone output — in a monorepo, Next.js preserves the full directory
# structure, so server.js lands at packages/mirror-tv-next/server.js
COPY --from=builder /monorepo/packages/mirror-tv-next/.next/standalone ./

# Static files and public must sit next to server.js
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /monorepo/packages/mirror-tv-next/.next/static ./packages/mirror-tv-next/.next/static
COPY --from=builder /monorepo/packages/mirror-tv-next/public ./packages/mirror-tv-next/public

# Copy run script and AMP proxy into the same directory as server.js
COPY --from=builder /monorepo/packages/mirror-tv-next/run.sh ./packages/mirror-tv-next/
COPY --from=builder /monorepo/packages/mirror-tv-next/amp-proxy-server.js ./packages/mirror-tv-next/

WORKDIR /app/packages/mirror-tv-next

# Install runtime dependencies for amp-proxy-server.js
# Next.js standalone tracing does not cover non-Next.js entry points.
COPY --from=builder /monorepo/packages/mirror-tv-next/package.json ./
RUN npm install --omit=dev

RUN chmod +x run.sh

## Use tini to manage zombie processes and signal forwarding
## https://github.com/krallin/tini
ENTRYPOINT ["/sbin/tini", "--"]

CMD ["/app/packages/mirror-tv-next/run.sh"]
