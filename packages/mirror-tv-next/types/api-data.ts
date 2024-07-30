import type { HeroImage } from './common'

export type ApiData = {
  id: string
  type: string
  alignment: string
  content: string[]
  styles: Record<string, unknown>
}

// popular search result type

export type PopularSearchItem = {
  id: string
  heroImage: HeroImage | null
  name: string
  publishTime: string
  slug: string
  source: string
}

export type PopularSearchItemResponse = {
  report: PopularSearchItem[]
  start_date: string
  end_date: string
  generate_time: string
}
