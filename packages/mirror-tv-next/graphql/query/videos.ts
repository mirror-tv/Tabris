import gql from 'graphql-tag'
import type { TypedDocumentNode } from '@apollo/client'

export type Video = {
  id: string
  youtubeUrl: string
  url: string
  description?: string | null
}

const getVideoByName: TypedDocumentNode<
  { videos: Video[] },
  { name: string; take?: number; withDescription?: boolean }
> = gql`
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
