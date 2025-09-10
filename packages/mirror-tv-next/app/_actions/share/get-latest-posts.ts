'use server'

import { getLatestPostsFunction } from '~/app/_actions/homepage/latest-posts-and-editor-choices'

/**
 * Fetches the latest 5 posts to be displayed in the aside section in category page.
 */
export async function getLatestPostsAside() {
  const result = await getLatestPostsFunction()
  return result
}
