// 環境變數分層管理系統
// 根據環境自動切換不同的 API endpoint 和配置

const ENV = process.env.NEXT_PUBLIC_ENV || 'local'

// API Endpoints
let API_BASE_URL: string
let CMS_API_URL: string
const GQL_ENDPOINT =
  process.env.GQL_ENDPOINT || process.env.NEXT_PUBLIC_GQL_ENDPOINT

// Cache Settings
const GLOBAL_CACHE_SETTING = 0

// Analytics & Tracking
let GTM_ID: string
let GA4_ID: string

switch (ENV) {
  case 'prod':
    API_BASE_URL = 'https://api.mnews.tw'

    GTM_ID = 'GTM-PROD-ID'
    GA4_ID = 'G-PROD-ID'
    break

  case 'staging':
    API_BASE_URL = 'https://api-staging.mnews.tw'

    GTM_ID = 'GTM-STAGING-ID'
    GA4_ID = 'G-STAGING-ID'
    break

  case 'dev':
    API_BASE_URL = 'https://api-dev.mnews.tw'

    GTM_ID = 'GTM-DEV-ID'
    GA4_ID = 'G-DEV-ID'
    break

  default: // local
    API_BASE_URL = 'http://localhost:3000'
    GTM_ID = 'GTM-LOCAL-ID'
    GA4_ID = 'G-LOCAL-ID'
    break
}

export {
  ENV,
  API_BASE_URL,
  GQL_ENDPOINT,
  CMS_API_URL,
  GLOBAL_CACHE_SETTING,
  GTM_ID,
  GA4_ID,
}
