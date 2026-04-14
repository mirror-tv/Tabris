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

export { API_ENDPOINT, YOUTUBE_API_ENDPOINT, STATIC_BASE_URL }
