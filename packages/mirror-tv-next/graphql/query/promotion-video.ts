import gql from 'graphql-tag'

type PromotionVideo = {
  id: string
  ytUrl: string
}

const getPromotionVideos = gql`
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
