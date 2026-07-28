import gql from 'graphql-tag'
import { heroImageFragment } from './hero-image'

import type { K6FlatHeroImage, K6NestedHeroImage } from '~/types/hero-image'

export type HeroImage = Omit<K6NestedHeroImage, 'id'> & {
  imageApiData: Record<
    keyof K6FlatHeroImage,
    {
      url: string
      width: number
      height: number
    }
  > & { url: string }
}

export type ListingPost<T extends string | null | HeroImage = HeroImage> = {
  slug: string
  style?: string | null
  name: string
  heroImage: T
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
