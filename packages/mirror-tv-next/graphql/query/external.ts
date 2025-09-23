import gql from 'graphql-tag'

export interface SingleRelatedPost {
  slug: string
  name: string
}

export interface SinglePersonInfo {
  slug: string
  name: string
}

export interface SingleExternalPost {
  id: string
  slug: string
  state: string
  partner: {
    name: string
    slug: string
  }
  name: string
  tags: {
    id: string
    name: string
    slug: string
  }[]
  categories: {
    id: string
    slug: string
    name: string
  }[]
  // subtitle?: string
  publishTime: string
  byline?: string
  thumbnail?: string
  heroCaption?: string
  brief_original?: string
  content_original?: string
  brief?: string
  // content: string
  source?: string
  isAdult: boolean
  updatedAt: string
}

const fetchExternalBySlug = gql`
  query fetchExternalBySlug($slug: String!) {
    allExternals(where: { slug: $slug, state: published }) {
      id
      slug
      state
      partner {
        name
        slug
      }
      name
      tags {
        id
        name
        slug
      }
      categories {
        id
        slug
        name
      }
      # subtitle # 待定
      publishTime
      byline # 待定
      thumbnail
      heroCaption
      brief_original
      content_original
      brief # 待定
      # content
      source
      isAdult
      updatedAt
    }
  }
`

export { fetchExternalBySlug }
