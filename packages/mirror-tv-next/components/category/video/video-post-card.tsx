import styles from './_styles/video-post-card.module.scss'
import ResponsiveImage from '~/components/shared/responsive-image'
import { PostImage } from '~/utils'
import UiExclusiveMark from '~/components/shared/ui-exclusive-mark'

type VideoPostCardProps = {
  imageUrls: PostImage
  imageUrlsWebP?: PostImage
  title: string
  href: string
  exclusive: boolean
  slug?: string
}

export default function VideoPostCard({
  imageUrls,
  imageUrlsWebP,
  title,
  href,
  exclusive,
  slug = '',
}: VideoPostCardProps) {
  return (
    <a
      className={styles.wrapper}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <figure className={styles.image}>
        <ResponsiveImage
          images={imageUrls}
          imagesWebP={imageUrlsWebP}
          alt={title}
          rwd={{ mobile: '500px', tablet: '500px', desktop: '500px' }}
          priority={false}
          slug={slug}
        />
        {exclusive && <UiExclusiveMark />}
        <span className={styles.videoIcon}></span>
      </figure>
      <figcaption className={styles.title}>{title}</figcaption>
    </a>
  )
}
