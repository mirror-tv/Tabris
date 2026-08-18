import gql from 'graphql-tag'
import type { TypedDocumentNode } from '@apollo/client'

export type Category = {
  id?: string
  name: string
  slug: string
  style?: 'normal' | 'highlight'
}

const fetchCategoryBySlug: TypedDocumentNode<
  { allCategories: Category[] },
  { slug: string }
> = gql`
  query fetchCategoryBySlug($slug: String!) {
    allCategories: categories(where: { slug: { equals: $slug } }) {
      id
      name
      slug
    }
  }
`

export { fetchCategoryBySlug }
