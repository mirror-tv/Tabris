import gql from 'graphql-tag'
import type { HeroImage } from '~/types/common'
import { ListingPost } from '../fragments/listing-post'

export type Topic = {
  id: string
  slug: string
  name: string
  briefApiData: string | null
  heroImage: HeroImage | null
  sortDir?: string
}

type HeroVideo = {
  url: string | null
}

export type Slideshow = {
  id: string
  slug: string
  name: string
  heroImage: HeroImage | null
}

export type Multivideo = {
  id: string
  youtubeUrl: string | null
  url: string | null
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

export type PostOrderByInput = {
  publishTime?: 'asc' | 'desc'
}

export type SingleTopic = Topic & {
  title: string
  sortDir: string | null
  leading: string | null
  facebook: string | null
  briefHtml: string | null
  instagram: string | null
  line: string | null
  heroImage: HeroImage | null
  heroVideo: HeroVideo | null
  slideshow: Slideshow[]
  multivideo: Multivideo[]
  itemsCount: number
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
    allTopics: topics(
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
    topicsCount: topicsCount(where: { state: { equals: "published" } })
      @include(if: $withCount)
  }
`

const fetchSingleTopicByTopicSlug = gql`
  query fetchSingleTopicByTopicSlug($topicSlug: String!) {
    topic: topics(
      where: { state: { equals: "published" }, slug: { equals: $topicSlug } }
    ) {
      id
      slug
      name
      title: name
      sortDir
      leading
      facebook
      briefHtml
      instagram
      line
      heroImage {
        imageApiData
      }
      heroVideo {
        url
      }
      # 排序後的輪播文章
      slideshow: slideshowInInputOrder {
        id
        slug
        name
        heroImage {
          imageApiData
        }
      }
      # 排序後的輪播影片
      multivideo: multivideoInInputOrder {
        id
        name
        youtubeUrl
        url
      }
      # 排序後的 POST 相關文章
      posts: postInInputOrder {
        id
        slug
        name
        state
        heroImage {
          imageApiData
        }
      }

      itemsCount: postCount(where: { state: { equals: "published" } })
    }
  }
`

const fetchPostItemsByTopicSlug = gql`
  query fetchPostItemsByTopicSlug(
    $topicSlug: String!
    $first: Int = 12
    $skip: Int
    $postDir: [PostOrderByInput!] = [{ publishTime: desc }]
  ) {
    topic: topics(
      where: { state: { equals: "published" }, slug: { equals: $topicSlug } }
    ) {
      items: postInInputOrder(
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
    topic: topics(
      where: { state: { equals: "published" }, slug: { equals: $topicSlug } }
    ) {
      sortDir
    }
  }
`

const fetchFeatureTopics = gql`
  query fetchFeaturedTopics($topicFirst: Int = 4, $postFirst: Int = 3) {
    topics(
      where: { state: { equals: "published" }, isFeatured: { equals: true } }
      take: $topicFirst
      orderBy: [{ sortOrder: asc }, { updatedAt: desc }]
    ) {
      id
      slug
      name
      heroImage {
        imageApiData
      }
      sortDir
      postDESC: postInInputOrder(
        take: $postFirst
        orderBy: { publishTime: desc }
        where: { state: { equals: "published" } }
      ) {
        slug
        name
      }
      postASC: postInInputOrder(
        take: $postFirst
        orderBy: { publishTime: asc }
        where: { state: { equals: "published" } }
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
