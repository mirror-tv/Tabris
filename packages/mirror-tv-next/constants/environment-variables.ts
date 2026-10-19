/**
 * Build-time Config
 *
 * Build-time environment settings selected by NEXT_PUBLIC_ENV.
 * Standalone NEXT_PUBLIC_* flags (not selected by ENV) also belong here.
 * Keep static site identity, analytics, and cache defaults here.
 * Do not place runtime endpoint toggles or deploy-time endpoint overrides in this file.
 */

import { ENV } from './environment'

const DEV_AND_STAGING_ELECTION_IFRAME_URL =
  'https://dev.mirrormedia.mg/projects/election2026-homepage/index.html'

type EnvMap = {
  SITE_URL: string
  GTM_ID: string
  GA4_ID: string
  ELECTION_IFRAME_URL: string
}

const ENV_CONFIG_MAP: Record<typeof ENV, EnvMap> = {
  dev: {
    SITE_URL: 'https://dev.mnews.tw',
    GTM_ID: 'GTM-TVZ26W8',
    GA4_ID: 'G-YZ07T9YJ6T',
    ELECTION_IFRAME_URL: DEV_AND_STAGING_ELECTION_IFRAME_URL,
  },
  prod: {
    SITE_URL: 'https://www.mnews.tw',
    GTM_ID: 'GTM-PK7VRFX',
    GA4_ID: 'G-SZR4JRJ0G2',
    ELECTION_IFRAME_URL:
      'https://www.mnews.tw/projects/election2026-homepage/index.html',
  },
  staging: {
    SITE_URL: 'https://staging.mnews.tw',
    GTM_ID: 'GTM-NFH6FDH',
    GA4_ID: 'G-8Q9RVB3K0E',
    ELECTION_IFRAME_URL: DEV_AND_STAGING_ELECTION_IFRAME_URL,
  },
}

const IS_PREVIEW_MODE = process.env.NEXT_PUBLIC_IS_PREVIEW_MODE === 'true'

const currentEnv = ENV_CONFIG_MAP[ENV]

const { SITE_URL, GTM_ID, GA4_ID, ELECTION_IFRAME_URL } = currentEnv

export { GTM_ID, SITE_URL, GA4_ID, ELECTION_IFRAME_URL, ENV, IS_PREVIEW_MODE }
