'use client'

import ResponsiveImage from '~/components/shared/responsive-image'
import type { PromoteTopicData } from '~/types/promote-topic'
import { formateHeroImage } from '~/utils'
import styles from './_styles/item.module.scss'

type PromoteTopicItemProps = {
  topic: PromoteTopicData
}

export default function PromoteTopicItem({ topic }: PromoteTopicItemProps) {
  const { images, imagesWebP } = formateHeroImage(topic.heroImage)

  return (
    <a
      className={styles.card}
      href={`/topic/${topic.slug}`}
      target="_blank"
      rel="noreferrer"
    >
      <div className={styles.imageFrame}>
        <ResponsiveImage
          images={images}
          imagesWebP={imagesWebP}
          alt={`推廣專題-${topic.name}`}
          sizes="124px"
        />
      </div>
      <div className={styles.titleFrame}>
        <p className={styles.title}>{topic.name}</p>
      </div>
    </a>
  )
}
