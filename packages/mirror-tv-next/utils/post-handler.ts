import { formateHeroImage } from './image-handler'
import type { PostImage } from '~/utils/image-handler'
import { type HeroImage } from '~/types/common'

export type FormattedPostCard = {
  href: string
  slug: string
  style?: string
  name: string
  images: PostImage
  publishTime: Date
  label?: string
  __typeName?: string
}

type FormatArticleCardInput = {
  slug: string
  name: string
  publishTime: string | Date
  heroImage?: HeroImage | null
  ogImage?: HeroImage | null
  thumbnail?: string | null
  style?: string
  categories?: { name: string }[]
  __typename?: string
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
    style: 'style' in post ? post.style : undefined,
    categories: 'categories' in post ? post.categories : undefined,
    __typename:
      '__typename' in post ? String(post['__typename'] ?? '') : undefined,
  }
  const imageObj =
    postFormatArticleCardInput.heroImage ??
    postFormatArticleCardInput.ogImage ??
    (postFormatArticleCardInput.thumbnail
      ? { urlOriginal: postFormatArticleCardInput.thumbnail }
      : {})
  return {
    href:
      postFormatArticleCardInput.__typename === 'External'
        ? `/external/${post.slug}`
        : `/story/${post.slug}`,
    slug: postFormatArticleCardInput.slug,
    style: postFormatArticleCardInput.style ?? 'article',
    name: postFormatArticleCardInput.name,
    images: formateHeroImage(imageObj),
    publishTime: new Date(postFormatArticleCardInput.publishTime),
    label: options?.label || postFormatArticleCardInput.categories?.[0]?.name,
    __typeName: postFormatArticleCardInput.__typename ?? '',
  }
}

export { formatArticleCard }
