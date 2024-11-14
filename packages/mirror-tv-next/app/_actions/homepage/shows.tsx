'use server'
import errors from '@twreporter/errors'
import { getClient } from '~/apollo-client'
import { Show, fetchShows } from '~/graphql/query/shows'

type fetchFeatureTopicsType = {
  take: number
  skip: number
  isGetCount: boolean
}

async function getShows({
  take = 12,
  skip = 0,
  isGetCount = false,
}: fetchFeatureTopicsType): Promise<
  | {
      data: { allShows: Show[] }
    }
  | undefined
> {
  const client = getClient()
  try {
    const { data } = await client.query<{
      allShows: Show[]
      _allShowsMeta?: { count: number }
    }>({
      query: fetchShows,
      variables: {
        take,
        skip,
        isGetCount,
      },
    })
    return { data }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      `Error occurs while fetching shows data from ${skip + 1} to ${
        skip + take + 1
      } in homepage`
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
  }
}

export { getShows }
