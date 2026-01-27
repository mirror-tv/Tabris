import { type PostCardItem } from '~/graphql/query/posts'
import { Topic } from '~/graphql/query/topic'
import type { HeroImage, ImageApiData } from '~/types/common'

type Post = PostCardItem

export type PostImage = {
  original: string
  w3200?: string
  w2400?: string
  w1600?: string
  w800?: string
  w400?: string
}

function parseImageApiData(
  imageApiData: HeroImage['imageApiData']
): ImageApiData | undefined {
  if (!imageApiData) {
    return undefined
  }

  if (typeof imageApiData === 'string') {
    try {
      return JSON.parse(imageApiData) as ImageApiData
    } catch {
      return undefined
    }
  }

  return imageApiData
}

function formatePostImage(post: Post | Topic): PostImage {
  const images: PostImage = {
    original: '/images/image-default.jpg',
  }

  if (!post) {
    return images
  }

  const { heroImage } = post
  const imageApiData = parseImageApiData(heroImage?.imageApiData)
  if (imageApiData) {
    const w1600 = imageApiData.w1600?.url || imageApiData.w1200?.url
    const w800 = imageApiData.w800?.url || imageApiData.w480?.url
    const original = imageApiData.original?.url || imageApiData.url

    if (original) images.original = original
    if (original) images.w3200 = original
    if (imageApiData.w2400?.url) images.w2400 = imageApiData.w2400.url
    if (w1600) images.w1600 = w1600
    if (w800) images.w800 = w800
    if (imageApiData.w480?.url) images.w400 = imageApiData.w480.url
  }

  return images
}

// Legacy image format types for backward compatibility
type LegacyImageFormat = {
  urlOriginal?: string
  urlDesktopSized?: string
  urlTabletSized?: string
  urlMobileSized?: string
  urlTinySized?: string
}

function formateHeroImage(
  heroImage:
    | HeroImage
    | null
    | undefined
    | LegacyImageFormat
    | Record<string, never>
) {
  const images: PostImage = {
    original: '/images/image-default.jpg',
  }

  // Handle null or empty object
  if (
    !heroImage ||
    (typeof heroImage === 'object' && Object.keys(heroImage).length === 0)
  ) {
    return images
  }

  // Check if it's a legacy format (has urlOriginal, urlDesktopSized, etc.)
  if (
    'urlOriginal' in heroImage ||
    'urlDesktopSized' in heroImage ||
    'urlMobileSized' in heroImage ||
    'urlTabletSized' in heroImage ||
    'urlTinySized' in heroImage
  ) {
    const legacy = heroImage as LegacyImageFormat
    if (legacy.urlOriginal) {
      images.original = legacy.urlOriginal
      images.w3200 = legacy.urlOriginal
    }
    if (legacy.urlDesktopSized) images.w2400 = legacy.urlDesktopSized
    if (legacy.urlTabletSized) images.w1600 = legacy.urlTabletSized
    if (legacy.urlMobileSized) images.w800 = legacy.urlMobileSized
    if (legacy.urlTinySized) images.w400 = legacy.urlTinySized
    return images
  }

  // Handle new format with imageApiData
  const imageApiData = parseImageApiData(
    'imageApiData' in heroImage && (heroImage as HeroImage).imageApiData
      ? (heroImage as HeroImage).imageApiData
      : undefined
  )
  if (imageApiData) {
    const w1600 = imageApiData.w1600?.url || imageApiData.w1200?.url
    const w800 = imageApiData.w800?.url || imageApiData.w480?.url
    const original = imageApiData.original?.url || imageApiData.url

    if (original) images.original = original
    if (original) images.w3200 = original
    if (imageApiData.w2400?.url) images.w2400 = imageApiData.w2400.url
    if (w1600) images.w1600 = w1600
    if (w800) images.w800 = w800
    if (imageApiData.w480?.url) images.w400 = imageApiData.w480.url
  }

  return images
}

const getHeroImageOfAmp = (heroImage: PostImage): string => {
  return (
    heroImage.w800 ??
    heroImage.w1600 ??
    heroImage.w2400 ??
    heroImage.w3200 ??
    heroImage.w400 ??
    '/images/default-og-img.jpg'
  )
}

export { formateHeroImage, formatePostImage, getHeroImageOfAmp }
