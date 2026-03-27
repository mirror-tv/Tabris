'use client'
import Image from '@readr-media/react-image'
import type { PostImage } from '~/utils'

type UiPostCardProps = {
  images: PostImage
  imagesWebP?: PostImage
  alt: string
  priority: boolean
  rwd?: {
    mobile?: string
    tablet?: string
    laptop?: string
    desktop?: string
    default?: string
  }
  imgClassName?: string
}

export default function ResponsiveImage({
  images,
  imagesWebP,
  alt = '',
  priority = true,
  rwd = {
    mobile: '100vw',
    tablet: '100vw',
    laptop: '100vw',
    desktop: '100vw',
    default: '100vw',
  },
  imgClassName = '',
}: UiPostCardProps) {
  return (
    <Image
      images={images}
      imagesWebP={imagesWebP}
      alt={alt}
      loadingImage={priority ? undefined : '/images/loading.svg'}
      defaultImage="/images/image-default.jpg"
      rwd={rwd}
      priority={priority}
      className={imgClassName}
    />
  )
}
