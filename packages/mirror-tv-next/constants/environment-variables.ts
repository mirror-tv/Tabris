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
let URL_STATIC_EDITOR_CHOICES: string

switch (ENV) {
  case 'prod':
    SITE_URL = 'https://mnews.tw'
    YOUTUBE_API_URL = 'https://mnews.tw'
    GTM_ID = 'GTM-PK7VRFX'
    GLOBAL_CACHE_SETTING = 0
    HEADER_JSON_URL = 'https://www.mnews.tw/json/header_v2-1.json'
    FLASH_NEWS_JSON_URL = 'https://mnews.tw/json/flash_news.json'
    SCHEDULE_JSON_URL = 'https://mnews.tw/json/tv-schedule.json'
    POPULAR_POSTS_URL = 'https://mnews.tw/json/popularlist.json'
    POPULAR_VIDEOS_JSON_URL =
      'https://mnews.tw/json/popular-videonews-list.json'
    FEATURE_POSTS_URL = 'https://www.mnews.tw/api/gcs/featured_categories_post'
    HOMEPAGE_JSON_URL =
      'https://storage.googleapis.com/static-mnews-tw-prod/files/json/topic_video.json'
    GA4_ID = 'G-SZR4JRJ0G2'
    URL_STATIC_EDITOR_CHOICES =
      'https://storage.googleapis.com/static-mnews-tw-prod/json/editor_choices.json'
    break

  case 'staging':
    SITE_URL = 'https://staging.mnews.tw'
    YOUTUBE_API_URL = 'https://staging.mnews.tw'
    GTM_ID = 'GTM-NFH6FDH'
    GLOBAL_CACHE_SETTING = 0
    HEADER_JSON_URL = 'https://staging.mnews.tw/json/header_v2-1.json'
    FLASH_NEWS_JSON_URL = 'https://staging.mnews.tw/json/flash_news.json'
    SCHEDULE_JSON_URL = 'https://staging.mnews.tw/json/tv-schedule.json'
    POPULAR_POSTS_URL = 'https://mnews.tw/json/popularlist.json'
    POPULAR_VIDEOS_JSON_URL =
      'https://mnews.tw/json/popular-videonews-list.json'
    FEATURE_POSTS_URL =
      'https://staging.mnews.tw/api/gcs/featured_categories_post'
    HOMEPAGE_JSON_URL =
      'https://storage.googleapis.com/static-mnews-tw-staging/files/json/topic_video.json'
    GA4_ID = 'G-8Q9RVB3K0E'
    URL_STATIC_EDITOR_CHOICES =
      'https://storage.googleapis.com/static-mnews-tw-staging/json/editor_choices.json'
    break

  case 'dev':
    SITE_URL = 'https://dev.mnews.tw'
    YOUTUBE_API_URL = 'https://dev.mnews.tw'
    GTM_ID = 'GTM-TVZ26W8'
    GLOBAL_CACHE_SETTING = 0
    HEADER_JSON_URL = 'https://dev.mnews.tw/json/header_v2-1.json'
    FLASH_NEWS_JSON_URL = 'https://dev.mnews.tw/json/flash_news.json'
    SCHEDULE_JSON_URL = 'https://dev.mnews.tw/json/tv-schedule.json'
    POPULAR_POSTS_URL = 'https://mnews.tw/json/popularlist.json'
    POPULAR_VIDEOS_JSON_URL =
      'https://mnews.tw/json/popular-videonews-list.json'
    FEATURE_POSTS_URL = 'https://dev.mnews.tw/api/gcs/featured_categories_post'
    GA4_ID = 'G-YZ07T9YJ6T'
    URL_STATIC_EDITOR_CHOICES =
      'https://storage.googleapis.com/static-mnews-tw-dev/json/editor_choices.json'
    break

  default:
    SITE_URL = 'https://dev.mnews.tw'
    YOUTUBE_API_URL = 'https://dev.mnews.tw'
    GTM_ID = 'GTM-TVZ26W8'
    GLOBAL_CACHE_SETTING = 0
    HEADER_JSON_URL = 'https://dev.mnews.tw/json/header_v2-1.json'
    FLASH_NEWS_JSON_URL = 'https://dev.mnews.tw/json/flash_news.json'
    SCHEDULE_JSON_URL = 'https://dev.mnews.tw/json/tv-schedule.json'
    POPULAR_POSTS_URL = 'https://mnews.tw/json/popularlist.json'
    POPULAR_VIDEOS_JSON_URL =
      'https://mnews.tw/json/popular-videonews-list.json'
    FEATURE_POSTS_URL = 'https://dev.mnews.tw/api/gcs/featured_categories_post'
    GA4_ID = 'G-YZ07T9YJ6T'
    URL_STATIC_EDITOR_CHOICES =
      'https://storage.googleapis.com/static-mnews-tw-dev/json/editor_choices.json'
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
  URL_STATIC_EDITOR_CHOICES,
}
