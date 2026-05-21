/**
 * Build-time Config
 *
 * Build-time environment settings selected by NEXT_PUBLIC_ENV.
 * Standalone NEXT_PUBLIC_* flags (not selected by ENV) also belong here.
 * Keep static site identity, analytics, and cache defaults here.
 * Do not place runtime endpoint toggles or deploy-time endpoint overrides in this file.
 */

import { ENV } from './environment'

let SITE_URL: string
let GTM_ID: string
let GLOBAL_CACHE_SETTING: number
let GA4_ID: string

switch (ENV) {
  case 'prod':
    SITE_URL = 'https://www.mnews.tw'
    GTM_ID = 'GTM-PK7VRFX'
    GLOBAL_CACHE_SETTING = 0
    GA4_ID = 'G-SZR4JRJ0G2'
    break

  case 'staging':
    SITE_URL = 'https://staging.mnews.tw'
    GTM_ID = 'GTM-NFH6FDH'
    GLOBAL_CACHE_SETTING = 0
    GA4_ID = 'G-8Q9RVB3K0E'
    break

  case 'dev':
  default:
    SITE_URL = 'https://dev.mnews.tw'
    GTM_ID = 'GTM-TVZ26W8'
    GLOBAL_CACHE_SETTING = 0
    GA4_ID = 'G-YZ07T9YJ6T'
    break
}

const IS_PREVIEW_MODE = process.env.NEXT_PUBLIC_IS_PREVIEW_MODE === 'true'

export { GLOBAL_CACHE_SETTING, GTM_ID, SITE_URL, GA4_ID, IS_PREVIEW_MODE }
