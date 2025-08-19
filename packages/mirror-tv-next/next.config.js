// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

/** @type {import('next').NextConfig} */
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
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'v3-statics.mirrormedia.mg',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'v3-statics-dev.mirrormedia.mg',
        pathname: '**',
      },
    ],
  },
  output: 'standalone',
  experimental: {
    scriptLoader: {
      '/story/:slug': [
        {
          innerHTML: `
            (function(d,a,b,l,e,_) {
              d[b] = d[b] || function () {
                (d[b].q = d[b].q || []).push(arguments)
              }
              e = a.createElement(l)
              e.async = 1
              e.charset = 'utf-8'
              e.src = '//static.dable.io/dist/plugin.min.js'
              _ = a.getElementsByTagName(l)[0]
              _.parentNode.insertBefore(e, _)
            })(window, document, 'dable', 'script')
            dable('setService', 'mnews.tw')
            dable('renderWidgetByWidth', 'dablewidget_2Xnxwk7d_xXAWmB7G')
          `,
          strategy: 'afterInteractive',
          id: 'dable',
        },
        {
          innerHTML: `
            (function() {
              var pa = document.createElement('script')
              pa.type = 'text/javascript'
              pa.charset = 'utf-8'
              pa.async = true
              pa.src = window.location.protocol + '//api.popin.cc/searchbox/mnews.js'
              var s = document.getElementsByTagName('script')[0]
              s.parentNode.insertBefore(pa, s)
            })()
          `,
          strategy: 'afterInteractive',
          id: 'popinAd',
        },
      ],
    },
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
}

module.exports = nextConfig
