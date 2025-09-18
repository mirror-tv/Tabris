'use server'

import { getClient } from '~/apollo-client'
import {
  fetchExternalBySlug as fetchExternalBySlugDocument,
  type SingleExternalPost,
} from '~/graphql/query/external'
import errors from '@twreporter/errors'

export async function fetchExternalBySlug(
  slug: string
): Promise<{ allExternals: SingleExternalPost[] }> {
  const client = getClient()
  try {
    const { data } = await client.query<{
      allExternals: SingleExternalPost[]
    }>({
      query: fetchExternalBySlugDocument,
      variables: {
        slug,
      },
    })
    return data ?? { allExternals: [] }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      `Error occurs while fetching slug data in external page, slug: ${slug}`
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
    return { allExternals: [] }
  }
}
