export type FlashNews = {
  slug: string
  name: string
}

/** Image API shape (e.g. from GraphQL heroImage.imageApiData) */
export type ImageApiData = {
  url?: string
  original?: { url: string }
  w2400?: { url: string }
  w1600?: { url: string }
  w1200?: { url: string }
  w800?: { url: string }
  w480?: { url: string }
}

export type K6FlatHeroImage = {
  original?: string
  w2400?: string
  w1600?: string
  w1200?: string
  w800?: string
  w480?: string
}

export type HeroImage = {
  urlDesktopSized?: string
  urlTabletSized?: string
  urlMobileSized?: string
  urlTinySized?: string
  urlOriginal?: string
  /** GraphQL / API format */
  imageApiData?: string | ImageApiData
  /** K6 / Lilith image format */
  resized?: K6FlatHeroImage
  resizedWebp?: K6FlatHeroImage
}

export type Schedule = {
  'Channel ID': string
  Year: string
  WeekDay: string
  'Start Time(hh)': string
  'Start Time(mm)': string
  Duration: string
  Programme: string
  'Programme(en)': string
  'ep no': string
  'ep name': string
  'season no': string
  Class: string
  TxCategory: string
  Month: string
  Day: string
}

export type Podcast = {
  published: string
  author: string | null
  description: string | null
  heroImage: string | null
  enclosures: {
    url: string
    file_size: number
    mime_type: string
  }[]
  link: string | null
  guid: string | null
  title: string | null
  duration: string | null
  category: string | null
}
