type Category = {
  name: string
  slug: string
  sortOrder: number | null
  id: string
  style?: 'normal' | 'highlight'
}

export type Show = {
  id: string
  slug: string
  name: string
  sortOrder: number | null
  bannerImage: string | null
  listShow?: boolean | null
}

type Sponsor = {
  id: string
  title: string | null
  url: string | null
  logo: string | null
  mobile: string | null
  tablet: string | null
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
  bannerImage: string | null
  listShow?: boolean | null
}

export type RawSponsorImage = {
  w480?: string
}

export type RawSponsor = {
  id: string
  title: string | null
  url: string | null
  logo: string | null
  mobile: string | null
  tablet: string | null
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
