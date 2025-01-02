import gql from 'graphql-tag'

export type External = {
  publishTime: string
  slug: string
  name: string
  thumbnail: string | null
}

const getExternalsByTagName = gql`
  query fetchExternalsByTagName(
    $tagName: String!
    $first: Int = 12
    $skip: Int = 0
    $withCount: Boolean = false
    $filteredSlug: [String] = [""]
  ) {
    allExternals(
      where: {
        state: published
        slug_not_in: $filteredSlug
        tags_some: { name: $tagName }
      }
      first: $first
      skip: $skip
      sortBy: publishTime_DESC
    ) {
      publishTime
      slug
      name
      thumbnail
    }
    _allExternalsMeta(
      where: {
        state: published
        slug_not_in: $filteredSlug
        tags_some: { name: $tagName }
      }
    ) @include(if: $withCount) {
      count
    }
  }
`

export { getExternalsByTagName }
