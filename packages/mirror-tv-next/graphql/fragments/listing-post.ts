import gql from 'graphql-tag'
import type { FormattableHeroImage } from '~/types/hero-image'

export type ListingPost = {
  slug: string
  style?: string | null
  name: string
  heroImage: FormattableHeroImage
  exclusive: boolean | null
  __typename?: 'Post'
}

const listingPost = gql`
  fragment listingPostFragment on Post {
    slug
    style
    name
    heroImage {
      imageApiData
    }
    exclusive
  }
`

export { listingPost }
