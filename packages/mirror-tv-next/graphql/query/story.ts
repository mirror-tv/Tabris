import gql from 'graphql-tag'
import type { HeroImage } from '~/types/common'

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
  style: string
  publishTime: string
  updatedAt: string
  exclusive: boolean
  isAdult: boolean
  contentApiData: string
  briefApiData: string
  source?: string
  relatedPosts: SingleRelatedPost[]
  heroVideo: {
    youtubeUrl: string
  }
  heroImage: HeroImage | null
  heroCaption: string
  categories: {
    slug: string
    title: string
  }[]
  writers: SinglePersonInfo[]
  photographers: SinglePersonInfo[]
  cameraOperators: SinglePersonInfo[]
  designers: SinglePersonInfo[]
  engineers: SinglePersonInfo[]
  vocals: SinglePersonInfo[]
  otherbyline: string
  tags: {
    name: string
  }[]
  download: {
    id: string
    name: string
    url: string
  }[]
  __typename: string
}

const fetchStoryBySlug = gql`
  query fetchStoryBySlug($slug: String!) {
    allPosts(where: { slug: $slug, state_not_in: invisible }) {
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
        imageApiData
      }
      heroCaption
      briefApiData
      contentApiData
      source
      categories {
        slug
        title: name
      }
      writers {
        name
        slug
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
      relatedPosts(where: { state: published }) {
        slug
        name
      }
      tags {
        name
      }
    }
  }
`

export { fetchStoryBySlug }
