'use server'
import { FILTERED_SLUG } from '~/constants/constant'
import errors from '@twreporter/errors'
import {
  getVideoPostsByCategorySlug,
  PostCardItem,
} from '~/graphql/query/posts'
import { getClient } from '~/apollo-client'

type FetchMoreItemsType = {
  page: number
  categorySlug: string
  pageSize: number
  isWithCount: boolean
}

async function fetchVideoPostsItems({
  page,
  categorySlug,
  pageSize,
  isWithCount,
}: FetchMoreItemsType): Promise<{
  categorySlug: string
  data: {
    allPosts: PostCardItem[]
    _allPostsMeta?: { count: number }
  }
}> {
  const client = getClient()
  try {
    const { data } = await client.query<{
      allPosts: PostCardItem[]
      _allPostsMeta?: { count: number }
    }>({
      query: getVideoPostsByCategorySlug,
      variables: {
        category: categorySlug,
        first: pageSize,
        skip: page * pageSize,
        withCount: isWithCount,
        filteredSlug: FILTERED_SLUG,
        style: 'videoNews',
      },
    })
    return { data, categorySlug }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching video posts data in category video page'
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
    throw annotatingError
  }
}

export { fetchVideoPostsItems }
