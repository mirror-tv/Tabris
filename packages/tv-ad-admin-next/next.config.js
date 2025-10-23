/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [],
  },
  webpack: (config) => {
    // Exclude SVGs from Next.js' default file loader
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    )
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/
    }
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgo: true, // Enable optimization but with safe defaults
            titleProp: true, // Allow dynamic titles
            ref: true, // Allow refs for animations or focus
          },
        },
      ],
    })
    return config
  },
}

module.exports = nextConfig
