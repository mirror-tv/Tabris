// 這裡管理的是在 Build 階段就會寫死數值的環境變數 (通常為 `NEXT_PUBLCI_` 開頭)
const ENV = process.env.NEXT_PUBLIC_ENV || 'local'
let SITE_URL: string
let GTM_ID: string
let GLOBAL_CACHE_SETTING: number
let YOUTUBE_API_URL: string
let GA4_ID: string
let JSON_BASE_URL: string
let WEATHER_JSON_URL: string
let SCHEDULE_JSON_URL: string

const TIMESTAMP_FOR_CACHE = '?t=' + Date.now() / 10

switch (ENV) {
  case 'prod':
    SITE_URL = 'https://mnews.tw'
    YOUTUBE_API_URL = 'https://mnews.tw'
    JSON_BASE_URL =
      'https://storage.googleapis.com/v2-static-mnews-tw-prod/json'
    GTM_ID = 'GTM-PK7VRFX'
    GLOBAL_CACHE_SETTING = 0
    GA4_ID = 'G-SZR4JRJ0G2'
    SCHEDULE_JSON_URL = `https://storage.googleapis.com/v2-static-mnews-tw-prod/files/documents/tv-schedule.json`
    break
  case 'prod-k6':
    SITE_URL = 'https://mnews.tw'
    YOUTUBE_API_URL = 'https://v3.mnews.tw'
    JSON_BASE_URL =
      'https://storage.googleapis.com/v2-static-mnews-tw-prod/json'
    GTM_ID = 'GTM-PK7VRFX'
    GLOBAL_CACHE_SETTING = 0
    GA4_ID = 'G-SZR4JRJ0G2'
    SCHEDULE_JSON_URL = `https://storage.googleapis.com/v2-static-mnews-tw-prod/files/documents/tv-schedule.json`
    break

  case 'staging':
    SITE_URL = 'https://staging.mnews.tw'
    YOUTUBE_API_URL = 'https://staging.mnews.tw'
    JSON_BASE_URL =
      'https://storage.googleapis.com/v2-static-mnews-tw-staging/json'
    GTM_ID = 'GTM-NFH6FDH'
    GLOBAL_CACHE_SETTING = 0
    GA4_ID = 'G-8Q9RVB3K0E'
    SCHEDULE_JSON_URL = `https://storage.googleapis.com/v2-static-mnews-tw-staging/files/documents/tv-schedule.json`
    break

  case 'staging-k6':
    SITE_URL = 'https://staging.mnews.tw'
    YOUTUBE_API_URL =
      'https://yt-relay-tv-staging-439405143478.asia-east1.run.app'
    JSON_BASE_URL =
      'https://storage.googleapis.com/v2-static-mnews-tw-staging/json'
    GTM_ID = 'GTM-NFH6FDH'
    GLOBAL_CACHE_SETTING = 0
    GA4_ID = 'G-8Q9RVB3K0E'
    SCHEDULE_JSON_URL = `https://storage.googleapis.com/v2-static-mnews-tw-staging/files/documents/tv-schedule.json`
    break

  case 'dev':
    SITE_URL = 'https://dev.mnews.tw'
    YOUTUBE_API_URL = 'https://yt-relay-tv-dev-439405143478.asia-east1.run.app'
    JSON_BASE_URL = 'https://storage.googleapis.com/v2-static-mnews-tw-dev/json'
    WEATHER_JSON_URL = `${JSON_BASE_URL}/weather.json`
    GTM_ID = 'GTM-TVZ26W8'
    GLOBAL_CACHE_SETTING = 0
    GA4_ID = 'G-YZ07T9YJ6T'
    SCHEDULE_JSON_URL = `https://storage.googleapis.com/v2-static-mnews-tw-dev/files/documents/tv-schedule.json`
    break

  case 'dev-k6':
    SITE_URL = 'https://dev.mnews.tw'
    YOUTUBE_API_URL = 'https://yt-relay-tv-dev-439405143478.asia-east1.run.app'
    JSON_BASE_URL = 'https://storage.googleapis.com/v2-static-mnews-tw-dev/json'
    WEATHER_JSON_URL = `${JSON_BASE_URL}/weather.json`
    GTM_ID = 'GTM-TVZ26W8'
    GLOBAL_CACHE_SETTING = 0
    GA4_ID = 'G-YZ07T9YJ6T'
    SCHEDULE_JSON_URL = `https://storage.googleapis.com/v2-static-mnews-tw-dev/files/documents/tv-schedule.json`
    break

  default:
    SITE_URL = 'https://dev.mnews.tw'
    YOUTUBE_API_URL = 'https://yt-relay-tv-dev-439405143478.asia-east1.run.app'
    JSON_BASE_URL = 'https://storage.googleapis.com/v2-static-mnews-tw-dev/json'
    GTM_ID = 'GTM-TVZ26W8'
    GLOBAL_CACHE_SETTING = 0
    GA4_ID = 'G-YZ07T9YJ6T'
    SCHEDULE_JSON_URL = `https://storage.googleapis.com/v2-static-mnews-tw-dev/files/documents/tv-schedule.json`
    break
}

const HOMEPAGE_TOPIC_JSON_URL = `${JSON_BASE_URL}/topic.json`
const HOMEPAGE_VIDEO_JSON_URL = `${JSON_BASE_URL}/video.json${TIMESTAMP_FOR_CACHE}`
WEATHER_JSON_URL = `${JSON_BASE_URL}/weather.json`
const POPULAR_POSTS_URL = `${JSON_BASE_URL}/popularlist.json`
const POPULAR_VIDEOS_JSON_URL = `${JSON_BASE_URL}/popular-videonews-list.json`
const FEATURE_POSTS_URL = `${JSON_BASE_URL}/featured_categories_news.json`
const HEADER_JSON_URL = `${JSON_BASE_URL}/header.json`
const FLASH_NEWS_JSON_URL = `${JSON_BASE_URL}/flash_news.json`

export {
  ENV,
  FLASH_NEWS_JSON_URL,
  GLOBAL_CACHE_SETTING,
  GTM_ID,
  HEADER_JSON_URL,
  SCHEDULE_JSON_URL,
  SITE_URL,
  POPULAR_POSTS_URL,
  POPULAR_VIDEOS_JSON_URL,
  YOUTUBE_API_URL,
  FEATURE_POSTS_URL,
  GA4_ID,
  JSON_BASE_URL,
  WEATHER_JSON_URL,
  HOMEPAGE_TOPIC_JSON_URL,
  HOMEPAGE_VIDEO_JSON_URL,
}
