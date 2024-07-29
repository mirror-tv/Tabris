import gql from 'graphql-tag'
import type { HeroImage } from '~/types/common'

export type ListingPost = {
  slug: string
  style?: string
  name: string
  heroImage: HeroImage | null
}

const listingPost = gql`
  fragment listingPostFragment on Post {
    slug
    style
    name
    heroImage {
      urlOriginal
      urlDesktopSized
      urlTabletSized
      urlMobileSized
      urlTinySized
    }
  }
`

export { listingPost }
