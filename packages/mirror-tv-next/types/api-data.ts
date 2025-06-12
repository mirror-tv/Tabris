import type { HeroImage } from './common'

export type ApiData = {
  id: string
  type: string
  alignment: string
  content: string[]
  styles: Record<string, unknown>
}

type Category = {
  id: string
  name: string
  slug: string
}

export type FeaturePost = {
  id: string
  name: string
  subtitle: string
  slug: string
  style: string
  publishTime: string
  categories: Category[]
  heroImage: HeroImage
}

export type FormatPlayListItems = {
  name?: string
  id: string
  items: { id: string; title: string }[] | undefined
  nextPageToken: string | undefined
  totalItems: number
}

export type YoutubeListInfoFormatted = {
  url: string
  sectionName: string
}

export type YoutubeThumbnail = {
  url: string
  width: number
  height: number
}

export type YoutubeItem = {
  id: string // This is the playlist item ID
  snippet: {
    publishedAt: string
    channelId: string
    title: string
    description: string
    thumbnails: {
      default: YoutubeThumbnail
      medium: YoutubeThumbnail
      high: YoutubeThumbnail
      standard: YoutubeThumbnail
      maxres: YoutubeThumbnail
    }
    channelTitle: string
    playlistId: string
    position: number
    resourceId: {
      kind: string
      videoId: string // This is the actual YouTube video ID
    }
    videoOwnerChannelTitle: string
    videoOwnerChannelId: string
  }
}

export type YoutubeResponse = {
  kind: string
  etag: string
  nextPageToken?: string
  prevPageToken?: string
  items: YoutubeItem[]
  pageInfo: {
    totalResults: number
    resultsPerPage: number
  }
}
