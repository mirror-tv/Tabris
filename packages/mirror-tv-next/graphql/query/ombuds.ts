import gql from 'graphql-tag'
import { ListingPost, listingPost } from '../fragments/listing-post'

export type Post = ListingPost & {
  publishTime: string
}

const fetchOmbudsPostsByCategorySlug = gql`
  query fetchOmbudsPostsByCategorySlug(
    $filteredSlug: [String] = [""]
    $withCount: Boolean = true
    $skip: Int = 0
    $first: Int = 8
  ) {
    allPosts(
      where: {
        state: published
        slug_not_in: $filteredSlug
        categories_some: { slug: "ombuds" }
      }
      first: $first
      skip: $skip
      sortBy: publishTime_DESC
    ) {
      publishTime
      ...listingPostFragment
    }
    _allPostsMeta(
      where: {
        state: published
        slug_not_in: $filteredSlug
        categories_some: { slug: "ombuds" }
      }
    ) @include(if: $withCount) {
      count
    }
  }
  ${listingPost}
`
export { fetchOmbudsPostsByCategorySlug }
