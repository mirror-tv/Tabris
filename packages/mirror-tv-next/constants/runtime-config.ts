/**
 * Runtime Config
 *
 * Server-side process.env values without NEXT_PUBLIC_ prefix.
 * Cloud Run can override these at deploy time without rebuilding the image.
 */

const API_ENDPOINT_OVERRIDE_FROM_ENV = process.env.API_ENDPOINT
const PROGRAMMABLE_SEARCH_API_KEY = process.env.PROGRAMMABLE_SEARCH_API_KEY
const PROGRAMMABLE_SEARCH_ENGINE_ID = process.env.PROGRAMMABLE_SEARCH_ENGINE_ID

export {
  API_ENDPOINT_OVERRIDE_FROM_ENV,
  PROGRAMMABLE_SEARCH_API_KEY,
  PROGRAMMABLE_SEARCH_ENGINE_ID,
}
