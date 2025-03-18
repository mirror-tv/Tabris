'use server'

import { getLatestPostsFunction } from '~/utils/fetch-function'

/**
 * Fetches the latest 5 posts to be displayed in the aside section in category page.
 */
const getLatestPostsAside = getLatestPostsFunction
export { getLatestPostsAside }
