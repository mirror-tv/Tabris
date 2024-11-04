import type { HeroImage } from './common'

export type ApiData = {
  id: string
  type: string
  alignment: string
  content: string[]
  styles: Record<string, unknown>
}

type Category = {
  id: string
  name: string
  slug: string
}

export type FeaturePost = {
  id: string
  name: string
  subtitle: string
  slug: string
  style: string
  publishTime: string
  categories: Category[]
  heroImage: HeroImage
}
