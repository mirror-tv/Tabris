import gql from 'graphql-tag'
import { heroImageFragment } from './hero-image'

export type ListingPost = {
  slug: string
  style?: string | null
  name: string
  heroImage: string | null
  exclusive: boolean | null
  __typename?: 'Post' | 'External'
}

const listingPost = gql`
  fragment listingPostFragment on Post {
    slug
    style
    name
    heroImage {
      ...heroImageFragment
    }
    exclusive
  }
  ${heroImageFragment}
`

export { listingPost }
