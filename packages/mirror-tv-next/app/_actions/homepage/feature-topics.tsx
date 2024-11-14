'use server'
import errors from '@twreporter/errors'
import { getClient } from '~/apollo-client'
import { fetchFeatureTopics, type FeatureTopic } from '~/graphql/query/topic'

type FetchFeatureTopicsType = {
  topicFirst: number
  postFirst: number
}

async function getFeatureTopics({
  topicFirst,
  postFirst,
}: FetchFeatureTopicsType): Promise<
  | {
      data: { allTopics: FeatureTopic[] }
    }
  | undefined
> {
  const client = getClient()
  try {
    const { data } = await client.query<{ allTopics: FeatureTopic[] }>({
      query: fetchFeatureTopics,
      variables: {
        topicFirst,
        postFirst,
      },
    })
    return { data }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching feature topics data in homepage'
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

export { getFeatureTopics }
