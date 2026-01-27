'use client'
import Image from '@readr-media/react-image'
import styles from './_styles/anchor-img.module.scss'
import type { HeroImage } from '~/types/common'
import { formateHeroImage } from '~/utils'

type Props = {
  heroImage: HeroImage
}

export default function AnchorImg({ heroImage }: Props) {
  const formattedHeroImage = formateHeroImage(heroImage)
  return (
    <figure className={styles.imageWrapper}>
      <Image
        images={formattedHeroImage}
        alt="主持人圖片"
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
    </figure>
  )
}
