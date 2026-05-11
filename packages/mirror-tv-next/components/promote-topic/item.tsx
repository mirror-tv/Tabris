'use client'

import CustomImage from '@readr-media/react-image'
import type { PromoteTopicData } from '~/types/promote-topic'
import styles from './_styles/item.module.scss'

type PromoteTopicItemProps = {
  topic: PromoteTopicData
}

export default function PromoteTopicItem({ topic }: PromoteTopicItemProps) {
  const images = topic.heroImage.resized ?? {}
  const imagesWebP = topic.heroImage.resizedWebp ?? null

  return (
    <a
      className={styles.card}
      href={`/topic/${topic.slug}`}
      target="_blank"
      rel="noreferrer"
    >
      <div className={styles.imageFrame}>
        <CustomImage
          images={images}
          imagesWebP={imagesWebP}
          loadingImage="/images/loading.svg"
          defaultImage="/images/image-default.jpg"
          rwd={{
            mobile: '124px',
            tablet: '124px',
            laptop: '124px',
            desktop: '124px',
            default: '124px',
          }}
          alt={`推廣專題-${topic.name}`}
        />
      </div>
      <div className={styles.titleFrame}>
        <p className={styles.title}>{topic.name}</p>
      </div>
    </a>
  )
}
