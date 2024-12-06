'use server'
import errors from '@twreporter/errors'
import { getClient } from '~/apollo-client'
import {
  type PostWithCategory,
  getPostsWithCategory,
} from '~/graphql/query/posts'

type GetLatestPostsServerActionType = {
  first: number
  skip: number
  withCount: boolean
  filteredSlug: string[]
}

async function getLatestPostsServerAction({
  first,
  skip,
  withCount = false,
  filteredSlug = [],
}: GetLatestPostsServerActionType): Promise<{
  data: {
    allPosts: PostWithCategory[]
    _allPostsMeta?: { count: number }
  }
}> {
  const client = getClient()
  try {
    const { data } = await client.query<{
      allPosts: PostWithCategory[]
      _allPostsMeta?: { count: number }
    }>({
      query: getPostsWithCategory,
      variables: {
        first,
        skip,
        withCount,
        filteredSlug,
      },
    })
    return { data }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurred while fetching latest posts data in homepage'
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
    return {
      data: { allPosts: [] },
    }
  }
}

export { getLatestPostsServerAction }
