/** @type {import('next').NextConfig} */
const path = require('path')
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.mirrormedia.mg',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.mnews.tw',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'dev.mnews.tw',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'staging.mnews.tw',
        pathname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '~': path.resolve(__dirname, '.'),
    }
    return config
  },
}

module.exports = nextConfig
