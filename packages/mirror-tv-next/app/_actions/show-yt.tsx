'use server'
import errors from '@twreporter/errors'
import axios from 'axios'
import { YOUTUBE_API_ENDPOINT } from '~/constants/endpoint-config'
import type { YoutubeResponse } from '~/types/youtube'

type FetchYoutubeListProps = {
  list: { nextPageToken: string; id: string | undefined }
  take: number
}

async function fetchYoutubeData(url: string): Promise<YoutubeResponse> {
  const response = await axios.get<YoutubeResponse>(
    `${YOUTUBE_API_ENDPOINT}${url}`,
    {
      timeout: 3000,
    }
  )

  return response.data
}

async function fetchYoutubeList({
  list,
  take,
}: FetchYoutubeListProps): Promise<YoutubeResponse> {
  if (!list.id) throw new Error('id of youtube list is not exit')
  try {
    const pageToken = list.nextPageToken
      ? `&pageToken=${list.nextPageToken}`
      : ''

    const response = await fetchYoutubeData(
      `/playlistItems?part=snippet,status${pageToken}&playlistId=${list.id}&maxResults=50`
    )
    const publicVideos = (response.items ?? [])
      .filter((item) => item.status?.privacyStatus === 'public')
      .slice(0, take)

    return { ...response, items: publicVideos }
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
