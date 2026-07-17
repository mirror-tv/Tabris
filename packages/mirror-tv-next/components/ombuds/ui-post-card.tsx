import Image from '@readr-media/react-image'
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
        <Image
          images={images}
          imagesWebP={imagesWebP}
          alt={item.name}
          loadingImage="/images/loading.svg"
          defaultImage="/images/image-default.jpg"
          rwd={{
            mobile: '500px',
            tablet: '500px',
            laptop: '500px',
            desktop: '500px',
            default: '500px',
          }}
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
