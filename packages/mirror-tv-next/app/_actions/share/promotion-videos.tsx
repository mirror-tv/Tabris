'use server'
import errors from '@twreporter/errors'
import { getClient } from '~/apollo-client'
import {
  PromotionVideo,
  getPromotionVideos,
} from '~/graphql/query/promotion-video'

type FetchPromotionVideosServerActionType = {
  take: number
  pageName: string
}

async function fetchPromotionVideosServerAction({
  take,
  pageName,
}: FetchPromotionVideosServerActionType): Promise<{
  data: { allPromotionVideos: PromotionVideo[] }
}> {
  const client = getClient()
  try {
    const { data } = await client.query<{
      allPromotionVideos: PromotionVideo[]
    }>({
      query: getPromotionVideos,
      variables: {
        first: take,
      },
    })
    return { data }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      `Error occurs while fetching promotion videos data in ${pageName}`
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
  return { data: { allPromotionVideos: [] } }
}

export { fetchPromotionVideosServerAction }
