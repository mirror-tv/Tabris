/**
 * Runtime Endpoint Config
 *
 * Runtime endpoint resolution for server-side data fetching.
 * Keep this separate from environment-variables.ts because Cloud Run can override endpoints at deploy time.
 * Avoid re-exporting this module through client-facing barrels such as ~/utils.
 */

import { API_ENDPOINT_OVERRIDE_FROM_ENV } from './config'
import { ENV, type Environment } from './environment'

type ResolvedEndpointConfig = {
  API_ENDPOINT: string
  YOUTUBE_API_ENDPOINT: string
  STATIC_BASE_URL: string
}

type EndpointSubdomainConfig = {
  apiSubdomain: string
  siteSubdomain: string
  staticSubdomain: string
}

const ENDPOINT_SUBDOMAIN_CONFIG_BY_ENV: Record<
  Environment,
  EndpointSubdomainConfig
> = {
  prod: {
    apiSubdomain: 'api',
    siteSubdomain: 'www',
    staticSubdomain: 'statics',
  },
  staging: {
    apiSubdomain: 'api-staging',
    siteSubdomain: 'staging',
    staticSubdomain: 'statics-staging',
  },
  dev: {
    apiSubdomain: 'api-dev',
    siteSubdomain: 'dev',
    staticSubdomain: 'statics-dev',
  },
}

const resolvedEndpointConfig =
  (function resolveEndpointConfig(): ResolvedEndpointConfig {
    const { apiSubdomain, siteSubdomain, staticSubdomain } =
      ENDPOINT_SUBDOMAIN_CONFIG_BY_ENV[ENV]

    return {
      API_ENDPOINT: `https://${apiSubdomain}.mnews.tw/api/graphql`,
      YOUTUBE_API_ENDPOINT: `https://${siteSubdomain}.mnews.tw/api/youtube`,
      STATIC_BASE_URL: `https://${staticSubdomain}.mnews.tw`,
    }
  })()

const API_ENDPOINT =
  API_ENDPOINT_OVERRIDE_FROM_ENV ?? resolvedEndpointConfig.API_ENDPOINT
const YOUTUBE_API_ENDPOINT = resolvedEndpointConfig.YOUTUBE_API_ENDPOINT
const STATIC_BASE_URL = resolvedEndpointConfig.STATIC_BASE_URL
const JSON_BASE_URL = `${STATIC_BASE_URL}/json`
const SCHEDULE_JSON_URL = `${STATIC_BASE_URL}/files/documents/tv-schedule.json`

const HEADER_JSON_URL = `${JSON_BASE_URL}/header.json`
const FLASH_NEWS_JSON_URL = `${JSON_BASE_URL}/flash_news.json`
const POPULAR_POSTS_URL = `${JSON_BASE_URL}/popularlist.json`
const POPULAR_VIDEOS_JSON_URL = `${JSON_BASE_URL}/popular-videonews-list.json`
const FEATURE_POSTS_URL = `${JSON_BASE_URL}/featured_categories_news.json`
const CATEGORY_VIDEO_JSON_URL = `${JSON_BASE_URL}/featured_category_video_posts.json`
const HOMEPAGE_VIDEO_JSON_URL = `${JSON_BASE_URL}/video.json`
const HOMEPAGE_TOPIC_JSON_URL = `${JSON_BASE_URL}/topic.json`
const WEATHER_JSON_URL = `${JSON_BASE_URL}/weather.json`

export {
  API_ENDPOINT,
  YOUTUBE_API_ENDPOINT,
  STATIC_BASE_URL,
  JSON_BASE_URL,
  SCHEDULE_JSON_URL,
  HEADER_JSON_URL,
  FLASH_NEWS_JSON_URL,
  POPULAR_POSTS_URL,
  POPULAR_VIDEOS_JSON_URL,
  FEATURE_POSTS_URL,
  CATEGORY_VIDEO_JSON_URL,
  HOMEPAGE_VIDEO_JSON_URL,
  HOMEPAGE_TOPIC_JSON_URL,
  WEATHER_JSON_URL,
}
