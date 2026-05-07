// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
const SITE_BASE_PATH =
  process.env.NEXT_PUBLIC_IS_PREVIEW_MODE === 'true' ? '/preview-server' : ''

const mnewsImageHostnames = [
  'v3.mnews.tw',
  'www.mnews.tw',
  'staging.mnews.tw',
  'dev.mnews.tw',
  'storage.googleapis.com',
  'statics.mnews.tw',
  'statics-staging.mnews.tw',
  'statics-dev.mnews.tw',
]

const externalImageHostnames = [
  'www.mirrormedia.mg',
  'www.mirrormedia.com.tw',
  'v3-statics.mirrormedia.mg',
  'v3-statics-staging.mirrormedia.mg',
  'v3-statics-dev.mirrormedia.mg',
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: SITE_BASE_PATH,
  reactStrictMode: false,
  swcMinify: true,
  images: {
    remotePatterns: [...mnewsImageHostnames, ...externalImageHostnames].map(
      (hostname) => ({
        protocol: 'https',
        hostname,
        pathname: '/**',
      })
    ),
  },
  output: 'standalone',
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
}

module.exports = nextConfig
