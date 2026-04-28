import gql from 'graphql-tag'

export type Video = {
  id: string
  youtubeUrl: string
  url: string
  description?: string | null
}

const getVideoByName = gql`
  query fetchVideoByName(
    $name: String!
    $take: Int
    $withDescription: Boolean
  ) {
    videos(
      where: { name: { equals: $name }, state: { equals: "published" } }
      take: $take
    ) {
      id
      youtubeUrl
      url
      description @include(if: $withDescription)
    }
  }
`

export { getVideoByName }
