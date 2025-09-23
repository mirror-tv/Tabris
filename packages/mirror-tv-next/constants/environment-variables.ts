// 這裡管理的是在 Build 階段就會寫死數值的環境變數 (通常為 `NEXT_PUBLCI_` 開頭)
const ENV = process.env.NEXT_PUBLIC_ENV || 'local'
let SITE_URL: string
let GTM_ID: string
let GLOBAL_CACHE_SETTING: number
let HEADER_JSON_URL: string
let FLASH_NEWS_JSON_URL: string
let SCHEDULE_JSON_URL: string
let POPULAR_POSTS_URL: string
let POPULAR_VIDEOS_JSON_URL: string
let YOUTUBE_API_URL: string
let FEATURE_POSTS_URL: string
let HOMEPAGE_JSON_URL: string =
  'https://storage.googleapis.com/static-mnews-tw-dev/files/json/topic_video.json'
let GA4_ID: string

switch (ENV) {
  case 'prod':
    SITE_URL = 'https://mnews.tw'
    YOUTUBE_API_URL = 'https://mnews.tw'
    GTM_ID = 'GTM-PK7VRFX'
    GLOBAL_CACHE_SETTING = 0
    HEADER_JSON_URL = `${SITE_URL}/json/header_v2-1.json`
    FLASH_NEWS_JSON_URL = `${SITE_URL}/json/flash_news.json`
    SCHEDULE_JSON_URL = `${SITE_URL}/json/tv-schedule.json`
    POPULAR_POSTS_URL = `${SITE_URL}/json/popularlist.json`
    POPULAR_VIDEOS_JSON_URL = `${SITE_URL}/json/popular-videonews-list.json`
    FEATURE_POSTS_URL = `${SITE_URL}/json/category_features_news.json`
    HOMEPAGE_JSON_URL =
      'https://storage.googleapis.com/static-mnews-tw-prod/files/json/topic_video.json'
    GA4_ID = 'G-SZR4JRJ0G2'
    break

  case 'staging':
    SITE_URL = 'https://staging.mnews.tw'
    YOUTUBE_API_URL = 'https://staging.mnews.tw'
    GTM_ID = 'GTM-NFH6FDH'
    GLOBAL_CACHE_SETTING = 0
    HEADER_JSON_URL = `${SITE_URL}/json/header_v2-1.json`
    FLASH_NEWS_JSON_URL = `${SITE_URL}/json/flash_news.json`
    SCHEDULE_JSON_URL = `${SITE_URL}/json/tv-schedule.json`
    POPULAR_POSTS_URL = `${SITE_URL}/json/popularlist.json`
    POPULAR_VIDEOS_JSON_URL = `${SITE_URL}/json/popular-videonews-list.json`
    FEATURE_POSTS_URL = `${SITE_URL}/json/featured_categories_post.json`
    HOMEPAGE_JSON_URL =
      'https://storage.googleapis.com/static-mnews-tw-staging/files/json/topic_video.json'
    GA4_ID = 'G-8Q9RVB3K0E'
    break

  case 'dev':
    SITE_URL = 'https://dev.mnews.tw'
    YOUTUBE_API_URL = 'https://dev.mnews.tw'
    GTM_ID = 'GTM-TVZ26W8'
    GLOBAL_CACHE_SETTING = 0
    HEADER_JSON_URL = `${SITE_URL}/json/header_v2-1.json`
    FLASH_NEWS_JSON_URL = `${SITE_URL}/json/flash_news.json`
    SCHEDULE_JSON_URL = `${SITE_URL}/json/tv-schedule.json`
    POPULAR_POSTS_URL = `https://mnews.tw/json/popularlist.json`
    POPULAR_VIDEOS_JSON_URL = `${SITE_URL}/json/popular-videonews-list.json`
    FEATURE_POSTS_URL = `${SITE_URL}/json/category_features_news.json`
    HOMEPAGE_JSON_URL =
      'https://storage.googleapis.com/static-mnews-tw-dev/files/json/topic_video.json'
    GA4_ID = 'G-YZ07T9YJ6T'
    break

  default:
    SITE_URL = 'https://dev.mnews.tw'
    YOUTUBE_API_URL = 'https://dev.mnews.tw'
    GTM_ID = 'GTM-TVZ26W8'
    GLOBAL_CACHE_SETTING = 0
    HEADER_JSON_URL = `${SITE_URL}/json/header_v2-1.json`
    FLASH_NEWS_JSON_URL = `${SITE_URL}/json/flash_news.json`
    SCHEDULE_JSON_URL = `${SITE_URL}/json/tv-schedule.json`
    POPULAR_POSTS_URL = `${SITE_URL}/json/popularlist.json`
    POPULAR_VIDEOS_JSON_URL = `${SITE_URL}/json/popular-videonews-list.json`
    FEATURE_POSTS_URL = `${SITE_URL}/json/category_features_news.json`
    HOMEPAGE_JSON_URL =
      'https://storage.googleapis.com/static-mnews-tw-dev/files/json/topic_video.json'
    GA4_ID = 'G-YZ07T9YJ6T'
    break
}

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
  HOMEPAGE_JSON_URL,
  GA4_ID,
}
