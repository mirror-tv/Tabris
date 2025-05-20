import gql from 'graphql-tag'

export type Category = {
  id?: string
  name: string
  slug: string
  style?: 'normal' | 'highlight'
}

const fetchCategoryBySlug = gql`
  query fetchCategoryBySlug($slug: String!) {
    allCategories(where: { slug: $slug }) {
      id
      name
      slug
    }
  }
`

export { fetchCategoryBySlug }
