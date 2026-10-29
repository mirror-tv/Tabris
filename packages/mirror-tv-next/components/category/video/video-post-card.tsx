import styles from './_styles/video-post-card.module.scss'
import { PostImage } from '~/utils'
import UiExclusiveMark from '~/components/shared/ui-exclusive-mark'
import ResponsiveImage from '~/components/shared/responsive-image'

type VideoPostCardProps = {
  imageUrls: PostImage
  title: string
  href: string
  exclusive: boolean
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
        <ResponsiveImage
          images={imageUrls.original}
          fill
          sizes="(max-width: 767px) 50vw, (max-width: 1199px) 216px, 234px"
          alt={title}
          style={{ aspectRatio: '9 / 5' }}
        />
        {exclusive && <UiExclusiveMark />}
        <span className={styles.videoIcon}></span>
      </figure>
      <figcaption className={styles.title}>{title}</figcaption>
    </a>
  )
}
