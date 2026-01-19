import gql from 'graphql-tag'
import {
  listingExternal,
  type ListingExternal,
} from '../fragments/listing-external'

export type External = ListingExternal

const getExternalsByTagName = gql`
  query fetchExternalsByTagName(
    $tagName: String!
    $first: Int = 12
    $skip: Int = 0
    $withCount: Boolean = false
    $filteredSlug: [String!] = [""]
  ) {
    externals(
      where: {
        state: { equals: "published" }
        slug: { notIn: $filteredSlug }
        tags: { some: { name: { equals: $tagName } } }
      }
      take: $first
      skip: $skip
      orderBy: { publishTime: desc }
    ) {
      id
      # ...listingExternalFragment
    }
    count: externalsCount(
      where: {
        state: { equals: "published" }
        slug: { notIn: $filteredSlug }
        tags: { some: { name: { equals: $tagName } } }
      }
    ) @include(if: $withCount)
  }
  ${listingExternal}
`

const getExternalsByCategory = gql`
  query fetchExternalsByCategory(
    $categorySlug: String!
    $first: Int = 12
    $skip: Int = 0
    $withCount: Boolean = false
    $filteredSlug: [String] = [""]
  ) {
    allExternals(
      where: {
        state: published
        slug_not_in: $filteredSlug
        categories_some: { slug: $categorySlug }
      }
      first: $first
      skip: $skip
      sortBy: publishTime_DESC
    ) {
      ...listingExternalFragment
    }
    _allExternalsMeta(
      where: {
        state: published
        slug_not_in: $filteredSlug
        categories_some: { slug: $categorySlug }
      }
    ) @include(if: $withCount) {
      count
    }
  }
  ${listingExternal}
`

export { getExternalsByTagName, getExternalsByCategory }
