import gql from 'graphql-tag'

export type Video = {
  id: string
  youtubeUrl: string
  url: string
  description?: string
}

const getVideoByName = gql`
  query fetchVideoByName(
    $name: String!
    $take: Int
    $withDescription: Boolean!
  ) {
    allVideos(where: { name: $name, state: published }, first: $take) {
      id
      youtubeUrl
      url
      description @include(if: $withDescription)
    }
  }
`

export { getVideoByName }
