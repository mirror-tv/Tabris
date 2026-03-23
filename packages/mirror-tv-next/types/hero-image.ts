import type { HeroImage } from './common'

export type K6FlatHeroImage = {
  original?: string
  w2400?: string
  w1600?: string
  w1200?: string
  w800?: string
  w480?: string
}

export type K6NestedHeroImage = {
  id?: string
  resized?: K6FlatHeroImage
}

export type FormattableHeroImage =
  | HeroImage
  | K6FlatHeroImage
  | K6NestedHeroImage
  | null
  | undefined
