import type { HeroImage, ImageApiData, K6FlatHeroImage } from '~/types/common'
import type {
  FormattableHeroImage,
  K6NestedHeroImage,
} from '~/types/hero-image'
import { withBasePath } from '~/constants/with-base-path'

export type PostImage = {
  original: string
  w3200?: string
  w2400?: string
  w1600?: string
  w800?: string
  w400?: string
}

export type FormattedResponsiveImage = {
  images: PostImage
  imagesWebP?: PostImage
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

function toNonEmptyString(value?: string | null) {
  if (typeof value !== 'string') {
    return undefined
  }

  const trimmedValue = value.trim()
  return trimmedValue ? trimmedValue : undefined
}

function createDefaultPostImage(): PostImage {
  return {
    original: withBasePath('/images/image-default.jpg'),
  }
}

function formateImageApiDataToPostImage(
  imageApiData: HeroImage['imageApiData']
): PostImage | undefined {
  const parsedImageApiData = parseImageApiData(imageApiData)

  if (!parsedImageApiData) {
    return undefined
  }

  const images = createDefaultPostImage()
  const original =
    toNonEmptyString(parsedImageApiData.original?.url) ??
    toNonEmptyString(parsedImageApiData.url)
  const w1600 =
    toNonEmptyString(parsedImageApiData.w1600?.url) ??
    toNonEmptyString(parsedImageApiData.w1200?.url)
  const w800 =
    toNonEmptyString(parsedImageApiData.w800?.url) ??
    toNonEmptyString(parsedImageApiData.w480?.url)
  const w2400 = toNonEmptyString(parsedImageApiData.w2400?.url)
  const w400 = toNonEmptyString(parsedImageApiData.w480?.url)

  if (original) {
    images.original = original
    images.w3200 = original
  }
  if (w2400) {
    images.w2400 = w2400
  }
  if (w1600) {
    images.w1600 = w1600
  }
  if (w800) {
    images.w800 = w800
  }
  if (w400) {
    images.w400 = w400
  }

  return images
}

function formateK6HeroImage(
  heroImage: K6FlatHeroImage | undefined,
  { fallbackToDefault = true }: { fallbackToDefault?: boolean } = {}
): PostImage | undefined {
  if (!heroImage) {
    return fallbackToDefault ? createDefaultPostImage() : undefined
  }

  const original =
    toNonEmptyString(heroImage.original) ??
    toNonEmptyString(heroImage.w2400) ??
    toNonEmptyString(heroImage.w1600) ??
    toNonEmptyString(heroImage.w1200) ??
    toNonEmptyString(heroImage.w800) ??
    toNonEmptyString(heroImage.w480)

  if (!original) {
    return fallbackToDefault ? createDefaultPostImage() : undefined
  }

  const images: PostImage = {
    original,
    w3200: original,
  }
  const w2400 = toNonEmptyString(heroImage.w2400)
  const w1600 =
    toNonEmptyString(heroImage.w1600) ?? toNonEmptyString(heroImage.w1200)
  const w800 = toNonEmptyString(heroImage.w800)
  const w400 = toNonEmptyString(heroImage.w480)

  if (w2400) {
    images.w2400 = w2400
  }
  if (w1600) {
    images.w1600 = w1600
  }
  if (w800) {
    images.w800 = w800
  }
  if (w400) {
    images.w400 = w400
  }

  return images
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function isLegacyHeroImage(heroImage: unknown): heroImage is HeroImage {
  return (
    isRecord(heroImage) &&
    ('urlOriginal' in heroImage ||
      'urlDesktopSized' in heroImage ||
      'urlMobileSized' in heroImage ||
      'urlTabletSized' in heroImage ||
      'urlTinySized' in heroImage)
  )
}

function isK6NestedHeroImage(
  heroImage: unknown
): heroImage is K6NestedHeroImage {
  return (
    isRecord(heroImage) &&
    ('resized' in heroImage || 'resizedWebp' in heroImage)
  )
}

function isK6FlatHeroImage(heroImage: unknown): heroImage is K6FlatHeroImage {
  return (
    isRecord(heroImage) &&
    ('w480' in heroImage ||
      'w800' in heroImage ||
      'w1200' in heroImage ||
      'w1600' in heroImage ||
      'w2400' in heroImage ||
      'original' in heroImage)
  )
}

function formateHeroImage(
  heroImage: FormattableHeroImage | Record<string, never> | string
): FormattedResponsiveImage {
  if (typeof heroImage === 'string') {
    return heroImage
      ? { images: { original: heroImage, w3200: heroImage } }
      : { images: createDefaultPostImage() }
  }

  if (
    !heroImage ||
    (typeof heroImage === 'object' && Object.keys(heroImage).length === 0)
  ) {
    return {
      images: createDefaultPostImage(),
    }
  }

  if (isLegacyHeroImage(heroImage)) {
    const images = createDefaultPostImage()
    const original = toNonEmptyString(heroImage.urlOriginal)
    const w2400 = toNonEmptyString(heroImage.urlDesktopSized)
    const w1600 = toNonEmptyString(heroImage.urlTabletSized)
    const w800 = toNonEmptyString(heroImage.urlMobileSized)
    const w400 = toNonEmptyString(heroImage.urlTinySized)

    if (original) {
      images.original = original
      images.w3200 = original
    }
    if (w2400) {
      images.w2400 = w2400
    }
    if (w1600) {
      images.w1600 = w1600
    }
    if (w800) {
      images.w800 = w800
    }
    if (w400) {
      images.w400 = w400
    }

    return {
      images,
    }
  }

  if (isK6NestedHeroImage(heroImage)) {
    const imageApiData =
      isRecord(heroImage) && 'imageApiData' in heroImage
        ? (heroImage.imageApiData as HeroImage['imageApiData'])
        : undefined

    return {
      // GraphQL may include resized/resizedWebp keys with null values, so keep
      // the fallback order explicit: resized -> imageApiData -> default image.
      images:
        formateK6HeroImage(heroImage.resized, { fallbackToDefault: false }) ??
        formateImageApiDataToPostImage(imageApiData) ??
        createDefaultPostImage(),
      imagesWebP: formateK6HeroImage(heroImage.resizedWebp, {
        fallbackToDefault: false,
      }),
    }
  }

  if (isK6FlatHeroImage(heroImage)) {
    return {
      images: formateK6HeroImage(heroImage) ?? createDefaultPostImage(),
    }
  }

  const images = formateImageApiDataToPostImage(
    'imageApiData' in heroImage ? heroImage.imageApiData : undefined
  )

  return {
    images: images ?? createDefaultPostImage(),
  }
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

export { formateHeroImage, getHeroImageOfAmp }
