import styles from './_styles/video-post-card.module.scss'
import { PostImage } from '~/utils'
import UiExclusiveMark from '~/components/shared/ui-exclusive-mark'
import NextResponsiveImage from '~/components/shared/next-responsive-image'

type VideoPostCardProps = {
  imageUrls: PostImage
  title: string
  href: string
  exclusive: boolean
}

function isDefaultImage(image: PostImage) {
  return !image.original || image.original?.includes('image-default')
}

export default function VideoPostCard({
  imageUrls,
  title,
  href,
  exclusive,
}: VideoPostCardProps) {
  return (
    <a
      className={styles.wrapper}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <figure className={styles.image}>
        <NextResponsiveImage
          fill
          loading="lazy"
          placeholder="blur"
          blurDataURL="/images/loading.svg"
          src={
            isDefaultImage(imageUrls)
              ? '/images/image-default.jpg'
              : imageUrls.original.replace(/\.(jpg|png)$/i, '.webP')
          }
          sizes="(max-width: 768px) 50vw, 30vw"
          srcSet={[480, 800]}
          alt={title}
          priority={false}
          fallback={imageUrls.original}
          style={{ aspectRatio: '9 / 5' }}
        />
        {exclusive && <UiExclusiveMark />}
        <span className={styles.videoIcon}></span>
      </figure>
      <figcaption className={styles.title}>{title}</figcaption>
    </a>
  )
}
