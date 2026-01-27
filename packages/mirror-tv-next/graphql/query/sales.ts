import gql from 'graphql-tag'
import { ListingPost, listingPost } from '../fragments/listing-post'

type Sale = {
  id: string
  adPost: ListingPost & {
    publishTime: string
    categories: {
      name: string
    }[]
  }
  __typename: 'Sale'
}

const getSales = gql`
  query fetchSales($first: Int = 4) {
    allSales(
      where: { state: published, adPost: { state: published } }
      sortBy: [sortOrder_ASC, updatedAt_DESC]
      first: $first
    ) {
      id
      adPost {
        ...listingPostFragment
        publishTime
        categories {
          name
        }
      }
    }
  }
  ${listingPost}
`

export { getSales }
export type { Sale }
