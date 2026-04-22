import type { HeroImage } from './common'
import type { K6FlatHeroImage } from './hero-image'

export type RawPopularPost = {
  id: string
  name: string
  slug: string
  source: string
  heroImage: HeroImage | K6FlatHeroImage | null
  publishTime: string
}

export type PopularListReportItem = {
  id: string
  name: string
  slug: string
  source: string
  publishTime: string
  heroImage: HeroImage | K6FlatHeroImage | null
}

/** Full popularlist.json response shape */
export type RawPopularListJson = {
  report: PopularListReportItem[]
  start_date?: string
  end_date?: string
  generate_time?: string
}

export type RawPopularPostData = {
  report: RawPopularPost[]
}
