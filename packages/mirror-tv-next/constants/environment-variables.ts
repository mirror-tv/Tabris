// 這裡管理的是在 Build 階段就會寫死數值的環境變數 (通常為 `NEXT_PUBLCI_` 開頭)
const ENV = process.env.NEXT_PUBLIC_ENV || 'local'

let SITE_URL: string
let GTM_ID: string
let GLOBAL_CACHE_SETTING: number
let GA4_ID: string
let SCHEDULE_JSON_URL: string

switch (ENV) {
  case 'prod':
  case 'prod-k6':
    SITE_URL = 'https://mnews.tw'
    GTM_ID = 'GTM-PK7VRFX'
    GLOBAL_CACHE_SETTING = 0
    GA4_ID = 'G-SZR4JRJ0G2'
    SCHEDULE_JSON_URL =
      'https://storage.googleapis.com/v2-static-mnews-tw-prod/files/documents/tv-schedule.json'
    break

  case 'staging':
  case 'staging-k6':
    SITE_URL = 'https://staging.mnews.tw'
    GTM_ID = 'GTM-NFH6FDH'
    GLOBAL_CACHE_SETTING = 0
    GA4_ID = 'G-8Q9RVB3K0E'
    SCHEDULE_JSON_URL =
      'https://storage.googleapis.com/v2-static-mnews-tw-staging/files/documents/tv-schedule.json'
    break

  case 'dev':
  case 'dev-k6':
  default:
    SITE_URL = 'https://dev.mnews.tw'
    GTM_ID = 'GTM-TVZ26W8'
    GLOBAL_CACHE_SETTING = 0
    GA4_ID = 'G-YZ07T9YJ6T'
    SCHEDULE_JSON_URL =
      'https://storage.googleapis.com/v2-static-mnews-tw-dev/files/documents/tv-schedule.json'
    break
}

export {
  ENV,
  GLOBAL_CACHE_SETTING,
  GTM_ID,
  SCHEDULE_JSON_URL,
  SITE_URL,
  GA4_ID,
}
