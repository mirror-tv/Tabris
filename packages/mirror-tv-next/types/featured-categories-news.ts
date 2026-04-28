import type { K6FlatHeroImage } from './hero-image'

/**
 * Types for featured_categories_news.json
 */

export type RawFeaturedCategory = {
  id: string
  slug: string
  name: string
  ogTitle?: string
  ogDescription?: string
  isFeatured?: boolean
  sortOrder: number | null
  updatedAt?: string
  createdAt?: string
}

export type RawFeaturedPostHeroImage = {
  id?: string
  resized?: K6FlatHeroImage
}

export type RawFeaturedPostCategory = {
  id?: string
  name?: string
  slug?: string
}

export type RawFeaturedPost = {
  id: string
  name: string
  subtitle: string | null
  slug: string
  style: string
  publishTime: string
  exclusive: boolean
  categories: RawFeaturedPostCategory[]
  heroImage: RawFeaturedPostHeroImage | null
}

export type RawFeaturedShow = {
  id: string
  slug: string
  name: string
  sortOrder: number | null
  introduction: string | null
  facebookUrl: string | null
  playList01: string | null
  playList02: string | null
}

export type RawFeaturedCategoriesNewsJson = {
  categories: RawFeaturedCategory[]
  posts: RawFeaturedPost[]
  shows: RawFeaturedShow[]
}
