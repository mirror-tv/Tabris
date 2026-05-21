import gql from 'graphql-tag'
import { IS_PREVIEW_MODE } from '~/constants/environment-variables'
import type { HeroImage } from '~/types/common'
import { heroImageFragment } from '../fragments/hero-image'

const postStateFilter = IS_PREVIEW_MODE
  ? ''
  : ', state: { notIn: ["invisible"] }'

export interface SingleRelatedPost {
  slug: string
  name: string
}

export interface SinglePersonInfo {
  slug: string
  name: string
}

export interface SinglePost {
  id: string
  title: string
  style: string | null
  publishTime: string
  updatedAt: string | null
  exclusive: boolean | null
  isAdult: boolean | null
  contentApiData: string | null
  briefApiData: string | null
  source?: string | null
  relatedPosts: SingleRelatedPost[]
  relatedPostsInInputOrder?: SingleRelatedPost[]
  heroVideo?: {
    youtubeUrl: string | null
  } | null
  heroImage: HeroImage | null
  heroCaption: string | null
  categories: {
    slug: string
    title: string
  }[]
  categoriesInInputOrder?: {
    slug: string
    title: string
  }[]
  writers: SinglePersonInfo[]
  writersInInputOrder?: { slug: string; name: string }[]
  photographers: SinglePersonInfo[]
  cameraOperators: SinglePersonInfo[]
  designers: SinglePersonInfo[]
  engineers: SinglePersonInfo[]
  vocals: SinglePersonInfo[]
  otherbyline: string | null
  tags: {
    name: string
  }[]
  tagsInInputOrder?: {
    name: string
  }[]
  download?:
    | {
        id: string
        name: string
        url: string
      }[]
    | null
  __typename?: string
}

const fetchStoryBySlug = gql`
  query fetchStoryBySlug($slug: String!) {
    allPosts: posts(
      where: { slug: { equals: $slug }${postStateFilter} }
    ) {
      id
      title: name
      style
      publishTime
      updatedAt
      exclusive
      isAdult
      heroVideo {
        youtubeUrl
      }
      heroImage {
        ...heroImageFragment
      }
      heroCaption
      briefApiData
      contentApiData
      source
      categories {
        slug
        title: name
      }
      categoriesInInputOrder {
        slug
        title: name
      }
      writers {
        name
        slug
      }
      writersInInputOrder {
        slug
        name
      }
      photographers {
        name
        slug
      }
      cameraOperators {
        name
        slug
      }
      designers {
        name
        slug
      }
      engineers {
        name
        slug
      }
      vocals {
        name
        slug
      }
      otherbyline
      download {
        id
        name
        url
      }
      relatedPosts(where: { state: { equals: "published" } }) {
        slug
        name
      }
      relatedPostsInInputOrder {
        slug
        name
      }
      tags {
        name
      }
      tagsInInputOrder {
        name
      }
    }
  }
  ${heroImageFragment}
`

export { fetchStoryBySlug }
