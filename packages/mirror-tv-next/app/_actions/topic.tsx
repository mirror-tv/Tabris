'use server'
import errors from '@twreporter/errors'
import { getTopics, Topic } from '~/graphql/query/topic'
import { getClient } from '~/apollo-client'

type FetchTopicType = {
  page: number
  pageSize: number
  isWithCount: boolean
}

async function fetchTopics({
  page,
  pageSize,
  isWithCount,
}: FetchTopicType): Promise<{
  allTopics: Topic[]
  _allTopicsMeta?: { count: number }
}> {
  const client = getClient()
  try {
    const { data } = await client.query<{
      allTopics: Topic[]
      _allTopicsMeta?: { count: number }
    }>({
      query: getTopics,
      variables: {
        first: pageSize,
        skip: (page - 1) * pageSize,
        withCount: isWithCount,
      },
    })
    return data
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching data for posts for topic page'
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
    throw new Error('Error occurs while fetching data.')
  }
}

export { fetchTopics }
