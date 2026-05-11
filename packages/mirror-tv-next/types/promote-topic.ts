import type { K6FlatHeroImage } from '~/types/common'

type PromoteTopicData = {
  id: string
  order: number | null
  slug: string
  name: string
  heroImage: {
    resized?: K6FlatHeroImage
    resizedWebp?: K6FlatHeroImage
  }
}

export type { PromoteTopicData }
