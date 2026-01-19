import gql from 'graphql-tag'
import type { HeroImage } from '~/types/common'
import { ListingPost } from '../fragments/listing-post'

export type Topic = {
  id: string
  slug: string
  name: string
  briefApiData: string
  heroImage: HeroImage
  sortDir?: string
}

type HeroVideo = {
  url: string
}

export type Slideshow = {
  id: string
  slug: string
  name: string
  heroImage: HeroImage
}

export type Multivideo = {
  id: string
  youtubeUrl: string
  url: string
}

type Category = {
  name: string
}

export type Post = ListingPost & {
  id: string
  title: string
  publishTime: string
  categories: Category[]
}

// Response type for fetchSingleTopicByTopicSlug (new k6 structure)
export type PostsByTagNameResponse = {
  posts: Array<{
    publishTime: string
    slug: string
    style: string
    name: string
    heroImage: {
      imageApiData: string | null
    } | null
    exclusive: boolean | null
    ogImage: {
      imageApiData: string | null
    } | null
  }>
  count?: number
}

export type SingleTopic = Topic & {
  title: string
  sortDir: string
  leading: string
  facebook: string
  briefHtml: string
  instagram: string
  line: string
  heroImage: HeroImage
  heroVideo: HeroVideo
  slideshow: Slideshow[]
  multivideo: Multivideo[]
  meta: {
    count: number
  }
}

export type FeatureTopic = Omit<Topic, 'briefApiData'> & {
  postDESC: {
    slug: string
    name: string
  }[]
  postASC: { slug: string; name: string }[]
}

const getTopics = gql`
  query fetchTopics($first: Int = 12, $skip: Int, $withCount: Boolean = true) {
    topics(
      take: $first
      skip: $skip
      where: { state: { equals: "published" } }
      orderBy: [{ sortOrder: asc }, { updatedAt: desc }]
    ) {
      id
      slug
      name
      briefApiData
      heroImage {
        imageApiData
      }
    }
    count: topicsCount(where: { state: { equals: "published" } })
      @include(if: $withCount)
  }
`

const fetchSingleTopicByTopicSlug = gql`
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
      slug
      style
      name
      heroImage {
        imageApiData
      }
      exclusive
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
`

const fetchPostItemsByTopicSlug = gql`
  query fetchPostItemsByTopicSlug(
    $topicSlug: String!
    $first: Int = 12
    $skip: Int
    $postDir: [PostOrderByInput!] = { publishTime: desc }
  ) {
    topic: topics(
      where: { state: { equals: "published" }, slug: { equals: $topicSlug } }
    ) {
      items: post(
        where: { state: { equals: "published" } }
        take: $first
        skip: $skip
        orderBy: $postDir
      ) {
        id
        slug
        title: name
        publishTime
        heroImage {
          imageApiData
        }
        categories {
          name
        }
      }
    }
  }
`

const fetchPostSortDirBySlug = gql`
  query fetchPostSortDirBySlug($topicSlug: String!) {
    topic: allTopics(where: { state: published, slug: $topicSlug }) {
      sortDir
    }
  }
`

const fetchFeatureTopics = gql`
  query fetchFeaturedTopics($topicFirst: Int = 4, $postFirst: Int = 3) {
    allTopics(
      where: { state: published, isFeatured: true }
      first: $topicFirst
      sortBy: [sortOrder_ASC, updatedAt_DESC]
    ) {
      id
      slug
      name
      heroImage {
        imageApiData
      }
      sortDir
      postDESC: post(
        first: $postFirst
        sortBy: publishTime_DESC
        where: { state: published }
      ) {
        slug
        name
      }
      postASC: post(
        first: $postFirst
        sortBy: publishTime_ASC
        where: { state: published }
      ) {
        slug
        name
      }
    }
  }
`

export {
  fetchPostItemsByTopicSlug,
  fetchPostSortDirBySlug,
  fetchSingleTopicByTopicSlug,
  getTopics,
  fetchFeatureTopics,
}
