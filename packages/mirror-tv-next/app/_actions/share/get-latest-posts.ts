'use server'

import { getLatestPostsFunction } from '~/app/_actions/homepage/latest-posts-and-editor-choices'

// Helper function to clean Apollo Client internal properties
function cleanApolloData(data: any): any {
  if (Array.isArray(data)) {
    return data.map(cleanApolloData)
  }

  if (data && typeof data === 'object') {
    const cleaned = { ...data }
    // Remove Apollo Client internal properties
    delete cleaned.__typename
    delete cleaned.$$id
    delete cleaned.$$typeof

    // Recursively clean nested objects
    for (const key in cleaned) {
      if (cleaned[key] && typeof cleaned[key] === 'object') {
        cleaned[key] = cleanApolloData(cleaned[key])
      }
    }

    return cleaned
  }

  return data
}

/**
 * Fetches the latest 5 posts to be displayed in the aside section in category page.
 */
export async function getLatestPostsAside() {
  const result = await getLatestPostsFunction()
  return cleanApolloData(result)
}
