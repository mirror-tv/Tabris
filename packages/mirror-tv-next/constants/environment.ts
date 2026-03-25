/**
 * Environment Detection
 *
 * Reads NEXT_PUBLIC_ENV.
 * Shared foundation for both build-time and runtime config modules.
 */

// 'local' is only a fallback for local development/debugging.
const ENV = process.env.NEXT_PUBLIC_ENV || 'local'

type NormalizedEnvironment = 'prod' | 'staging' | 'dev'

function normalizeEnvironment(env: string): NormalizedEnvironment {
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

export { ENV, normalizeEnvironment }
export type { NormalizedEnvironment }
