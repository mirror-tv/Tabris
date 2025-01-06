'use server'

import { getClient } from '~/apollo-client'
import { getLatestPosts, type PostCardItem } from '~/graphql/query/posts'

type QueryType = {
  allPosts: PostCardItem[]
}
const client = getClient()
const firstNItems = 5
const filteredSlugList: string[] = []
const queryArgs = {
  query: getLatestPosts,
  variables: {
    first: firstNItems,
    filteredSlug: filteredSlugList,
  },
}

/**
 * Fetches the latest 5 posts to be displayed in the aside section in category page.
 */
export const getLatestPostsForAside = () => client.query<QueryType>(queryArgs)
