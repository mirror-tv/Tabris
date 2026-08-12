import gql from 'graphql-tag'
import type { TypedDocumentNode } from '@apollo/client'
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

const getSales: TypedDocumentNode<
  { allSales: Sale[] },
  { first?: number }
> = gql`
  query fetchSales($first: Int = 4) {
    allSales: sales(
      where: {
        state: { equals: published }
        adPost: { state: { equals: "published" } }
      }
      take: $first
      orderBy: [{ sortOrder: asc }, { updatedAt: desc }]
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
