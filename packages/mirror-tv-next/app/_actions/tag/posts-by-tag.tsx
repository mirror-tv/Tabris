'use server'
import { FILTERED_SLUG } from '~/constants/constant'
import errors from '@twreporter/errors'
import { getPostsByTagName, type PostCardItem } from '~/graphql/query/posts'
import { getClient } from '~/apollo-client'
import { getExternalsByTagName, type External } from '~/graphql/query/externals'

type FetchPostsItemsType = {
  page: number
  tagName: string
  pageSize: number
  isWithCount: boolean
}

type FetchExternalsByTagNameType = {
  page: number
  tagName: string
  pageSize: number
  isWithCount: boolean
}

async function fetchPostsItems({
  tagName,
  pageSize,
  page,
  isWithCount,
}: FetchPostsItemsType): Promise<{
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
      'Error occurs while fetching posts data for tag page'
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
    throw new Error('Error occurs while fetching posts data for tag page.')
  }
}

async function fetchExternalsByTagName({
  page,
  tagName,
  pageSize,
  isWithCount,
}: FetchExternalsByTagNameType): Promise<{
  allExternals: External[]
  _allExternalsMeta?: { count: number }
}> {
  const client = getClient()
  try {
    const { data } = await client.query<{
      allExternals: External[]
      _allExternalsMeta?: { count: number }
    }>({
      query: getExternalsByTagName,
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
      'Error occurs while fetching externals data on tag page.'
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
    throw new Error('Error occurs while fetching externals data on tag page.')
  }
}

export { fetchPostsItems, fetchExternalsByTagName }
