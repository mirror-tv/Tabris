'use server'

import { unstable_noStore as noStore } from 'next/cache'
import { getClient } from '~/apollo-client'
import { IS_PREVIEW_MODE } from '~/constants/environment-variables'
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
  // Preview mode should always read the latest CMS state instead of reusing
  // static rendering or RSC cache from a previous request.
  if (IS_PREVIEW_MODE) {
    noStore()
  }

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
    return data ?? { allPosts: [] }
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
