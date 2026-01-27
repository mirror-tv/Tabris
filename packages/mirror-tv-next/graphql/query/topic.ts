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
    allTopics(
      first: $first
      skip: $skip
      where: { state: published }
      sortBy: [sortOrder_ASC, updatedAt_DESC]
    ) {
      id
      slug
      name
      briefApiData
      heroImage {
        urlMobileSized
        urlTabletSized
        urlOriginal
      }
    }
    _allTopicsMeta(where: { state: published }) @include(if: $withCount) {
      count
    }
  }
`

const fetchSingleTopicByTopicSlug = gql`
  query fetchSingleTopicByTopicSlug(
    $topicSlug: String!
    $withCount: Boolean = true
  ) {
    topic: allTopics(where: { state: published, slug: $topicSlug }) {
      id
      title: name
      sortDir
      leading
      facebook
      briefHtml
      instagram
      line
      heroImage {
        urlDesktopSized
        urlTabletSized
        urlMobileSized
        urlOriginal
      }
      heroVideo {
        url
      }
      slideshow {
        id
        slug
        name
        heroImage {
          urlTabletSized
          urlDesktopSized
          urlMobileSized
          urlOriginal
        }
      }
      multivideo {
        id
        youtubeUrl
        url
      }
      meta: _postMeta(where: { state: published }) @include(if: $withCount) {
        count
      }
    }
  }
`

const fetchPostItemsByTopicSlug = gql`
  query fetchPostItemsByTopicSlug(
    $topicSlug: String!
    $first: Int = 12
    $skip: Int
    $postDir: [SortPostsBy!] = publishTime_DESC
  ) {
    topic: allTopics(where: { state: published, slug: $topicSlug }) {
      items: post(
        where: { state: published }
        first: $first
        skip: $skip
        sortBy: $postDir
      ) {
        id
        slug
        title: name
        publishTime
        heroImage {
          urlDesktopSized
          urlTabletSized
          urlMobileSized
          urlOriginal
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
        urlMobileSized
        urlTabletSized
        urlOriginal
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
