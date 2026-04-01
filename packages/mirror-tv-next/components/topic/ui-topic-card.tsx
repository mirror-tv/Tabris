'use client'
import styles from './_styles/ui-topic-card.module.scss'
import { PostImage } from '~/utils'
import ResponsiveImage from '~/components/shared/responsive-image'
import { ApiData } from '~/types/api-data'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type UiPostCardProps = {
  title: string
  href: string
  images: PostImage
  imagesWebP?: PostImage
  formattedBrief: ApiData[]
}

export default function UiTopicCard({
  title = '',
  href = '',
  images,
  imagesWebP,
  formattedBrief,
}: UiPostCardProps) {
  const [brief, setBrief] = useState<string>('')
  useEffect(() => {
    setBrief(
      formattedBrief?.map((item) => item?.content?.[0] || '').join('<br>') ?? ''
    )
  }, [formattedBrief])

  return (
    <div className={styles.card}>
      <Link href={href} target="_blank" rel="noreferrer noopener">
        <div className={styles.cardTop}>
          <figure className={styles.cardImage}>
            <ResponsiveImage
              images={images}
              imagesWebP={imagesWebP}
              alt={title}
              rwd={{ mobile: '500px', tablet: '500px', desktop: '500px' }}
              priority={false}
            />
          </figure>
          <span className={styles.cardTitle}>{title}</span>
        </div>
        {brief && (
          <div className={styles.mask}>
            <p
              className={styles.brief}
              dangerouslySetInnerHTML={{ __html: brief }}
            />
          </div>
        )}
      </Link>
    </div>
  )
}
