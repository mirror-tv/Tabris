import ResponsiveImage from '~/components/shared/responsive-image'
import Link from '~/components/shared/link'
import { formateHeroImage } from '~/utils'
import type { Post } from '~/graphql/query/ombuds'
import styles from './_styles/ui-post-card.module.scss'
import dayjs from 'dayjs'
import UiExclusiveMark from '../shared/ui-exclusive-mark'

type Props = {
  item: Post
}

export default function UiPostCard({ item }: Props) {
  function formatDate(date: string): string {
    return dayjs(date).format('YYYY/MM/DD HH:mm')
  }

  const { images, imagesWebP } = formateHeroImage(item.heroImage ?? {})

  return (
    <Link
      href={`/story/${item.slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.cardWrapper}
    >
      <div className={styles.imageWrapper}>
        <ResponsiveImage
          images={images}
          imagesWebP={imagesWebP}
          alt={item.name}
          sizes="(max-width: 767px) 132px, (max-width: 1199px) 192px, 228px"
        />
        {item.exclusive && <UiExclusiveMark />}
      </div>
      <span className={styles.infoWrapper}>
        <span className={styles.title}>{item.name}</span>
        <span className={styles.date}>{formatDate(item.publishTime)}</span>
      </span>
    </Link>
  )
}
