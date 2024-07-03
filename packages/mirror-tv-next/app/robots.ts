import { MetadataRoute } from 'next'
import { ENV } from '~/constants/environment-variables'

export default function robots(): MetadataRoute.Robots {
  if (ENV !== 'prod') {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    }
  }
  return {
    rules: {
      userAgent: '*',
      disallow: '/',
    },
  }
}
