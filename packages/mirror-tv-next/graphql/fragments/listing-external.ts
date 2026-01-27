import gql from 'graphql-tag'

export type ListingExternal = {
  publishTime: string
  slug: string
  name: string
  thumbnail?: string | null
}

const listingExternal = gql`
  fragment listingExternalFragment on External {
    publishTime
    slug
    name
    thumbnail
  }
`

export { listingExternal }
