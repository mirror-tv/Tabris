import { getClient } from '~/apollo-client'
import { getLatestPosts, type PostCardItem } from '~/graphql/query/posts'
import {
  fetchStoryBySlug as fetchStoryBySlugDocument,
  SinglePost,
} from '~/graphql/query/story'
import errors from '@twreporter/errors'

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
export const getLatestPostsFunction = () => {
  return client.query<QueryType>(queryArgs)
}

export async function fetchStoryBySlug(
  slug: string
): Promise<{ allPosts: SinglePost[] }> {
  const client = getClient()
  try {
    const { data } = await client.query<{
      allPosts: SinglePost[]
    }>({
      query: fetchStoryBySlugDocument,
      variables: {
        slug,
      },
    })
    return data ?? []
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      `Error occurs while fetching slug data in story page, slug: ${slug}`
    )

    console.error(
      JSON.stringify({
        severity: 'ERROR',
        message: errors.helpers.printAll(annotatingError, {
          withStack: false,
          withPayload: true,
        }),
      })
    )
    return { allPosts: [] }
  }
}
