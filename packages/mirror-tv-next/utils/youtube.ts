import type { YoutubeItem, YoutubeResponse } from '~/types/youtube'
import type { FormatPlayListItems } from '~/components/show/_slug/youtube-list'
import axios, { AxiosResponse } from 'axios'
import { FetchError } from './index'
import { YOUTUBE_API_URL } from '~/constants/environment-variables'

const formateYoutubeListRes = (
  response: YoutubeResponse
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
