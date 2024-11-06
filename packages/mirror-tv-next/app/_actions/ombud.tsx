'use server'
import { getClient } from '~/apollo-client'
import { fetchOmbudsPostsByCategorySlug } from '~/graphql/query/ombuds'
import type { Post } from '~/graphql/query/ombuds'
import errors from '@twreporter/errors'

type FetchOmbudsPostsProps = {
  page: number
  pageSize: number
  slug: string[]
  isWithCount: boolean
}

type OmbudsResponse = {
  allPosts: Post[]
  _allPostsMeta: {
    count: number
  }
}

async function fetchOmbudsPosts({
  page,
  pageSize,
  slug,
  isWithCount,
}: FetchOmbudsPostsProps): Promise<OmbudsResponse> {
  const client = getClient()
  try {
    const { data } = await client.query<OmbudsResponse>({
      query: fetchOmbudsPostsByCategorySlug,
      variables: {
        first: pageSize,
        skip: (page - 1) * pageSize,
        filteredSlug: slug,
        withCount: isWithCount,
      },
    })
    return data
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching ombuds news'
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

export { fetchOmbudsPosts }
