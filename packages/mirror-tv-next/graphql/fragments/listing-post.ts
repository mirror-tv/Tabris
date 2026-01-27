import gql from 'graphql-tag'
import type { HeroImage } from '~/types/common'

export type ListingPost = {
  slug: string
  style?: string | null
  name: string
  heroImage: HeroImage | null
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
