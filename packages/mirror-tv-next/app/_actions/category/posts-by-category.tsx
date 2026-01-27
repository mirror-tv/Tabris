'use server'
import { FILTERED_SLUG } from '~/constants/constant'
import errors from '@twreporter/errors'
import {
  getPostsByCategorySlug,
  type PostCardItem,
} from '~/graphql/query/posts'
import { getClient } from '~/apollo-client'
import {
  type External,
  getExternalsByCategory,
} from '~/graphql/query/externals'

type FetchMoreItemsType = {
  skip: number
  categorySlug: string
  pageSize: number
  isWithCount: boolean
  filteredSlug?: string[]
}

export async function fetchPostsByCategory({
  skip,
  categorySlug,
  pageSize,
  isWithCount,
  filteredSlug = [],
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
      query: getPostsByCategorySlug,
      variables: {
        categorySlug,
        first: pageSize,
        skip,
        withCount: isWithCount,
        filteredSlug: [...FILTERED_SLUG, ...filteredSlug],
      },
    })
    return data
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching category posts data on category page'
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

export async function fetchExternalsByCategory({
  skip,
  categorySlug,
  pageSize,
  isWithCount,
  filteredSlug = [],
}: FetchMoreItemsType): Promise<{
  allExternals: External[]
  _allExternalsMeta?: { count: number }
}> {
  const client = getClient()
  try {
    const { data } = await client.query<{
      allExternals: External[]
      _allExternalsMeta?: { count: number }
    }>({
      query: getExternalsByCategory,
      variables: {
        categorySlug,
        first: pageSize,
        skip,
        withCount: isWithCount,
        filteredSlug: [...FILTERED_SLUG, ...filteredSlug],
      },
    })
    return data
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching category posts data on category page'
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
