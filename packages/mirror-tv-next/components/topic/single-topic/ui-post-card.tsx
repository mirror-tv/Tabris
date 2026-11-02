import ResponsiveImage from '~/components/shared/responsive-image'
import Link from '~/components/shared/link'
import type { Post } from '~/graphql/query/topic'
import styles from './_styles/ui-post-card.module.scss'
import { formateHeroImage } from '~/utils'

type Props = {
  item: Post
}

export default function UiPostCard({ item }: Props) {
  const { images, imagesWebP } = formateHeroImage(item.heroImage ?? {})
  return (
    <Link
      href={`/story/${item.slug}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          {item.categories?.[0]?.name && (
            <div className={styles.categoryTag}>{item.categories[0].name}</div>
          )}
          <ResponsiveImage
            images={images}
            imagesWebP={imagesWebP}
            alt={item.title}
            sizes="(max-width: 767px) calc(100vw - 54px), (max-width: 1199px) 211px, 317px"
          />
        </div>
        <div className={styles.postTitle}>{item.title}</div>
      </div>
    </Link>
  )
}
