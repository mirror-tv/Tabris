export type RawPopularPost = {
  id: string
  name: string
  slug: string
  source: string
  heroImage: {
    urlMobileSized: string
    urlOriginal: string
    urlDesktopSized: string
    urlTabletSized: string
    urlTinySized: string
  }
  publishTime: string
}

export type RawPopularPostData = {
  report: RawPopularPost[]
}
