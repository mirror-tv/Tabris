// 這裡管理的是在 Build 階段就會寫死數值的環境變數 (通常為 `NEXT_PUBLCI_` 開頭)
const ENV = process.env.NEXT_PUBLIC_ENV || 'local'
let SITE_URL: string
let GTM_ID: string
let GLOBAL_CACHE_SETTING: number
let YOUTUBE_API_URL: string
let GA4_ID: string
let STATIC_FILE_DOMAIN: string

switch (ENV) {
  case 'prod':
    SITE_URL = 'https://mnews.tw'
    YOUTUBE_API_URL = 'https://mnews.tw'
    STATIC_FILE_DOMAIN = 'storage.googleapis.com/static-mnews-tw-prod'
    GTM_ID = 'GTM-PK7VRFX'
    GLOBAL_CACHE_SETTING = 0
    GA4_ID = 'G-SZR4JRJ0G2'

    break

  case 'staging':
    SITE_URL = 'https://staging.mnews.tw'
    YOUTUBE_API_URL = 'https://staging.mnews.tw'
    STATIC_FILE_DOMAIN = 'storage.googleapis.com/static-mnews-tw-staging'
    GTM_ID = 'GTM-NFH6FDH'
    GLOBAL_CACHE_SETTING = 0
    GA4_ID = 'G-8Q9RVB3K0E'
    break

  case 'dev':
    SITE_URL = 'https://dev.mnews.tw'
    YOUTUBE_API_URL = 'https://dev.mnews.tw'
    STATIC_FILE_DOMAIN = 'storage.googleapis.com/static-mnews-tw-dev'
    GTM_ID = 'GTM-TVZ26W8'
    GLOBAL_CACHE_SETTING = 0
    GA4_ID = 'G-YZ07T9YJ6T'
    break

  default:
    SITE_URL = 'https://dev.mnews.tw'
    YOUTUBE_API_URL = 'https://dev.mnews.tw'
    STATIC_FILE_DOMAIN = 'storage.googleapis.com/static-mnews-tw-dev'
    GTM_ID = 'GTM-TVZ26W8'
    GLOBAL_CACHE_SETTING = 0
    GA4_ID = 'G-YZ07T9YJ6T'
    break
}

const bucketDomain = process.env.GCS_FUSE_STATIC_BUCKET ?? STATIC_FILE_DOMAIN
const JSON_BASE_URL = `https://${bucketDomain}`
const FEATURE_POSTS_FILE_NAME = 'category_features_news.json'
const POPULAR_POSTS_FILE_NAME = 'popularlist.json'
const HEADER_JSON_FILE_NAME = 'header_v2-1.json'

export {
  ENV,
  GLOBAL_CACHE_SETTING,
  GTM_ID,
  SITE_URL,
  YOUTUBE_API_URL,
  FEATURE_POSTS_FILE_NAME,
  POPULAR_POSTS_FILE_NAME,
  HEADER_JSON_FILE_NAME,
  GA4_ID,
  JSON_BASE_URL,
}
