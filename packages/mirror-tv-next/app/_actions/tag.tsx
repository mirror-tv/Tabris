'use server'
import { FILTERED_SLUG } from '~/constants/constant'
import errors from '@twreporter/errors'
import { getPostsByTagName, PostCardItem } from '~/graphql/query/posts'
import { getClient } from '~/apollo-client'

type FetchMoreItemsType = {
  page: number
  tagName: string
  pageSize: number
  isWithCount: boolean
}

async function fetchPostsItems({
  page,
  tagName,
  pageSize,
  isWithCount,
}: FetchMoreItemsType): Promise<{
  allPosts: PostCardItem[]
  _allPostsMeta?: { count: number }
}> {
  const client = getClient()
  try {
    const { data } = await client.query<{
      allPosts: PostCardItem[]
      _allPostsMeta?: { count: number }
    }>({
      query: getPostsByTagName,
      variables: {
        tagName,
        first: pageSize,
        skip: page * pageSize,
        withCount: isWithCount,
        filteredSlug: FILTERED_SLUG,
      },
    })
    return data
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching data for posts for tag page'
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
    throw new Error('Error occurs while fetching data.')
  }
}

export { fetchPostsItems }
