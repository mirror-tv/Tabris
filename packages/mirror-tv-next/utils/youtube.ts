import type { YoutubeItem, YoutubeResponse } from '~/types/youtube'
import type { FormatPlayListItems } from '~/types/api-data'
import axios, { AxiosResponse } from 'axios'
import { YOUTUBE_API_URL } from '~/constants/endpoint-config'
import { FetchError } from './index'

const formateYoutubeListRes = (
  response: YoutubeResponse,
  playlistId: string
): FormatPlayListItems => {
  const filteredItems = response?.items?.filter(
    (item) => item?.status?.privacyStatus === 'public'
  )
  const formatPlayListItems = (item: YoutubeItem) => {
    return {
      id: item?.snippet?.resourceId?.videoId,
      title: item?.snippet?.title,
    }
  }
  return {
    id: playlistId,
    items: filteredItems?.map((item) => formatPlayListItems(item)) ?? [],
    nextPageToken: response?.nextPageToken,
    totalItems: response.pageInfo.totalResults,
  }
}

async function fetchYoutubeData(url: string): Promise<YoutubeResponse> {
  try {
    const axiosConfig = {
      timeout: 3000,
    }
    const response: AxiosResponse = await axios.get(
      `${YOUTUBE_API_URL}/api/youtube${url}`,
      axiosConfig
    )
    return response.data
  } catch (err) {
    const error = err as FetchError
    throw new FetchError(url, error.message, error.code ?? 500)
  }
}

export { formateYoutubeListRes, fetchYoutubeData }
