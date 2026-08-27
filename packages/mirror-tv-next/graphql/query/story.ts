import gql from 'graphql-tag'
import type { TypedDocumentNode } from '@apollo/client'
import { IS_PREVIEW_MODE } from '~/constants/environment-variables'
import {
  SHOW_ALGO_TAGS,
  SHOW_ALGO_RELATED_POSTS,
} from '~/constants/runtime-config'
import type { HeroImage } from '~/types/common'
import { heroImageFragment } from '../fragments/hero-image'

const postStateFilter = IS_PREVIEW_MODE
  ? ''
  : ', state: { notIn: ["invisible"] }'

// tags_algo only exists on CMS builds that ship auto tagging; querying it
// elsewhere fails the whole request, so the field is gated by the toggle
const algoTagsField = SHOW_ALGO_TAGS ? 'tags_algo { name }' : ''
const algoRelatedPostsField = SHOW_ALGO_RELATED_POSTS
  ? 'relatedPosts_algo(where: { state: { equals: "published" } }) { slug name }'
  : ''

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
  relatedPosts_algo?: SingleRelatedPost[]
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
  tags_algo?: {
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

const fetchStoryBySlug: TypedDocumentNode<
  { allPosts: SinglePost[] },
  { slug: string }
> = gql`
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
      ${algoRelatedPostsField}
      tags {
        name
      }
      tagsInInputOrder {
        name
      }
      ${algoTagsField}
    }
  }
  ${heroImageFragment}
`

export { fetchStoryBySlug }
