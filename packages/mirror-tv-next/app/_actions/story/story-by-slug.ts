'use server'

import { getClient } from '~/apollo-client'
import {
  fetchStoryBySlug as fetchStoryBySlugDocument,
  SinglePost,
} from '~/graphql/query/story'
import errors from '@twreporter/errors'

/**
 * Fetches story data by slug for story pages
 */
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
