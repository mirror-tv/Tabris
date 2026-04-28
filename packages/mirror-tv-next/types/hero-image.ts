import type { HeroImage, K6FlatHeroImage } from './common'

export type { K6FlatHeroImage }

export type K6NestedHeroImage = {
  id?: string
  resized?: K6FlatHeroImage
  resizedWebp?: K6FlatHeroImage
}

export type FormattableHeroImage =
  | HeroImage
  | K6FlatHeroImage
  | K6NestedHeroImage
  | null
  | undefined
