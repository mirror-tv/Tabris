import gql from 'graphql-tag'

type PromotionVideo = {
  id: string
  ytUrl: string
}

const getPromotionVideos = gql`
  query getPromotionVideos($first: Int = 5) {
    allPromotionVideos(
      where: { state: published }
      first: $first
      sortBy: [sortOrder_ASC, updatedAt_DESC]
    ) {
      id
      ytUrl
    }
  }
`

export { getPromotionVideos }
export type { PromotionVideo }
