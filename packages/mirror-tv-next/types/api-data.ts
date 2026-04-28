import type { FormattableHeroImage } from './hero-image'

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
  heroImage: FormattableHeroImage
}

export type FormatPlayListItems = {
  name?: string
  id: string
  items: { id: string; title: string }[] | undefined
  nextPageToken: string | undefined
  totalItems: number
}
