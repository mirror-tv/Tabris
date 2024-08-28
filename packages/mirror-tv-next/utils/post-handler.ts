import { formateHeroImage } from './image-handler'
import type { PostCardItem } from '~/graphql/query/posts'
import type { PostImage } from '~/utils/image-handler'

export type FormattedPostCard = {
  href: string
  slug: string
  style?: string
  name: string
  images: PostImage
  publishTime: Date
  label?: string
}

const formatArticleCard = (
  post: PostCardItem,
  options?: { label?: string | undefined }
): FormattedPostCard => {
  const imageObj = post.heroImage || post.ogImage || {}
  return {
    href: `/story/${post.slug}`,
    slug: post.slug,
    style: post.style,
    name: post.name,
    images: formateHeroImage(imageObj),
    publishTime: new Date(post.publishTime),
    label: options?.label,
  }
}

export { formatArticleCard }
