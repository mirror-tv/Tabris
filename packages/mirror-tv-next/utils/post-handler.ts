import { formateHeroImage } from './image-handler'
import type { PostImage } from '~/utils/image-handler'
import type { ApiData } from '~/types/api-data'
import type { FormattableHeroImage } from '~/types/hero-image'

export type FormattedPostCard = {
  href: string
  slug: string
  style?: string
  name: string
  images: PostImage
  imagesWebP?: PostImage
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

type FormatArticleCardInput = {
  slug: string
  name: string
  publishTime: string | Date
  heroImage?: FormattableHeroImage | string | null
  ogImage?: FormattableHeroImage
  thumbnail?: string | null
  images?: PostImage | null
  imagesWebP?: PostImage | null
  style?: string | null
  categories?: { name: string }[]
  partner?: { name: string; slug?: string }
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
    imagesWebP: 'imagesWebP' in post ? post.imagesWebP : null,
    style: 'style' in post ? post.style : undefined,
    categories: 'categories' in post ? post.categories : undefined,
    partner: 'partner' in post ? post.partner : undefined,
    __typename:
      '__typename' in post ? String(post['__typename'] ?? '') : undefined,
    exclusive: 'exclusive' in post ? post.exclusive ?? false : false,
  }

  let heroImageForFormatting: FormattableHeroImage | string | null =
    postFormatArticleCardInput.heroImage ?? postFormatArticleCardInput.ogImage

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

  const formattedHeroImage = formateHeroImage(heroImageForFormatting)
  const imageObj: PostImage =
    postFormatArticleCardInput.images ?? formattedHeroImage.images

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
    imagesWebP:
      postFormatArticleCardInput.imagesWebP ?? formattedHeroImage.imagesWebP,
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
