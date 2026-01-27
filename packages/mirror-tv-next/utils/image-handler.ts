import { type PostCardItem } from '~/graphql/query/posts'
import { Topic } from '~/graphql/query/topic'
import type { HeroImage } from '~/types/common'

type Post = PostCardItem

export type PostImage = {
  original: string
  w3200?: string
  w2400?: string
  w1600?: string
  w800?: string
  w400?: string
}

function formatePostImage(post: Post | Topic): PostImage {
  const images: PostImage = {
    original: '/images/image-default.jpg',
  }

  if (!post) {
    return images
  }

  const { heroImage } = post

  images.w3200 = heroImage?.urlOriginal ?? ''
  images.w1600 = heroImage?.urlTabletSized ?? ''
  images.w800 = heroImage?.urlMobileSized ?? ''

  if (heroImage && 'urlDesktopSized' in heroImage) {
    images.w2400 = heroImage?.urlDesktopSized ?? ''
  }

  if (heroImage && 'urlTinySized' in heroImage) {
    images.w2400 = heroImage?.urlTinySized ?? ''
  }

  return images
}

function formateHeroImage(heroImage: HeroImage | undefined) {
  const images: PostImage = {
    original: '/images/image-default.jpg',
  }

  images.w3200 = heroImage?.urlOriginal ?? ''
  images.w2400 = heroImage?.urlDesktopSized ?? ''
  images.w1600 = heroImage?.urlTabletSized ?? ''
  images.w800 = heroImage?.urlMobileSized ?? ''
  images.w400 = heroImage?.urlTinySized ?? ''

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
