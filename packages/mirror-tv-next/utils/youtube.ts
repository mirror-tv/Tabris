import type { YoutubeItem, YoutubeResponse } from '~/types/youtube'
import type { FormatPlayListItems } from '~/types/api-data'

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

export { formateYoutubeListRes }
