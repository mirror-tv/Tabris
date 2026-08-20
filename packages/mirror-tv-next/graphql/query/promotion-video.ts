import gql from 'graphql-tag'
import type { TypedDocumentNode } from '@apollo/client'

type PromotionVideo = {
  id: string
  ytUrl: string
}

const getPromotionVideos: TypedDocumentNode<
  { allPromotionVideos: PromotionVideo[] },
  { first?: number }
> = gql`
  query getPromotionVideos($first: Int = 5) {
    allPromotionVideos: promotionVideos(
      where: { state: { equals: "published" } }
      take: $first
      orderBy: [{ sortOrder: asc }, { updatedAt: desc }]
    ) {
      id
      ytUrl
    }
  }
`

export { getPromotionVideos }
export type { PromotionVideo }
