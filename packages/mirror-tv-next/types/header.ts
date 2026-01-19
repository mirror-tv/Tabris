import type { Category } from '~/graphql/query/category'
import type { Sponsor } from '~/graphql/query/sponsors'

type BannerImage = {
  urlMobileSized: string
  urlTabletSized: string
  urlOriginal: string
}

export type Show = {
  id: string
  slug: string
  name: string
  sortOrder: string | null
  bannerImg: BannerImage | null
  listShow?: boolean | null
}

export type HeaderData = {
  allCategories: Category[]
  allShows: Show[]
  allSponsors: Sponsor[]
}
