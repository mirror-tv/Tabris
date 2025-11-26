ARG NODE_VERSION=20-slim

# Install dependencies only when needed
FROM node:${NODE_VERSION} AS deps
WORKDIR /next-app

# Install dependencies based on the preferred package manager
COPY ["package.json", "yarn.lock", "./"]
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:${NODE_VERSION} AS builder
WORKDIR /next-app
COPY --from=deps /next-app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_ENV
ARG NEXT_PUBLIC_SHOW_TV_AD_ADMIN_BANNER

ENV NEXT_PUBLIC_ENV=${NEXT_PUBLIC_ENV}
ENV NEXT_PUBLIC_SHOW_TV_AD_ADMIN_BANNER=${NEXT_PUBLIC_SHOW_TV_AD_ADMIN_BANNER}

RUN yarn build

# Production image, copy all the files and run next
FROM node:${NODE_VERSION} AS runner

RUN set -e; \
    apt-get update -y && apt-get -y install tini; \
    apt-get clean

WORKDIR /next-app

ENV NODE_ENV=production

COPY package.json yarn.lock /next-app/
RUN yarn install --frozen-lockfile --production

COPY --from=builder /next-app/run.sh ./
COPY --from=builder /next-app/amp-proxy-server.js ./

COPY --from=builder /next-app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /next-app/.next/standalone ./
COPY --from=builder /next-app/.next/static ./.next/static

RUN chmod +x run.sh

## Use tini to manage zombie processes and signal forwarding
## https://github.com/krallin/tini
ENTRYPOINT ["/usr/bin/tini", "--"]

CMD ["/next-app/run.sh"]
