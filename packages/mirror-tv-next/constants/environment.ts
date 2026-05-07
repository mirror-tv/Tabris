/**
 * Environment Detection
 *
 * Reads NEXT_PUBLIC_ENV and exposes a canonical environment value.
 * Shared foundation for both build-time and runtime config modules.
 */

type Environment = 'prod' | 'staging' | 'dev'

function normalizeEnvironment(env: string): Environment {
  switch (env) {
    case 'prod':
    case 'prod-k6':
      return 'prod'
    case 'staging':
    case 'staging-k6':
      return 'staging'
    case 'dev':
    case 'dev-k6':
    default:
      return 'dev'
  }
}

// 'local' is only a fallback for local development/debugging.
const RAW_ENV = process.env.NEXT_PUBLIC_ENV || 'local'
const ENV = normalizeEnvironment(RAW_ENV)

const IS_PREVIEW_MODE = process.env.NEXT_PUBLIC_IS_PREVIEW_MODE === 'true'
const SITE_BASE_PATH = IS_PREVIEW_MODE ? '/preview-server' : ''

export { ENV, IS_PREVIEW_MODE, SITE_BASE_PATH }
export type { Environment }
