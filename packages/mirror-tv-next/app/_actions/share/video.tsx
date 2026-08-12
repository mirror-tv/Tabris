'use server'
import errors from '@twreporter/errors'
import { query } from '~/apollo-client'
import type { Video } from '~/graphql/query/videos'
import { getVideoByName } from '~/graphql/query/videos'

type GetVideoType = {
  name: string
  take: number
  errorMessage?: string
  withDescription?: boolean
}

async function getVideo({
  name,
  take,
  errorMessage = '',
  withDescription = false,
}: GetVideoType): Promise<{
  data: { allVideos: Video[] }
}> {
  try {
    const { data } = await query({
      query: getVideoByName,
      variables: {
        name,
        take,
        withDescription,
      },
    })
    return { data: { allVideos: data?.videos ?? [] } }
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      errorMessage ?? `Error occurs while fetching ${name} videos in homepage`
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
    return { data: { allVideos: [] } }
  }
}

export { getVideo }
