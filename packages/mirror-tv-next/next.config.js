// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { SITE_BASE_PATH } = require('./constants/site-base-path.cjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: SITE_BASE_PATH,
  reactStrictMode: false,
  output: 'standalone',
  // graphql ships dual CJS/ESM entry points (index.js / index.mjs). @apollo/client
  // is not transpiled, so its server bundle keeps a real runtime `import` of
  // 'graphql' that Node resolves to index.mjs — but Next's output file tracing
  // only picks up index.js, so standalone builds crash at request time with
  // "Cannot find module '.../graphql/index.mjs'". Force the .mjs files to be
  // traced into .next/standalone too.
  outputFileTracingIncludes: {
    '/**': ['../../node_modules/.pnpm/graphql@*/node_modules/graphql/**/*.mjs'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, must-revalidate',
          },
        ],
      },
      {
        source: '/tag/:name',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=600, must-revalidate',
          },
        ],
      },
      {
        source: '/show/:name',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=600, must-revalidate',
          },
        ],
      },
      {
        source: '/search/:keyword',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=600, must-revalidate',
          },
        ],
      },
      {
        source: '/category/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, must-revalidate',
          },
        ],
      },
      {
        source: '/category/video',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, must-revalidate',
          },
        ],
      },
    ]
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    })
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': path.resolve(__dirname),
    }
    return config
  },
  compiler: {
    styledComponents: true,
  },
  transpilePackages: ['graphql-tag', 'graphql'],
}

module.exports = nextConfig
