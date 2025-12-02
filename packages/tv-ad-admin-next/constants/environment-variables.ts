// 環境變數分層管理系統
// 根據環境自動切換不同的 API endpoint 和配置

const ENV = process.env.NEXT_PUBLIC_ENV || 'local'
const GQL_ENDPOINT = process.env.GQL_ENDPOINT
const JWT_SECRET = process.env.JWT_SECRET

console.log('ENV', ENV)

// API Endpoints
let API_BASE_URL: string

let CMS_API_URL: string

// Cache Settings
const GLOBAL_CACHE_SETTING = 0

// Analytics & Tracking
let GTM_ID: string
let GA4_ID: string

switch (ENV) {
  case 'prod':
    API_BASE_URL = 'https://api.mnews.tw'
    CMS_API_URL = 'https://cms.mnews.tw/graphql'
    GTM_ID = 'GTM-PROD-ID'
    GA4_ID = 'G-SZR4JRJ0G2'
    break

  case 'staging':
    API_BASE_URL = 'https://api-staging.mnews.tw'
    CMS_API_URL = 'https://cms-staging.mnews.tw/graphql'
    GTM_ID = 'GTM-STAGING-ID'
    GA4_ID = 'G-8Q9RVB3K0E'
    break

  case 'dev':
    API_BASE_URL = 'https://api-dev.mnews.tw'
    CMS_API_URL = 'https://cms-dev.mnews.tw/graphql'
    GTM_ID = 'GTM-DEV-ID'
    GA4_ID = 'G-YZ07T9YJ6T'
    break

  default: // local
    API_BASE_URL = 'http://localhost:3000'
    CMS_API_URL = 'http://localhost:3000/cms/graphql'
    GTM_ID = 'GTM-LOCAL-ID'
    GA4_ID = 'G-YZ07T9YJ6T'
    break
}

console.log('API_BASE_URL', API_BASE_URL)
console.log('CMS_API_URL', CMS_API_URL)
console.log('GTM_ID', GTM_ID)
console.log('GA4_ID', GA4_ID)

export {
  ENV,
  API_BASE_URL,
  GQL_ENDPOINT,
  CMS_API_URL,
  GLOBAL_CACHE_SETTING,
  GTM_ID,
  GA4_ID,
  JWT_SECRET,
}
