/**
 * Runtime Endpoint Config
 *
 * Runtime endpoint resolution for server-side data fetching.
 * Keep this separate from environment-variables.ts because Cloud Run can override endpoints at deploy time.
 * Avoid re-exporting this module through client-facing barrels such as ~/utils.
 */

import {
  API_ENDPOINT_OVERRIDE_FROM_ENV,
  ENABLE_K6_NEW_ENDPOINTS,
} from './config'
import {
  ENV,
  normalizeEnvironment,
  type NormalizedEnvironment,
} from './environment'

type ResolvedEndpointConfig = {
  API_ENDPOINT: string
  YOUTUBE_API_URL: string
  STATIC_BASE_URL: string
}

const TIMESTAMP_FOR_CACHE = '?t=' + Date.now() / 10

const endpointEnv = normalizeEnvironment(ENV)

const LEGACY_PROD_ENDPOINT_CONFIG: ResolvedEndpointConfig = {
  API_ENDPOINT: 'https://api-v3.mnews.tw/api/graphql',
  YOUTUBE_API_URL: 'https://v3.mnews.tw',
  STATIC_BASE_URL: 'https://storage.googleapis.com/v2-static-mnews-tw-prod',
}

const K6_PROD_ENDPOINT_CONFIG: ResolvedEndpointConfig = {
  API_ENDPOINT: 'https://api.mnews.tw/api/graphql',
  YOUTUBE_API_URL: 'https://www.mnews.tw',
  STATIC_BASE_URL: 'https://statics.mnews.tw',
}

const fixedEndpointConfigByEnvironment: Record<
  Exclude<NormalizedEnvironment, 'prod'>,
  ResolvedEndpointConfig
> = {
  staging: {
    API_ENDPOINT:
      'https://mirrortv-cms-staging-439405143478.asia-east1.run.app/api/graphql',
    YOUTUBE_API_URL:
      'https://yt-relay-tv-staging-439405143478.asia-east1.run.app',
    STATIC_BASE_URL:
      'https://storage.googleapis.com/v2-static-mnews-tw-staging',
  },
  dev: {
    API_ENDPOINT:
      'https://mirrortv-cms-dev-439405143478.asia-east1.run.app/api/graphql',
    YOUTUBE_API_URL: 'https://yt-relay-tv-dev-439405143478.asia-east1.run.app',
    STATIC_BASE_URL: 'https://storage.googleapis.com/v2-static-mnews-tw-dev',
  },
}

function resolveEndpointConfig(): ResolvedEndpointConfig {
  if (endpointEnv !== 'prod') {
    return fixedEndpointConfigByEnvironment[endpointEnv]
  }

  return ENABLE_K6_NEW_ENDPOINTS
    ? K6_PROD_ENDPOINT_CONFIG
    : LEGACY_PROD_ENDPOINT_CONFIG
}

const resolvedEndpointConfig = resolveEndpointConfig()

const API_ENDPOINT =
  API_ENDPOINT_OVERRIDE_FROM_ENV ?? resolvedEndpointConfig.API_ENDPOINT
const YOUTUBE_API_URL = resolvedEndpointConfig.YOUTUBE_API_URL
const STATIC_BASE_URL = resolvedEndpointConfig.STATIC_BASE_URL
const JSON_BASE_URL = `${STATIC_BASE_URL}/json`
const SCHEDULE_JSON_URL = `${STATIC_BASE_URL}/files/documents/tv-schedule.json`

const HOMEPAGE_TOPIC_JSON_URL = `${JSON_BASE_URL}/topic.json`
const HOMEPAGE_VIDEO_JSON_URL = `${JSON_BASE_URL}/video.json${TIMESTAMP_FOR_CACHE}`
const WEATHER_JSON_URL = `${JSON_BASE_URL}/weather.json`
const POPULAR_POSTS_URL = `${JSON_BASE_URL}/popularlist.json`
const POPULAR_VIDEOS_JSON_URL = `${JSON_BASE_URL}/popular-videonews-list.json`
const FEATURE_POSTS_URL = `${JSON_BASE_URL}/featured_categories_news.json`
const HEADER_JSON_URL = `${JSON_BASE_URL}/header.json`
const FLASH_NEWS_JSON_URL = `${JSON_BASE_URL}/flash_news.json`

export {
  API_ENDPOINT,
  FEATURE_POSTS_URL,
  FLASH_NEWS_JSON_URL,
  HEADER_JSON_URL,
  HOMEPAGE_TOPIC_JSON_URL,
  HOMEPAGE_VIDEO_JSON_URL,
  JSON_BASE_URL,
  POPULAR_POSTS_URL,
  POPULAR_VIDEOS_JSON_URL,
  SCHEDULE_JSON_URL,
  WEATHER_JSON_URL,
  YOUTUBE_API_URL,
}
