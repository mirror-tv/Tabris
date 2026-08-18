import gql from 'graphql-tag'
import type { TypedDocumentNode } from '@apollo/client'
import {
  listingExternal,
  type ListingExternal,
} from '../fragments/listing-external'

export type External = ListingExternal

const getExternalsByTagName: TypedDocumentNode<
  { allExternals: External[]; externalsCount?: number },
  {
    tagName: string
    first?: number
    skip?: number
    withCount?: boolean
    filteredSlug?: string[]
  }
> = gql`
  query fetchExternalsByTagName(
    $tagName: String!
    $first: Int = 12
    $skip: Int = 0
    $withCount: Boolean = false
    $filteredSlug: [String!] = [""]
  ) {
    allExternals: externals(
      where: {
        state: { equals: "published" }
        slug: { notIn: $filteredSlug }
        tags: { some: { name: { equals: $tagName } } }
      }
      take: $first
      skip: $skip
      orderBy: { publishTime: desc }
    ) {
      ...listingExternalFragment
    }
    externalsCount(
      where: {
        state: { equals: "published" }
        slug: { notIn: $filteredSlug }
        tags: { some: { name: { equals: $tagName } } }
      }
    ) @include(if: $withCount)
  }
  ${listingExternal}
`

const getExternalsByCategory: TypedDocumentNode<
  { allExternals: External[]; externalsCount?: number },
  {
    categorySlug: string
    first?: number
    skip?: number
    withCount?: boolean
    filteredSlug?: string[]
  }
> = gql`
  query fetchExternalsByCategory(
    $categorySlug: String!
    $first: Int = 12
    $skip: Int = 0
    $withCount: Boolean = false
    $filteredSlug: [String!] = [""]
  ) {
    allExternals: externals(
      where: {
        state: { equals: "published" }
        slug: { notIn: $filteredSlug }
        categories: { some: { slug: { equals: $categorySlug } } }
      }
      take: $first
      skip: $skip
      orderBy: { publishTime: desc }
    ) {
      ...listingExternalFragment
    }
    externalsCount(
      where: {
        state: { equals: "published" }
        slug: { notIn: $filteredSlug }
        categories: { some: { slug: { equals: $categorySlug } } }
      }
    ) @include(if: $withCount)
  }
  ${listingExternal}
`

export { getExternalsByTagName, getExternalsByCategory }
