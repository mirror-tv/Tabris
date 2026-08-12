'use server'
import errors from '@twreporter/errors'
import { query } from '~/apollo-client'
import type { Post, PostOrderByInput } from '~/graphql/query/topic'
import {
  fetchPostItemsByTopicSlug,
  fetchPostSortDirBySlug,
} from '~/graphql/query/topic'

type FetchTopicItemsProps = {
  page: number
  pageSize: number
  slug: string
  sortBy: PostOrderByInput
}

type FetchSortDirProps = {
  slug: string
}

async function fetchTopicItems({
  page,
  pageSize,
  slug,
  sortBy,
}: FetchTopicItemsProps): Promise<{
  items: Post[]
}> {
  try {
    const { data } = await query({
      query: fetchPostItemsByTopicSlug,
      variables: {
        topicSlug: slug,
        first: pageSize,
        skip: (page - 1) * pageSize,
        postDir: [sortBy],
      },
    })
    return { items: data?.topic?.[0]?.items ?? [] }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching topic post items'
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

async function fetchSortDir({ slug }: FetchSortDirProps): Promise<{
  sortDir: string
}> {
  try {
    const { data } = await query({
      query: fetchPostSortDirBySlug,
      variables: {
        topicSlug: slug,
      },
    })

    const sortDir = data?.topic[0]?.sortDir ?? ''

    return { sortDir }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching Sort Direction'
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

export { fetchSortDir, fetchTopicItems }
