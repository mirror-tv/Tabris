import gql from 'graphql-tag'
import { heroImageFragment } from '../fragments/hero-image'
import {
  type HeroImage,
  ListingPost,
  listingPost,
} from '../fragments/listing-post'
import type { FormattableHeroImage } from '~/types/hero-image'

export type PostCardItem<T extends string | null | HeroImage = HeroImage> =
  ListingPost<T> & {
    publishTime: string
    ogImage?: FormattableHeroImage
    partner?: {
      name: string
      slug?: 'external'
    }
    __typename?: 'Post' | 'External'
  }

export type PostWithCategory<T extends string | null | HeroImage = HeroImage> =
  ListingPost<T> & {
    publishTime: string | Date
    categories: {
      slug?: string
      name: string
    }[]
    heroVideo?: {
      coverPhoto: FormattableHeroImage
    } | null
    partner?: {
      name: string
      slug: string
    }
    exclusive?: boolean | null
    __typename?: 'Post' | 'External'
  }

const getPostsByTagName = gql`
  query fetchPostsByTagName(
    $tagName: String!
    $first: Int = 12
    $skip: Int = 0
    $withCount: Boolean = false
    $filteredSlug: [String!] = [""]
  ) {
    allPosts: posts(
      where: {
        state: { equals: "published" }
        slug: { notIn: $filteredSlug }
        categories: { some: { slug: { notIn: ["ombuds"] } } }
        tags: { some: { name: { equals: $tagName } } }
      }
      take: $first
      skip: $skip
      orderBy: { publishTime: desc }
    ) {
      publishTime
      ...listingPostFragment
      ogImage {
        ...heroImageFragment
      }
    }
    postsCount(
      where: {
        state: { equals: "published" }
        slug: { notIn: $filteredSlug }
        categories: { some: { slug: { notIn: ["ombuds"] } } }
        tags: { some: { name: { equals: $tagName } } }
      }
    ) @include(if: $withCount)
  }
  ${listingPost}
  ${heroImageFragment}
`

const getLatestPosts = gql`
  query fetchLatestPosts($first: Int = 5, $filteredSlug: [String!] = [""]) {
    allPosts: posts(
      where: {
        slug: { notIn: $filteredSlug }
        categories: { some: { slug: { notIn: "ombuds" } } }
        state: { equals: "published" }
      }
      take: $first
      orderBy: { publishTime: desc }
    ) {
      publishTime
      ...listingPostFragment
    }
  }
  ${listingPost}
`

const getPostsByCategorySlug = gql`
  query fetchPostsByCategorySlug(
    $categorySlug: String!
    $first: Int = 13
    $skip: Int = 0
    $withCount: Boolean = false
    $filteredSlug: [String!] = [""]
  ) {
    allPosts: posts(
      where: {
        state: { equals: "published" }
        slug: { notIn: $filteredSlug }
        categories: { some: { slug: { equals: $categorySlug } } }
      }
      take: $first
      skip: $skip
      orderBy: [{ publishTime: desc }, { id: desc }]
    ) {
      publishTime
      ...listingPostFragment
    }

    postsCount(
      where: {
        state: { equals: "published" }
        slug: { notIn: $filteredSlug }
        categories: { some: { slug: { equals: $categorySlug } } }
      }
    ) @include(if: $withCount)
  }
  ${listingPost}
`

const getPostsWithCategory = gql`
  query getPostsWithCategory(
    $first: Int = 12
    $skip: Int = 0
    $withCount: Boolean = false
    $filteredSlug: [String!] = [""]
  ) {
    allPosts: posts(
      where: {
        state: { equals: "published" }
        slug: { notIn: $filteredSlug }
        style: { notIn: ["wide", "projects", "script", "campaign", "readr"] }
      }
      take: $first
      skip: $skip
      orderBy: { publishTime: desc }
    ) {
      ...listingPostFragment
      publishTime
      categories {
        slug
        name
      }
      heroVideo {
        coverPhoto {
          ...heroImageFragment
        }
      }
    }
    postsCount(
      where: {
        state: { equals: "published" }
        slug: { notIn: $filteredSlug }
        style: { notIn: ["wide", "projects", "script", "campaign", "readr"] }
      }
    ) @include(if: $withCount)
  }
  ${listingPost}
  ${heroImageFragment}
`

export {
  getPostsByTagName,
  getLatestPosts,
  getPostsByCategorySlug,
  getPostsWithCategory,
}
