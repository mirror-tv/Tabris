import gql from 'graphql-tag'
import { ListingPost, listingPost } from '../fragments/listing-post'
import { HeroImage } from '~/types/common'

export type PostCardItem = ListingPost & {
  publishTime: string
  ogImage?: HeroImage | null
}

const getPostsByTagName = gql`
  query fetchPostsByTagName(
    $tagName: String!
    $first: Int = 12
    $skip: Int = 0
    $withCount: Boolean = false
    $filteredSlug: [String] = [""]
  ) {
    allPosts(
      where: {
        state: published
        slug_not_in: $filteredSlug
        categories_some: { slug_not_in: "ombuds" }
        tags_some: { name: $tagName }
      }
      first: $first
      skip: $skip
      sortBy: publishTime_DESC
    ) {
      publishTime
      ...listingPostFragment
      ogImage {
        urlOriginal
        urlDesktopSized
        urlTabletSized
        urlMobileSized
        urlTinySized
      }
    }
    _allPostsMeta(
      where: {
        state: published
        slug_not_in: $filteredSlug
        categories_some: { slug_not_in: "ombuds" }
        tags_some: { name: $tagName }
      }
    ) @include(if: $withCount) {
      count
    }
  }
  ${listingPost}
`

const getLatestPosts = gql`
  query fetchLatestPosts($first: Int = 5, $filteredSlug: [String] = [""]) {
    allPosts(
      where: {
        slug_not_in: $filteredSlug
        categories_some: { slug_not_in: "ombuds" }
        state: published
      }
      first: $first
      sortBy: publishTime_DESC
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
    $filteredSlug: [String] = [""]
  ) {
    allPosts(
      where: {
        state: published
        slug_not_in: $filteredSlug
        categories_some: { slug: $categorySlug }
      }
      first: $first
      skip: $skip
      sortBy: [publishTime_DESC, id_DESC]
    ) {
      publishTime
      ...listingPostFragment
    }

    _allPostsMeta(
      where: {
        state: published
        slug_not_in: $filteredSlug
        categories_some: { slug: $categorySlug }
      }
    ) @include(if: $withCount) {
      count
    }
  }
  ${listingPost}
`

const getVideoPostsByCategorySlug = gql`
  query fetchVideoPostsByCategorySlug(
    $category: String!
    $first: Int = 10
    $skip: Int = 0
    $style: PostStyleType
    $withCount: Boolean = false
    $filteredSlug: [String] = [""]
  ) {
    allPosts(
      where: {
        categories_some: { slug: $category }
        state: published
        slug_not_in: $filteredSlug
        categories_every: { slug_not_in: "ombuds" }
        style: $style
      }
      first: $first
      skip: $skip
      sortBy: publishTime_DESC
    ) {
      ...listingPostFragment
    }
    _allPostsMeta(
      where: {
        categories_some: { slug: $category }
        state: published
        slug_not_in: $filteredSlug
        categories_every: { slug_not_in: "ombuds" }
        style: $style
      }
    ) @include(if: $withCount) {
      count
    }
  }
  ${listingPost}
`

export {
  getPostsByTagName,
  getLatestPosts,
  getPostsByCategorySlug,
  getVideoPostsByCategorySlug,
}
