'use server'
import errors from '@twreporter/errors'
import { YoutubeResponse } from '~/types/youtube'

import { fetchYoutubeData } from '~/utils'

type fetchYoutubeListProps = {
  list: { nextPageToken: string; id: string | undefined }
  take: number
}

async function fetchYoutubeList({
  list,
  take,
}: fetchYoutubeListProps): Promise<YoutubeResponse> {
  if (!list.id) throw new Error('id of youtube list is not exit')
  try {
    const pageToken = list.nextPageToken
      ? `&pageToken=${list.nextPageToken}`
      : ''

    const response = await fetchYoutubeData(
      `/playlistItems?part=snippet,status${pageToken}&playlistId=${list.id}&maxResults=${take}`
    )
    return response
  } catch (err) {
    const annotatingError = errors.helpers.wrap(
      err,
      'UnhandledError',
      'Error occurs while fetching youtube data in show page'
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

export { fetchYoutubeList }
