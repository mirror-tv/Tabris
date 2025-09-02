import gql from 'graphql-tag'

const fetchFeatureCategories = gql`
  query fetchFeatureCategories {
    allCategories(
      where: { isFeatured: true }
      sortBy: [sortOrder_ASC, id_DESC]
    ) {
      name
      slug
    }
  }
`

export { fetchFeatureCategories }
