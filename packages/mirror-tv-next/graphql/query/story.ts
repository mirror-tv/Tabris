import gql from 'graphql-tag'

export interface SingleRelatedPost {
  slug: string
  name: string
}

export interface SinglePost {
  contentApiData: string
  relatedPosts: SingleRelatedPost[]
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
  __typename: string
}

const fetchStoryBySlug = gql`
  query fetchStoryBySlug($slug: String!) {
    allPosts(where: { slug: $slug, state_not_in: invisible }) {
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
      contentApiData
      relatedPosts(where: { state: published }) {
        slug
        name
      }
    }
  }
`

export { fetchStoryBySlug }
