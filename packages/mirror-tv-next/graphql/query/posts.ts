import gql from 'graphql-tag'
import { ListingPost, listingPost } from '../fragments/listing-post'
import { HeroImage } from '~/types/common'

export type PostCardItem = ListingPost & {
  publishTime: string
  ogImage?: HeroImage | null
  __typename?: 'Post'
}

export type PostWithCategory = ListingPost & {
  publishTime: string | Date
  categories: {
    slug: string
    name: string
  }[]
  heroVideo?: {
    coverPhoto: HeroImage | null
  } | null
  __typename?: 'Post'
}

const getPostsByTagName = gql`
  query fetchPostsByTagName(
    $tagName: String!
    $first: Int = 12
    $skip: Int = 0
    $withCount: Boolean = false
    $filteredSlug: [String!] = [""]
  ) {
    posts(
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
        imageApiData
      }
    }
    count: postsCount(
      where: {
        state: { equals: "published" }
        slug: { notIn: $filteredSlug }
        categories: { some: { slug: { notIn: ["ombuds"] } } }
        tags: { some: { name: { equals: $tagName } } }
      }
    ) @include(if: $withCount)
  }
  ${listingPost}
`

const getLatestPosts = gql`
  query fetchLatestPosts($first: Int = 5, $filteredSlug: [String!] = [""]) {
    posts(
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
    posts(
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

const getVideoPostsByCategorySlug = gql`
  query fetchVideoPostsByCategorySlug(
    $category: String!
    $first: Int = 10
    $skip: Int = 0
    $style: String
    $withCount: Boolean = false
    $filteredSlug: [String!] = [""]
  ) {
    posts(
      where: {
        categories: {
          some: { slug: { equals: $category } }
          every: { slug: { notIn: ["ombuds"] } }
        }
        state: { equals: "published" }
        slug: { notIn: $filteredSlug }
        style: { equals: $style }
      }
      take: $first
      skip: $skip
      orderBy: { publishTime: desc }
    ) {
      ...listingPostFragment
    }
    postsCount(
      where: {
        categories: {
          some: { slug: { equals: $category } }
          every: { slug: { notIn: ["ombuds"] } }
        }
        state: { equals: "published" }
        slug: { notIn: $filteredSlug }
        style: { equals: $style }
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
    posts(
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
          imageApiData
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
`

export {
  getPostsByTagName,
  getLatestPosts,
  getPostsByCategorySlug,
  getVideoPostsByCategorySlug,
  getPostsWithCategory,
}
