import { formateHeroImage } from './image-handler'
import type { PostImage } from '~/utils/image-handler'
import { type HeroImage } from '~/types/common'
import type { ApiData } from '~/types/api-data'

export type FormattedPostCard = {
  href: string
  slug: string
  style?: string
  name: string
  images: PostImage
  publishTime: Date
  label?: string
  __typename?: string
  exclusive?: boolean | null
}

export type FormattedPostCardJson = Omit<
  FormattedPostCard,
  'publishTime' | 'label'
> & {
  publishTime: string
  label?: string | null
}

// Legacy image format for backward compatibility
type LegacyImageFormat = {
  urlOriginal?: string
  urlDesktopSized?: string
  urlTabletSized?: string
  urlMobileSized?: string
  urlTinySized?: string
}

type FormatArticleCardInput = {
  slug: string
  name: string
  publishTime: string | Date
  heroImage?: HeroImage | LegacyImageFormat | null
  ogImage?: HeroImage | LegacyImageFormat | null
  thumbnail?: string | null
  images?: PostImage | null
  style?: string | null
  categories?: { name: string }[]
  partner?: { name: string; slug: string }
  __typename?: string
  exclusive?: boolean | null
}

const formatArticleCard = (
  post: FormatArticleCardInput,
  options?: { label?: string }
): FormattedPostCard => {
  const postFormatArticleCardInput = {
    slug: post.slug,
    name: post.name,
    publishTime: post.publishTime,
    heroImage: 'heroImage' in post ? post.heroImage : null,
    ogImage: 'ogImage' in post ? post.ogImage : null,
    thumbnail: 'thumbnail' in post ? post.thumbnail : null,
    images: 'images' in post ? post.images : null,
    style: 'style' in post ? post.style : undefined,
    categories: 'categories' in post ? post.categories : undefined,
    partner: 'partner' in post ? post.partner : undefined,
    __typename:
      '__typename' in post ? String(post['__typename'] ?? '') : undefined,
    exclusive: 'exclusive' in post ? post.exclusive ?? false : false,
  }

  // Handle legacy image format - convert to HeroImage format if needed
  let heroImageForFormatting: HeroImage | LegacyImageFormat | null | undefined =
    postFormatArticleCardInput.heroImage ?? postFormatArticleCardInput.ogImage

  // If it's a legacy format (has urlOriginal, urlDesktopSized, etc.), pass it as-is
  // formateHeroImage can handle both formats
  if (!heroImageForFormatting && postFormatArticleCardInput.thumbnail) {
    heroImageForFormatting = {
      imageApiData: {
        url: postFormatArticleCardInput.thumbnail ?? undefined,
        original: {
          url: postFormatArticleCardInput.thumbnail ?? undefined,
        },
      },
    }
  }

  const imageObj: PostImage =
    postFormatArticleCardInput.images ??
    formateHeroImage(heroImageForFormatting)

  return {
    href:
      postFormatArticleCardInput.__typename === 'External' ||
      postFormatArticleCardInput.partner?.slug === 'external'
        ? `/external/${post.slug}`
        : `/story/${post.slug}`,
    slug: postFormatArticleCardInput.slug,
    style: postFormatArticleCardInput.style ?? 'article',
    name: postFormatArticleCardInput.name,
    images: imageObj,
    publishTime: new Date(postFormatArticleCardInput.publishTime),
    label: options?.label || postFormatArticleCardInput.categories?.[0]?.name,
    __typename: postFormatArticleCardInput.__typename ?? '',
    exclusive: postFormatArticleCardInput.exclusive,
  }
}

const combineAndSortedByPublishedTime = (list: FormatArticleCardInput[]) => {
  const seenSlugs = new Set<string>()
  const uniqueList: FormattedPostCard[] = []

  list
    .map((post) => formatArticleCard(post))
    .sort((a, b) => {
      const dateA = new Date(a.publishTime || 0).getTime()
      const dateB = new Date(b.publishTime || 0).getTime()
      return dateB - dateA
    })
    .forEach((post) => {
      if (!seenSlugs.has(post.slug)) {
        seenSlugs.add(post.slug)
        uniqueList.push(post)
      }
    })
  return uniqueList
}

function doesHaveBrief(brief: ApiData[] | string = '') {
  if (typeof brief === 'string') {
    try {
      const parsed = JSON.parse(brief)
      brief = Array.isArray(parsed) ? parsed : []
    } catch {
      return false
    }
  }

  const validateArray = brief?.map((briefContent) => {
    return (
      briefContent?.content?.length > 1 || briefContent?.content[0]?.length > 0
    )
  })

  return (
    validateArray?.find((item) => {
      return item
    }) || false
  )
}

export { formatArticleCard, combineAndSortedByPublishedTime, doesHaveBrief }
