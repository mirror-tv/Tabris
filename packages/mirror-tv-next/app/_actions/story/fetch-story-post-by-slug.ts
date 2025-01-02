import { getClient } from '~/apollo-client'
import {
  fetchStoryBySlug as fetchStoryBySlugDocument,
  type FetchStoryBySlugResponse,
} from '~/graphql/query/story'
import errors from '@twreporter/errors'

export async function fetchStoryBySlug(
  slug: string
): Promise<FetchStoryBySlugResponse['allPosts']> {
  const client = getClient()
  try {
    const { data } = await client.query<{
      allPosts: FetchStoryBySlugResponse['allPosts']
    }>({
      query: fetchStoryBySlugDocument,
      variables: {
        slug,
      },
    })
    return data.allPosts ?? []
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
    return []
  }
}
