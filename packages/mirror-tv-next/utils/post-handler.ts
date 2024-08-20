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
}

const formatArticleCard = (post: PostCardItem): FormattedPostCard => {
  return {
    href: `/story/${post.slug}`,
    slug: post.slug,
    style: post.style,
    name: post.name,
    images: formateHeroImage(post.heroImage || post.ogImage || {}),
    publishTime: new Date(post.publishTime),
  }
}

export { formatArticleCard }
