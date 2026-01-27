type Category = {
  name: string
  slug: string
  sortOrder: number | null
  id: string
  style?: 'normal' | 'highlight'
}

type BannerImage = {
  urlMobileSized: string
  urlTabletSized: string
  urlOriginal: string
}

export type Show = {
  id: string
  slug: string
  name: string
  sortOrder: number | null
  bannerImg: BannerImage | null
  listShow?: boolean | null
}

type Sponsor = {
  id: string
  title: string | null
  url: string | null
  logo: {
    urlMobileSized: string
  } | null
  mobile: {
    urlMobileSized: string
  } | null
  tablet: {
    urlMobileSized: string
  } | null
  topic: {
    id: string
    slug: string
    name: string
  } | null
}

export type HeaderData = {
  allCategories: Category[]
  allShows: Show[]
  allSponsors: Sponsor[]
}

// New JSON format types
export type RawBannerImage = {
  w480?: string
  w800?: string
  original?: string
}

export type RawShow = {
  id: string
  slug: string
  name: string
  sortOrder: number | null
  bannerImg: RawBannerImage | null
  listShow?: boolean | null
}

export type RawSponsorImage = {
  w480?: string
}

export type RawSponsor = {
  id: string
  title: string | null
  url: string | null
  logo: RawSponsorImage | null
  mobile: RawSponsorImage | null
  tablet: RawSponsorImage | null
  topic: {
    id: string
    slug: string
    name: string
  } | null
}

export type RawHeaderJson = {
  categories: Category[]
  shows: RawShow[]
  sponsors: RawSponsor[]
}
