import gql from 'graphql-tag'
import type { TypedDocumentNode } from '@apollo/client'
import { type ListingPost, listingPost } from '../fragments/listing-post'

export type Post = ListingPost & {
  publishTime: string
}

const fetchOmbudsPostsByCategorySlug: TypedDocumentNode<
  { allPosts: Post[]; postsCount?: number },
  {
    filteredSlug?: string[]
    withCount?: boolean
    skip?: number
    first?: number
  }
> = gql`
  query fetchOmbudsPostsByCategorySlug(
    $filteredSlug: [String!] = [""]
    $withCount: Boolean = true
    $skip: Int = 0
    $first: Int = 8
  ) {
    allPosts: posts(
      where: {
        state: { equals: "published" }
        slug: { notIn: $filteredSlug }
        categories: { some: { slug: { equals: "ombuds" } } }
      }
      take: $first
      skip: $skip
      orderBy: { publishTime: desc }
    ) {
      publishTime
      ...listingPostFragment
    }
    postsCount(
      where: {
        state: { equals: "published" }
        slug: { notIn: $filteredSlug }
        categories: { some: { slug: { equals: "ombuds" } } }
      }
    ) @include(if: $withCount)
  }
  ${listingPost}
`
export { fetchOmbudsPostsByCategorySlug }
