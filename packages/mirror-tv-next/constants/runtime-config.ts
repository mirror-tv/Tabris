/**
 * Runtime Config
 *
 * Server-side process.env values without NEXT_PUBLIC_ prefix.
 * Cloud Run can override these at deploy time without rebuilding the image.
 */

const API_ENDPOINT_OVERRIDE_FROM_ENV = process.env.API_ENDPOINT
const PROGRAMMABLE_SEARCH_API_KEY = process.env.PROGRAMMABLE_SEARCH_API_KEY
const PROGRAMMABLE_SEARCH_ENGINE_ID = process.env.PROGRAMMABLE_SEARCH_ENGINE_ID
// Story page: also query Post.tags_algo (AI tags) and merge them into the tag
// list. Must stay off until the CMS of that environment exposes the field.
const SHOW_ALGO_TAGS = process.env.SHOW_ALGO_TAGS === 'true'
// Story page: also query Post.relatedPosts_algo (AI related posts) and append
// them after the editor-picked ones. Off until the CMS exposes the field.
const SHOW_ALGO_RELATED_POSTS = process.env.SHOW_ALGO_RELATED_POSTS === 'true'

export {
  API_ENDPOINT_OVERRIDE_FROM_ENV,
  PROGRAMMABLE_SEARCH_API_KEY,
  PROGRAMMABLE_SEARCH_ENGINE_ID,
  SHOW_ALGO_TAGS,
  SHOW_ALGO_RELATED_POSTS,
}
