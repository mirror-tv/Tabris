export type YoutubeItem = {
  id: string
  title: string
  snippet: {
    resourceId: {
      videoId: string
    }
    title: string
  }
  status: {
    privacyStatus: string
  }
}

export type YoutubeResponse = {
  id: string
  items: YoutubeItem[] | undefined
  nextPageToken?: string
  pageInfo: { resultsPerPage: number; totalResults: number }
}
