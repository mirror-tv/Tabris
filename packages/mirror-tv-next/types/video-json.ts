/** Single item in video.json "videos" array */
export type VideoJsonItem = {
  id: string
  name: string
  youtubeUrl: string
  url: string
  description: string
  createdAt: string
}

/** Single item in video.json "promotionVideos" array */
export type PromotionVideoJsonItem = {
  id: string
  ytUrl: string
}

/** Full video.json response shape */
export type RawVideoJson = {
  videos: VideoJsonItem[]
  promotionVideos: PromotionVideoJsonItem[]
  timestamp?: string
}
