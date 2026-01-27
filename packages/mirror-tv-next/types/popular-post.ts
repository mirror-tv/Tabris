export type RawPopularPost = {
  id: string
  name: string
  slug: string
  source: string
  heroImage: {
    urlMobileSized?: string
    urlOriginal?: string
    urlDesktopSized?: string
    urlTabletSized?: string
    urlTinySized?: string
    // New format support
    w480?: string
    w800?: string
    original?: string
  } | null
  publishTime: string
}

/** Item shape as returned by popularlist.json (before heroImage transform) */
export type PopularListReportItem = {
  id: string
  name: string
  slug: string
  source: string
  publishTime: string
  heroImage: {
    w480?: string
    w800?: string
    original?: string
  } | null
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
