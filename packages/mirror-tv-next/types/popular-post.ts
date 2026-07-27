export type RawPopularPost = {
  id: string
  name: string
  slug: string
  source: string
  heroImage: string | null
  publishTime: string
  exclusive?: boolean
}

export type PopularListReportItem = {
  id: string
  name: string
  slug: string
  source: string
  publishTime: string
  heroImage: string | null
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
