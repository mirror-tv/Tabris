import gql from 'graphql-tag'

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
  contentApiData: string
  briefApiData: string
  relatedPosts: SingleRelatedPost[]
  heroVideo: {
    youtubeUrl: string
  }
  heroImage: {
    id: string
    name: string
    urlOriginal: string
    urlDesktopSized: string
    urlTabletSized: string
    urlMobileSized: string
    urlTinySized: string
  }
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
      heroVideo {
        youtubeUrl
      }
      heroImage {
        id
        name
        urlOriginal
        urlDesktopSized
        urlTabletSized
        urlMobileSized
        urlTinySized
      }
      heroCaption
      briefApiData
      contentApiData
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
