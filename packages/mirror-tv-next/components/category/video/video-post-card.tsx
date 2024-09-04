import styles from './_styles/video-post-card.module.scss'
import ResponsiveImage from '~/components/shared/responsive-image'
import { PostImage } from '~/utils'

type VideoPostCardProps = {
  imageUrls: PostImage
  title: string
  href: string
}

export default function VideoPostCard({
  imageUrls,
  title,
  href,
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
          alt={title}
          rwd={{ mobile: '500px', tablet: '500px', desktop: '500px' }}
          priority={false}
        />
        <span className={styles.videoIcon}></span>
      </figure>
      <figcaption className={styles.title}>{title}</figcaption>
    </a>
  )
}
