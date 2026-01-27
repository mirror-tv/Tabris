export type FlashNews = {
  slug: string
  name: string
}

export type ImageApiDataSize = {
  url: string
  width?: number
  height?: number
}

export type ImageApiData = {
  url?: string
  w480?: ImageApiDataSize
  w800?: ImageApiDataSize
  w1200?: ImageApiDataSize
  w1600?: ImageApiDataSize
  w2400?: ImageApiDataSize
  original?: ImageApiDataSize
}

export type HeroImage = {
  imageApiData?: ImageApiData | string | null
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
