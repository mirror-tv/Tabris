import gql from 'graphql-tag'

const fetchFeatureCategories = gql`
  query fetchFeatureCategories {
    allCategories: categories(
      where: { isFeatured: { equals: true } }
      orderBy: [{ sortOrder: asc }, { id: desc }]
    ) {
      name
      slug
    }
  }
`

export { fetchFeatureCategories }
